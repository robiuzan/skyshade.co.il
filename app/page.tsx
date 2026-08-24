import { manifest } from "@/lib/site-config";
import { faqs } from "@/lib/content";
import { homeGalleryItems, homeGalleryCategories, siteImages } from "@/lib/gallery";
import { webPageNode, faqNode, graphScript } from "@/lib/seo-graph";
import { srcFor } from "@ishub/site-kit/media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { WhyUs } from "@/components/marketing/WhyUs";
import { Process } from "@/components/marketing/Process";
import { FilterableGallery } from "@/components/marketing/FilterableGallery";
import { ServiceAreas } from "@/components/marketing/ServiceAreas";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

// The business + WebSite nodes now render site-wide from app/layout.tsx (lib/seo-graph.ts), so
// this page adds only its own WebPage and FAQPage — both referencing the business by @id rather
// than restating it. A second business node here would fragment the entity, which is exactly
// what the old standalone-node output did.
const jsonLdImages = manifest.images ?? null;
const jsonLd = graphScript([
  webPageNode({
    path: "/",
    name: "פרגולות אלומיניום ופתרונות חוץ בהתאמה אישית",
    description: manifest.shortPitch ?? undefined,
    primaryImage: jsonLdImages?.og
      ? srcFor(jsonLdImages, jsonLdImages.og, { fit: "cover" })
      : undefined,
  }),
  faqNode("/", faqs),
]);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <WhyUs />
      <Process />

      <Section id="gallery" tone="muted">
        <SectionHeading
          eyebrow="הפרויקטים שלנו"
          title="עבודות שביצענו"
          subtitle="מבחר מפרויקטים אחרונים — לחצו להגדלה"
        />
        <div className="mt-10">
          <FilterableGallery
            images={homeGalleryItems}
            siteImages={siteImages}
            tabs={homeGalleryCategories}
            moreHref="/gallery"
            moreLabel="לכל הגלריה ←"
          />
        </div>
      </Section>

      {/* <Reviews /> is intentionally unrendered: the testimonials' wording was partially
          written by us, so publishing them under real customers' names is a
          misrepresentation risk. Restore only with verbatim sources + per-name consent
          (see lib/content.ts), or better — replace with embedded Google reviews once the
          Business Profile has real ones. */}
      <ServiceAreas />

      <Section id="faq" tone="white">
        <SectionHeading
          eyebrow="שאלות נפוצות"
          title="כל מה שרציתם לדעת על אלומיניום לחוץ"
        />
        <Faq items={faqs} />
      </Section>

      <FinalCta />
    </>
  );
}
