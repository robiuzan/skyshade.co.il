import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";
import { FilterableGallery } from "@/components/marketing/FilterableGallery";
import { galleryItems, galleryCategories, siteImages } from "@/lib/gallery";
import { webPageNode, breadcrumbNode, graphScript } from "@/lib/seo-graph";

// CollectionPage only. Per-photo ImageObject markup waits for real captions — city, year and
// what was built — which are blocked on the owner (docs/owner-intake-checklist.md §6). Marking
// up 55 photos whose alt text is "פרויקט … 12" adds no retrievable fact.
const jsonLd = graphScript([
  webPageNode({
    path: "/gallery/",
    name: "גלריית פרויקטים",
    type: "CollectionPage",
    hasBreadcrumb: true,
  }),
  breadcrumbNode("/gallery/", [
    { name: "בית", path: "/" },
    { name: "גלריה", path: "/gallery/" },
  ]),
]);

export const metadata: Metadata = {
  alternates: { canonical: "/gallery/" },
  title: "גלריית פרויקטים",
  description:
    "גלריית פרויקטים של סקיי שייד — פרגולות, גדרות, שערים, דקים וחיפויי אלומיניום מהשטח. עיצוב בהתאמה אישית ברמת הגימור הגבוהה ביותר.",
};

export default function GalleryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PageHeader
        title="גלריית פרויקטים"
        subtitle="מבחר עבודות אלומיניום שביצענו — פרגולות, גדרות, שערים, חיפויים ומטבחי חוץ. כל פרויקט מתוכנן ומיוצר בהתאמה אישית. סננו לפי קטגוריה ולחצו להגדלה."
        crumbs={[{ label: "בית", href: "/" }, { label: "גלריה" }]}
      />
      <Section tone="white">
        <FilterableGallery
          images={galleryItems}
          siteImages={siteImages}
          tabs={galleryCategories}
        />
      </Section>
      <FinalCta />
    </>
  );
}
