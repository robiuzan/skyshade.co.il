import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FinalCta } from "@/components/marketing/FinalCta";
import { aboutValues } from "@/lib/content";

export const metadata: Metadata = {
  title: "אודות סקיי שייד",
  description:
    "סקיי שייד — מומחים לפרגולות ולפתרונות אלומיניום פרימיום מאז 2009. עיצוב בהתאמה אישית, חומרים מהמשובחים בשוק ואחריות מלאה, בכל הארץ.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="אודות סקיי שייד"
        subtitle="מעצבים לכם את החוץ — אלומיניום ברמת הגימור הגבוהה ביותר, מאז 2009."
        crumbs={[{ label: "בית", href: "/" }, { label: "אודות" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            סקיי שייד פועלת משנת 2009 כחברת אלומיניום פרימיום המתמחה בפרגולות ובפתרונות
            הצללה וגידור לחוץ. לאורך השנים הפכנו למובילים בתחום, עם מאות פרויקטים בכל רחבי
            הארץ — פרגולות ידניות וחשמליות, גדרות ושערים, חיפויי קירות, דקים ומטבחי חוץ.
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
