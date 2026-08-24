import type { Metadata } from "next";
import Link from "next/link";
import { serviceCards } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";
import { webPageNode, breadcrumbNode, itemListNode, graphScript } from "@/lib/seo-graph";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  title: "עבודות אלומיניום לבית ולגינה",
  description:
    "שישה תחומי אלומיניום תחת קורת גג אחת: פרגולות ומחסות, גדרות ושערים, חיפוי קירות חוץ, דקים, מטבחי חוץ וסגירת מרפסות. תכנון, ייצור והתקנה בשירות ארצי.",
};

const jsonLd = graphScript([
  webPageNode({
    path: "/services/",
    name: "עבודות אלומיניום לבית ולגינה",
    description:
      "שישה תחומי אלומיניום: פרגולות ומחסות, גדרות ושערים, חיפוי קירות חוץ, דקים, מטבחי חוץ וסגירת מרפסות.",
    type: "CollectionPage",
    hasBreadcrumb: true,
  }),
  breadcrumbNode("/services/", [
    { name: "בית", path: "/" },
    { name: "השירותים שלנו", path: "/services/" },
  ]),
  itemListNode(
    "/services/",
    serviceCards.map((s) => ({ name: s.name, path: `/service/${s.slug}/` })),
  ),
]);

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title="השירותים שלנו"
        subtitle="שישה תחומי אלומיניום תחת קורת גג אחת — תכנון, ייצור והתקנה באותו צוות."
        crumbs={[{ label: "בית", href: "/" }, { label: "השירותים שלנו" }]}
      />

      {/* This hub used to render the ServicesGrid alone, which made it a copy of the homepage's
          services section — nothing for it to own, and two pages competing for עבודות אלומיניום.
          The intro below is what makes it a page rather than a menu. */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-primary">
            מה משותף לכל מה שאנחנו עושים
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            כל השישה נשענים על אותו חומר ואותה שיטה: פרופילי אלומיניום שאינם מחלידים, עמידים
            ב-UV ובאוויר מלוח, נמדדים אצלכם בשטח ומיוצרים למידות שלכם — לא מוצר מדף שמתאימים
            בדיעבד. אותו צוות שמתכנן הוא שמתקין, וזו הסיבה שאפשר לשלב בין התחומים בפרויקט
            אחד בלי לתאם בין קבלנים.
          </p>

          <h2 className="mt-10 font-heading text-2xl font-bold text-primary">
            איזה שירות מתאים למה שאתם צריכים?
          </h2>
          <dl className="mt-4 space-y-4 text-gray-700">
            <div>
              <dt className="font-semibold text-primary">רוצים צל בחצר או במרפסת</dt>
              <dd className="mt-1">
                <Link href="/service/pergolas" className="text-secondary underline">
                  פרגולות, מחסות וגגות
                </Link>{" "}
                — ידניות או חשמליות, עם חיפוי פוליקרבונט, זכוכית או גג עץ. זה גם התחום שבו
                עולה שאלת ההיתר, ולכן יש לו{" "}
                <Link href="/guides/pergola-permit" className="text-secondary underline">
                  מדריך נפרד על היתר בנייה למצללה
                </Link>
                .
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">רוצים לסגור מרפסת מרוח ומגשם</dt>
              <dd className="mt-1">
                <Link href="/service/accordion-products" className="text-secondary underline">
                  סגירת מרפסות ותריסי אקורדיון
                </Link>{" "}
                — פתרון גמיש שנפתח לגמרי בקיץ, להבדיל מסגירה קבועה.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">רוצים לתחום או לאבטח את הכניסה</dt>
              <dd className="mt-1">
                <Link href="/service/fences-gates" className="text-secondary underline">
                  גדרות ושערים
                </Link>{" "}
                — גדרות דקורטיביות ושערים חשמליים, באותו גימור של שאר האלומיניום בבית.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">רוצים לשנות את מראה החזית או הרצפה</dt>
              <dd className="mt-1">
                <Link href="/service/wall-cladding" className="text-secondary underline">
                  חיפוי קירות חוץ
                </Link>{" "}
                באלומיניום, קומפוזיט או HPL, ו
                <Link href="/service/decks" className="text-secondary underline">
                  דקים
                </Link>{" "}
                מ-WPC או עץ טבעי למרפסת, לחצר ולסביבת הבריכה.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">רוצים לארח בחוץ כל השנה</dt>
              <dd className="mt-1">
                <Link href="/service/outdoor-kitchen" className="text-secondary underline">
                  מטבח חוץ
                </Link>{" "}
                מאלומיניום ואבן — לרוב משולב עם פרגולה שמצלה עליו.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <ServicesGrid />
      <FinalCta />
    </>
  );
}
