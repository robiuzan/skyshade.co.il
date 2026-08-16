import { manifest } from "@/lib/site-config";
import { faqs } from "@/lib/content";
import { homeGalleryItems, homeGalleryCategories, siteImages } from "@/lib/gallery";
import { localBusinessJsonLd, faqJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
import { srcFor } from "@ishub/site-kit/media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { WhyUs } from "@/components/marketing/WhyUs";
import { Process } from "@/components/marketing/Process";
import { FilterableGallery } from "@/components/marketing/FilterableGallery";
import { Reviews } from "@/components/marketing/Reviews";
import { ServiceAreas } from "@/components/marketing/ServiceAreas";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

// Site-wide LocalBusiness (HomeAndConstructionBusiness) JSON-LD — manifest-driven, plus the FAQ graph.
// Prefer the media catalog so the structured data points at the same canonical objects the page
// renders. Google rejects SVG for LocalBusiness.image, so `image` is the raster OG card.
// The public/ paths are the pre-media-pipeline fallback and can go once this site stays wired.
const jsonLdImages = manifest.images ?? null;
const jsonLd = [
  localBusinessJsonLd(manifest, {
    logo: jsonLdImages?.logo
      ? srcFor(jsonLdImages, jsonLdImages.logo, { fit: "contain" })
      : "/skysgade-logo-1-1.png",
    image: jsonLdImages?.og
      ? srcFor(jsonLdImages, jsonLdImages.og, { fit: "cover" })
      : "/project-1.webp",
  }),
  faqJsonLd([...faqs]),
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
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

      <Reviews />
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
