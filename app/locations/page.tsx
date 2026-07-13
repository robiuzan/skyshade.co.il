import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { locations } from "@/lib/site-config";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  title: "אזורי שירות",
  description:
    "סקיי שייד — פרגולות ופתרונות אלומיניום פרימיום בכל הארץ. מתל אביב וירושלים ועד חיפה, ראשון לציון ובאר שבע. בחרו את העיר שלכם.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        title="אזורי שירות"
        subtitle="שירות בכל הארץ — פרגולות, גדרות, שערים, דקים ומטבחי חוץ מאלומיניום. בחרו את העיר שלכם לפרטים נוספים."
        crumbs={[{ label: "בית", href: "/" }, { label: "אזורי שירות" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            מ-2009 אנחנו מתכננים, מייצרים ומתקינים פתרונות אלומיניום פרימיום בכל רחבי
            הארץ. אנחנו מגיעים אליכם לייעוץ ומדידה ללא עלות — בכל אחת מהערים הבאות ובסביבתן.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {locations.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/locations/${c.slug}`}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-secondary hover:text-secondary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
