import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locations, type LocationSlug } from "@/lib/site-config";
import { serviceCards } from "@/lib/content";
import {
  webPageNode,
  breadcrumbNode,
  cityServiceNode,
  graphScript,
} from "@/lib/seo-graph";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { city: LocationSlug }[] {
  return locations.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const slug = decodeURIComponent(params.city);
  const city = locations.find((c) => c.slug === slug);
  if (!city) return {};
  return {
    alternates: { canonical: `/locations/${city.slug}/` },
    // Head term + city only; the old "— פתרונות אלומיניום פרימיום" qualifier pushed every
    // city title to 63-70 chars and the brand suffix truncated in the SERP.
    title: `פרגולות אלומיניום ב${city.name}`,
    description: `סקיי שייד — פרגולות, גדרות, שערים, דקים ומטבחי חוץ מאלומיניום ב${city.name}. עיצוב בהתאמה אישית, חומרים מהמשובחים בשוק ואחריות מלאה. שירות בכל הארץ.`,
  };
}

export default function LocationPage({ params }: { params: { city: string } }) {
  // Decode in case the slug arrives URL-encoded (harmless for English slugs).
  const slug = decodeURIComponent(params.city);
  const city = locations.find((c) => c.slug === slug);
  if (!city) notFound();

  const path = `/locations/${city.slug}/`;
  // A Service scoped to this city — deliberately NOT a LocalBusiness node. Per-city business
  // nodes would claim branches that do not exist (fabricated E-E-A-T, and a Business Profile
  // verification mismatch later). No FAQPage here either: the city FAQs are not yet unique,
  // and duplicate FAQ markup across 16 near-identical pages is a doorway signal.
  const jsonLd = graphScript([
    webPageNode({
      path,
      name: `פרגולות אלומיניום ב${city.name}`,
      hasBreadcrumb: true,
    }),
    cityServiceNode(city),
    breadcrumbNode(path, [
      { name: "בית", path: "/" },
      { name: "אזורי שירות", path: "/locations/" },
      { name: city.name, path },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title={`פרגולות אלומיניום ב${city.name}`}
        subtitle={`פתרונות אלומיניום פרימיום ב${city.name} — פרגולות, גדרות, שערים, דקים ומטבחי חוץ מעוצבים בהתאמה אישית, עם אחריות מלאה. שירות בכל הארץ.`}
        crumbs={[
          { label: "בית", href: "/" },
          { label: "אזורי שירות", href: "/locations" },
          { label: city.name },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            מחפשים חברת אלומיניום מקצועית ב{city.name}? סקיי שייד מתכננת, מייצרת ומתקינה
            פרגולות אלומיניום, גדרות ושערים, חיפוי קירות, דקים ומטבחי חוץ — בהתאמה אישית
            למידות, לסגנון ולצרכים שלכם. אנחנו עובדים עם אלומיניום וחומרים ברמת הגימור
            הגבוהה ביותר, עמידים בחלודה, ב-UV ובכל מזג אוויר.
          </p>
          <p className="mt-4 text-gray-700">
            {/* {" "} is required: JSX drops newline whitespace adjacent to an expression,
                which previously rendered "תל אביבוהסביבה" with no space. */}
            מ-2009 אנחנו מעצבים מרחבי חוץ ללקוחות פרטיים ועסקיים בכל הארץ, כולל {city.name}
            {" "}והסביבה. כל פרויקט מלווה בייעוץ ומדידה ללא עלות, הצעת מחיר שקופה ואחריות מלאה
            על העבודה ועל המוצר.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            השירותים שלנו ב{city.name}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {serviceCards.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/service/${s.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {s.name}
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
