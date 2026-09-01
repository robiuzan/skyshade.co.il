"use client";

import { useEffect, useId, useRef, useState } from "react";
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

export function LeadForm({
  className,
  /**
   * Where this instance sits, sent as `form_location` on every event. Without it the
   * form_start → generate_lead funnel cannot be read per placement, which is the whole point
   * of measuring it. Categorical only — never anything derived from user input.
   */
  location = "unknown",
  /**
   * Pre-selects the service dropdown. Service pages pass their own `card.name` so the visitor
   * never re-states what the page they are on already says — the single biggest friction cut
   * available on those templates. Must be one of the `services[].name` values or the <select>
   * silently falls back to the empty option.
   */
  defaultService,
  /**
   * Drops the free-text field. Used where the form is a secondary element on the page (city
   * pages) and every extra field costs completions; name + phone + service is enough to call
   * someone back.
   */
  compact = false,
}: {
  className?: string;
  location?: string;
  defaultService?: string;
  compact?: boolean;
}) {
  // Unique per instance: two forms on one page (hero + section, or an A/B variant) would
  // otherwise emit duplicate ids and break every <label for> — clicking a label would focus
  // the wrong form's field. useId is SSR-safe, so the static export and the hydrated DOM agree.
  const uid = useId();
  const fid = (name: string) => `lf-${name}-${uid}`;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  /** WhatsApp deep link carrying the typed form data — the visible recovery path on failure. */
  const [recoveryHref, setRecoveryHref] = useState<string | null>(null);
  /** form_start fires once per mount, on first interaction — not on render. */
  const [started, setStarted] = useState(false);
  /** Which required field failed, so it can be marked aria-invalid. "name" | "phone" | null. */
  const [invalidField, setInvalidField] = useState<"name" | "phone" | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Success replaces the whole <form> with a div, so focus is already on <body> by then — the
  // submit button is disabled during the fetch, which blurs it. Moving focus INTO the
  // role="status" container is what actually announces the result; a live region alone races
  // its own mount. Declared above the `status === "done"` early return: a hook below a
  // conditional return throws "rendered fewer hooks than expected" on the render that flips.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  function handleFirstInteraction() {
    if (started) return;
    setStarted(true);
    trackEvent("form_start", { form_location: location });
  }

  function buildWhatsapp(form: HTMLFormElement): string {
    const d = new FormData(form);
    const text = [
      `שלום, אני ${(d.get("name") as string) || ""}.`.trim(),
      // ב is a proclitic — it binds to the word, never "ב: ". Keep the "" branch: the
      // .filter(Boolean) below depends on it to drop the line when no service was chosen.
      (d.get("service") as string) ? `מעוניין/ת ב${d.get("service")}.` : "",
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

    // The form is noValidate, so `required` never fires — this block IS the whole gate.
    // getElementById, not querySelector: useId() emits ids containing colons (lf-name-:r0:)
    // which are not parseable as a CSS selector. .focus() re-enters the bubbling onFocus
    // handler, but the `started` guard keeps form_start at one push per mount.
    function reject(field: "name" | "phone", message: string) {
      setRecoveryHref(null);
      setInvalidField(field);
      setError(message);
      (document.getElementById(fid(field)) as HTMLInputElement | null)?.focus();
    }

    if (!name) {
      reject("name", "נא למלא שם מלא");
      return;
    }
    if (!phone) {
      reject("phone", "נא למלא מספר טלפון");
      return;
    }
    // Floor only, no ceiling. 9 digits = an Israeli landline (03-1234567); mobiles are 10 and
    // +972 forms 12. Someone who types two numbers or adds an extension must never be rejected —
    // a false rejection costs a real lead, which is the one price this form cannot pay. This
    // catches "0" and truncation, nothing subtler; do not credit it with more.
    if (phone.replace(/\D/g, "").length < 9) {
      reject("phone", "מספר הטלפון נראה קצר מדי — בדקו שוב (למשל 050-0000000)");
      return;
    }

    setError(null);
    setInvalidField(null);
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
      trackEvent("lead_submit_failed", { form_location: location, error_type: "no_key" });
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
      // Named `generate_lead` to match the GA4 recommended event — the tag spec and the KPI set
      // in docs/measurement-plan.md both key off this name.
      // No PII in params — GA4 ToS + privacy-law exposure. `service` is the <select> value,
      // never the free-text message.
      trackEvent("generate_lead", {
        form_location: location,
        service,
        consent: data.get("marketing_consent") === "on",
        has_message: !!message,
      });
    } catch {
      // Delivery failed. window.open after an await sits outside the user-gesture window and
      // is routinely popup-blocked, so the RENDERED recovery links below are the real
      // fallback — the open() is a best-effort bonus only.
      setRecoveryHref(buildWhatsapp(form));
      setError("השליחה נכשלה והפנייה לא הגיעה אלינו.");
      setStatus("error");
      trackEvent("lead_submit_failed", { form_location: location, error_type: "delivery" });
      window.open(buildWhatsapp(form), "_blank", "noopener");
    }
  }

  if (status === "done") {
    return (
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className={cn("rounded-xl bg-green-50 p-6 text-center", className)}
      >
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

  // placeholder:text-gray-500, not 400: the inputs are transparent (Tailwind v4 preflight) so
  // the placeholder sits on the card behind them — gray-400 measures ~2.6:1 on white and
  // ~2.5:1 on bg-gray-50, under the 4.5:1 that /accessibility/ publicly claims (WCAG 2.0 AA
  // SC 1.4.3, binding here via ת״י 5568). gray-500 clears it on both. The phone placeholder is
  // also the only place the expected format is stated, so it has to be readable.
  const fieldClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40";

  return (
    <form
      onSubmit={handleSubmit}
      // onFocus bubbles in React (unlike the DOM), so one handler on the form covers every
      // field. Keyboard and pointer both reach it; a render alone does not.
      onFocus={handleFirstInteraction}
      className={cn("space-y-4", className)}
      noValidate
      aria-busy={status === "sending"}
    >
      <div>
        <label htmlFor={fid("name")} className="mb-1 block text-sm font-medium text-gray-700">
          שם מלא
        </label>
        <input
          id={fid("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={invalidField === "name"}
          className={fieldClass}
          placeholder="ישראל ישראלי"
        />
      </div>

      <div>
        <label
          htmlFor={fid("phone")}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          טלפון
        </label>
        <input
          id={fid("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-invalid={invalidField === "phone"}
          dir="ltr"
          // text-END, not start. Logical properties resolve against THIS element's direction,
          // and dir="ltr" above flips them — so `text-start` renders on the left, making the
          // phone the only left-aligned control in an otherwise RTL form. The field originally
          // shipped physically right-aligned; a later logical-properties sweep rewrote it to
          // `text-start`, which silently changed the rendering. `text-end` is both logical and
          // visually correct here. Do not "fix" it back.
          className={cn(fieldClass, "text-end")}
          placeholder="050-0000000"
        />
      </div>

      <div>
        <label
          htmlFor={fid("service")}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          השירות שמעניין אתכם (אופציונלי)
        </label>
        <select
          id={fid("service")}
          name="service"
          className={fieldClass}
          defaultValue={defaultService ?? ""}
        >
          <option value="">בחירת שירות…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {!compact && (
        <div>
          <label
            htmlFor={fid("message")}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            ספרו לנו על הפרויקט (אופציונלי)
          </label>
          <textarea
            id={fid("message")}
            name="message"
            rows={3}
            className={fieldClass}
            placeholder="לדוגמה: פרגולה חשמלית למרפסת בגודל 4×3 מ׳…"
          />
        </div>
      )}

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
        <label htmlFor={fid("company")}>אל תמלאו שדה זה</label>
        <input
          id={fid("company")}
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
              {/* data-cta feeds GTM's `cjs - cta location` variable (docs/gtm-tag-spec.md).
                  Without it these resolved to 'unknown' and were indistinguishable from the
                  far more common non-recovery WhatsApp link below. */}
              <a
                href={recoveryHref}
                data-cta="form-recovery-whatsapp"
                target="_blank"
                rel="noopener"
                className="font-semibold text-[#0E7A34] underline"
              >
                שליחת הפרטים בוואטסאפ
              </a>{" "}
              או חיוג ישיר:{" "}
              <a
                href={telHref}
                data-cta="form-recovery-call"
                className="font-semibold text-primary underline"
                dir="ltr"
              >
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
        {/* lucide's Send points top-right — backward in RTL. No left-pointing variant ships,
            so mirror it, same as the ChevronLeft "next" affordances elsewhere. */}
        <Send className="h-5 w-5 -scale-x-100" aria-hidden />
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
          data-cta="form-whatsapp"
          className="inline-flex items-center gap-1 font-semibold text-[#0E7A34] hover:underline"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          שלחו לנו הודעה
        </a>
      </p>
    </form>
  );
}
