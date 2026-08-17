"use client";

import { useState } from "react";
import { Check, MessageCircle, Send } from "lucide-react";
import { siteConfig, telHref, whatsappHref, services } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@ishub/site-kit/analytics";

/**
 * Primary lead/quote form (brief G1). Low-friction: name + phone required.
 *
 * Delivers via Web3Forms (https://api.web3forms.com/submit) so the lead is emailed to the
 * business inbox (contact.email) from any static host — no backend/PHP needed. The PUBLIC
 * access key comes from the manifest (siteConfig.formAccessKey), with a NEXT_PUBLIC_WEB3FORMS_KEY
 * env override for local dev. WhatsApp is offered as a one-tap alternative and as the fallback
 * if delivery fails. Honeypot blocks bots.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY =
  siteConfig.formAccessKey ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export function LeadForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  /** WhatsApp deep link carrying the typed form data — the visible recovery path on failure. */
  const [recoveryHref, setRecoveryHref] = useState<string | null>(null);

  function buildWhatsapp(form: HTMLFormElement): string {
    const d = new FormData(form);
    const text = [
      `שלום, אני ${(d.get("name") as string) || ""}.`.trim(),
      (d.get("service") as string) ? `מעוניין/ת ב: ${d.get("service")}.` : "",
      (d.get("message") as string) || "",
      `טלפון לחזרה: ${(d.get("phone") as string) || ""}`,
    ]
      .filter(Boolean)
      .join("\n");
    return whatsappHref(text);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if ((data.get("company") as string)?.length) return; // honeypot
    const name = (data.get("name") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    if (!name || !phone) {
      setRecoveryHref(null);
      setError("נא למלא שם וטלפון");
      return;
    }
    setError(null);
    setRecoveryHref(null);
    setStatus("sending");

    // No access key (local dev only): simulate so `next dev` works. Production builds always
    // ship a provisioned key, so an empty key in production is a misconfig — fall back to
    // WhatsApp rather than silently pretending the lead was sent.
    if (!WEB3FORMS_KEY) {
      if (process.env.NODE_ENV !== "production") {
        await new Promise((r) => setTimeout(r, 600));
        setStatus("done");
        return;
      }
      setStatus("error");
      setRecoveryHref(buildWhatsapp(form));
      setError("השליחה מהאתר אינה זמינה כרגע — הפנייה לא נשלחה.");
      trackEvent("lead_submit_failed", { form: "lead", reason: "no_key" });
      window.open(buildWhatsapp(form), "_blank", "noopener");
      return;
    }

    // First-touch attribution, written by the inline snippet in app/layout.tsx and
    // disclosed in /privacy/. Sent to the business inbox only — never into GA4.
    let firstTouch: { ref?: string; landing?: string } = {};
    try {
      firstTouch = JSON.parse(sessionStorage.getItem("ss_first_touch") ?? "{}");
    } catch {
      /* storage unavailable — attribution is best-effort */
    }
    const service = (data.get("service") as string) || "לא צוין";
    const message = (data.get("message") as string) || "";

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `פנייה חדשה מהאתר — ${name}`,
          from_name: siteConfig.name,
          name,
          phone,
          service,
          message: message || "—",
          page: window.location.pathname,
          first_touch_ref: firstTouch.ref ?? "",
          first_touch_landing: firstTouch.landing ?? "",
          // Spam-law (סע' 30א) gate: nurture beyond the specific request only when true.
          marketing_consent: data.get("marketing_consent") === "on" ? "כן" : "לא",
        }),
      });
      const result: { success?: boolean } = await res.json();
      if (!res.ok || !result.success) throw new Error("bad status");
      setStatus("done");
      // GTM conversion hook: fires only on a CONFIRMED send (the dev simulation above does not).
      // No PII in params — GA4 ToS + privacy-law exposure.
      trackEvent("lead_submit", {
        form: "lead",
        service,
        has_message: !!message,
        message_length: message.length,
      });
    } catch {
      // Delivery failed. window.open after an await sits outside the user-gesture window and
      // is routinely popup-blocked, so the RENDERED recovery links below are the real
      // fallback — the open() is a best-effort bonus only.
      setRecoveryHref(buildWhatsapp(form));
      setError("השליחה נכשלה והפנייה לא הגיעה אלינו.");
      setStatus("error");
      trackEvent("lead_submit_failed", { form: "lead", reason: "delivery" });
      window.open(buildWhatsapp(form), "_blank", "noopener");
    }
  }

  if (status === "done") {
    return (
      <div className={cn("rounded-xl bg-green-50 p-6 text-center", className)}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-3 font-heading text-lg font-bold text-primary">
          תודה! קיבלנו את הפנייה
        </p>
        <p className="mt-1 text-sm text-gray-600">
          נחזור אליכם בהקדם. צריכים מענה מיידי? התקשרו אלינו.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      <div>
        <label htmlFor="lf-name" className="mb-1 block text-sm font-medium text-gray-700">
          שם מלא
        </label>
        <input
          id="lf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={fieldClass}
          placeholder="ישראל ישראלי"
        />
      </div>

      <div>
        <label
          htmlFor="lf-phone"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          טלפון
        </label>
        <input
          id="lf-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          dir="ltr"
          className={cn(fieldClass, "text-right")}
          placeholder="050-0000000"
        />
      </div>

      <div>
        <label
          htmlFor="lf-service"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          השירות שמעניין אתכם (אופציונלי)
        </label>
        <select id="lf-service" name="service" className={fieldClass} defaultValue="">
          <option value="">בחירת שירות…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="lf-message"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          ספרו לנו על הפרויקט (אופציונלי)
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={3}
          className={fieldClass}
          placeholder="לדוגמה: פרגולה חשמלית למרפסת בגודל 4×3 מ׳…"
        />
      </div>

      {/* Marketing consent — unchecked by default (חוק הספאם: opt-in must be an active
          choice, never pre-ticked). Submitting without it is fully allowed; it gates only
          future updates/offers, not the reply to this request. */}
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          name="marketing_consent"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-secondary/40"
        />
        <span>אני מאשר/ת קבלת עדכונים והצעות מ{siteConfig.name} (לא חובה)</span>
      </label>

      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="lf-company">אל תמלאו שדה זה</label>
        <input
          id="lf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <p className="font-medium text-red-700">{error}</p>
          {recoveryHref && (
            <p className="mt-2 text-gray-700">
              כדי שהפנייה לא תלך לאיבוד:{" "}
              <a
                href={recoveryHref}
                target="_blank"
                rel="noopener"
                className="font-semibold text-[#0E7A34] underline"
              >
                שליחת הפרטים בוואטסאפ
              </a>{" "}
              או חיוג ישיר:{" "}
              <a href={telHref} className="font-semibold text-primary underline" dir="ltr">
                {siteConfig.phone}
              </a>
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        <Send className="h-5 w-5" aria-hidden />
        {status === "sending" ? "שולח…" : "שליחה וקבלת הצעת מחיר"}
      </Button>

      <p className="text-center text-xs text-gray-500">
        הפרטים משמשים אך ורק לחזרה אליכם ·{" "}
        <a href="/privacy/" className="underline hover:text-gray-700">
          מדיניות פרטיות
        </a>
      </p>

      <p className="text-center text-xs text-gray-500">
        מעדיפים וואטסאפ?{" "}
        <a
          href={whatsappHref("היי, אני מעוניין/ת בהצעת מחיר לפרויקט אלומיניום")}
          className="inline-flex items-center gap-1 font-semibold text-[#0E7A34] hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          שלחו לנו הודעה
        </a>
      </p>
    </form>
  );
}
