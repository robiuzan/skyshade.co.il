import { manifest } from "@/lib/site-config";
import { faqs } from "@/lib/content";
import { localBusinessJsonLd, faqJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { WhyUs } from "@/components/marketing/WhyUs";
import { Process } from "@/components/marketing/Process";
import { Reviews } from "@/components/marketing/Reviews";
import { ServiceAreas } from "@/components/marketing/ServiceAreas";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

// Site-wide LocalBusiness (HomeAndConstructionBusiness) JSON-LD — manifest-driven, plus the FAQ graph.
const jsonLd = [
  localBusinessJsonLd(manifest, {
    logo: "/skysgade-logo-1-1.png",
    image: "/project-1.webp",
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
