import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FinalCta } from "@/components/marketing/FinalCta";
import { aboutValues } from "@/lib/content";
import { webPageNode, breadcrumbNode, graphScript } from "@/lib/seo-graph";

// AboutPage → the one business node. A `founder` Person node belongs here too, but only with a
// real named, consenting human — see docs/owner-intake-checklist.md §3.
const jsonLd = graphScript([
  webPageNode({
    path: "/about/",
    name: "אודות סקיי שייד",
    description: "סקיי שייד — אלומיניום לחוץ מאז 2009, בשירות ארצי.",
    type: "AboutPage",
    hasBreadcrumb: true,
  }),
  breadcrumbNode("/about/", [
    { name: "בית", path: "/" },
    { name: "אודות", path: "/about/" },
  ]),
]);

export const metadata: Metadata = {
  alternates: { canonical: "/about/" },
  // Not "אודות סקיי שייד" — the layout template appends "| סקיי שייד", which doubled the brand.
  title: "מי אנחנו",
  description:
    "סקיי שייד — מומחים לפרגולות ולפתרונות אלומיניום פרימיום מאז 2009. עיצוב בהתאמה אישית, חומרים מהמשובחים בשוק ואחריות מלאה, בכל הארץ.",
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PageHeader
        title="אודות סקיי שייד"
        subtitle="מעצבים לכם את החוץ — אלומיניום ברמת הגימור הגבוהה ביותר, מאז 2009."
        crumbs={[{ label: "בית", href: "/" }, { label: "אודות" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            {/* Was: "הפכנו למובילים בתחום, עם מאות פרויקטים". Both are unverifiable — a
                superlative and a project count nobody has confirmed (docs/evidence-register.md).
                Restore a count only with a real number from the owner. */}
            סקיי שייד פועלת משנת 2009 כחברת אלומיניום המתמחה בפרגולות ובפתרונות הצללה
            וגידור לחוץ — פרגולות ידניות וחשמליות, גדרות ושערים, חיפויי קירות, דקים ומטבחי
            חוץ. אנחנו מתכננים, מייצרים ומתקינים בעצמנו, בשירות ארצי.
          </p>
          <p className="mt-4 text-gray-700">
            האמונה שלנו פשוטה: לחוץ מגיע אותו יחס כמו לפנים. לכן כל פרויקט מתוכנן ומיוצר
            בהתאמה אישית, מהחומרים המשובחים בשוק — אלומיניום שאינו מחליד, עמיד ב-UV ובכל מזג
            אוויר — ומותקן בצוות מקצועי משלנו, עם אחריות מלאה על העבודה ועל המוצר.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">הערכים שלנו</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {aboutValues.map((v) => (
              <li key={v} className="flex items-start gap-2 text-gray-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <TrustBar />
      <FinalCta />
    </>
  );
}
