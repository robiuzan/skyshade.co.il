import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronLeft, MessageCircle, Phone } from "lucide-react";
import {
  services,
  type ServiceSlug,
  siteConfig,
  manifest,
  telHref,
  whatsappHref,
} from "@/lib/site-config";
import { serviceCards, serviceDetails, processSteps } from "@/lib/content";
import {
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdScript,
} from "@ishub/site-kit/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

export function generateStaticParams(): { slug: ServiceSlug }[] {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = decodeURIComponent(params.slug);
  const card = serviceCards.find((c) => c.slug === slug);
  if (!card) return {};
  return {
    title: `${card.name} — אלומיניום פרימיום בהתאמה אישית`,
    description: card.description,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  // Decode in case the slug arrives URL-encoded (harmless for English slugs).
  const slug = decodeURIComponent(params.slug);
  const card = serviceCards.find((c) => c.slug === slug);
  if (!card) notFound();

  const detail = serviceDetails[card.slug];
  const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);

  const jsonLd = [
    serviceJsonLd(manifest, {
      name: card.name,
      description: card.description,
      slug: card.slug,
      url: `${manifest.url}/service/${card.slug}/`,
    }),
    breadcrumbJsonLd(manifest, [
      { name: "בית", path: "/" },
      { name: "השירותים שלנו", path: "/services/" },
      { name: card.name, path: `/service/${card.slug}/` },
    ]),
    faqJsonLd([...detail.faqs]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <PageHeader
        title={card.name}
        subtitle={card.tagline}
        crumbs={[
          { label: "בית", href: "/" },
          { label: "השירותים שלנו", href: "/services" },
          { label: card.name },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-gray-700">{card.description}</p>
            <p className="mt-4 leading-relaxed text-gray-700">{detail.about}</p>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary">
              למה לבחור בנו ל{card.name}?
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-gray-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-heading text-xl font-bold text-primary">
              איך אנחנו עובדים
            </h2>
            <ol className="mt-4 space-y-3">
              {processSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">
                    <strong className="text-primary">{step.title}.</strong> {step.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sticky CTA card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <p className="font-heading text-lg font-bold text-primary">
                רוצים הצעת מחיר ל{card.name}?
              </p>
              <p className="mt-1 text-sm text-gray-600">
                ייעוץ, מדידה והצעה שקופה — ללא עלות וללא התחייבות.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href={telHref} variant="accent" size="lg">
                  <Phone className="h-5 w-5" aria-hidden />
                  <span dir="ltr">{siteConfig.phone}</span>
                </Button>
                <Button
                  href={whatsappHref(`היי, אני מעוניין/ת בהצעת מחיר ל${card.name}`)}
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  וואטסאפ
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Per-service FAQ */}
        <div className="mt-14">
          <h2 className="text-center font-heading text-2xl font-bold text-primary">
            שאלות נפוצות על {card.name}
          </h2>
          <Faq items={detail.faqs} />
        </div>

        {/* Related services */}
        <div className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="font-heading text-xl font-bold text-primary">שירותים נוספים</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/service/${o.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary"
                >
                  {o.name}
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
