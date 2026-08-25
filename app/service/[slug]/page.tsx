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
import { guides } from "@/lib/guides";
import {
  serviceNode,
  webPageNode,
  breadcrumbNode,
  faqNode,
  graphScript,
} from "@/lib/seo-graph";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { LeadForm } from "@/components/forms/LeadForm";

export function generateStaticParams(): { slug: ServiceSlug }[] {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = decodeURIComponent(params.slug);
  const card = serviceCards.find((c) => c.slug === slug);
  if (!card) return {};
  return {
    alternates: { canonical: `/service/${card.slug}/` },
    // Per-service query-led title (content.ts seoTitle). The old generic qualifier pushed
    // pergolas/accordion past 60 chars and truncated the brand in the SERP.
    title: card.seoTitle,
    description: card.description,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  // Decode in case the slug arrives URL-encoded (harmless for English slugs).
  const slug = decodeURIComponent(params.slug);
  const card = serviceCards.find((c) => c.slug === slug);
  if (!card) notFound();

  const detail = serviceDetails[card.slug];
  // All 5 siblings — the old .slice(0, 4) silently dropped the last service from every page.
  const others = serviceCards.filter((c) => c.slug !== card.slug);
  // Guides that feed this service. The link runs both ways: the guide sends buying intent here,
  // this page sends the "before I decide" questions there instead of answering them inline and
  // diluting a transactional page.
  const related = guides.filter((g) => g.service.slug === card.slug);

  const path = `/service/${card.slug}/`;
  const jsonLd = graphScript([
    webPageNode({
      path,
      name: card.seoTitle,
      description: card.description,
      hasBreadcrumb: true,
    }),
    serviceNode({ slug: card.slug, name: card.name, description: card.description }),
    breadcrumbNode(path, [
      { name: "בית", path: "/" },
      { name: "השירותים שלנו", path: "/services/" },
      { name: card.name, path },
    ]),
    // Every answer below appears verbatim in the rendered <Faq> further down this page.
    faqNode(path, detail.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

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

            {/* Deep-dive sections. Present on pergolas only — the head-term page. Adding a
                shared section to all six would raise word count and leave the 57% cross-page
                overlap exactly where it was. */}
            {detail.sections?.map((s) => (
              <section key={s.heading}>
                <h2 className="mt-10 font-heading text-xl font-bold text-primary">
                  {s.heading}
                </h2>
                {s.body && <p className="mt-3 leading-relaxed text-gray-700">{s.body}</p>}
                {s.items && (
                  <dl className="mt-4 space-y-3">
                    {s.items.map((it) => (
                      <div key={it.term}>
                        <dt className="font-semibold text-primary">{it.term}</dt>
                        <dd className="mt-0.5 leading-relaxed text-gray-700">{it.text}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {s.link && (
                  <p className="mt-3">
                    <Link
                      href={s.link.href}
                      className="text-sm font-medium text-secondary underline"
                    >
                      {s.link.label} ←
                    </Link>
                  </p>
                )}
              </section>
            ))}

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
                <Button href={telHref} data-cta="service-aside-call" variant="accent" size="lg">
                  <Phone className="h-5 w-5" aria-hidden />
                  <span dir="ltr">{siteConfig.phone}</span>
                </Button>
                <Button
                  href={whatsappHref(`היי, אני מעוניין/ת בהצעת מחיר ל${card.name}`)}
                  data-cta="service-aside-whatsapp"
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

        {/* Guides for this service — placed before the FAQ so a reader still deciding has
            somewhere to go that isn't the exit. */}
        {related.length > 0 && (
          <div className="mt-14 border-t border-gray-100 pt-10">
            <h2 className="font-heading text-xl font-bold text-primary">
              לפני שמזמינים — מדריכים
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="flex h-full flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-secondary"
                  >
                    <span className="text-sm font-semibold text-primary">{g.title}</span>
                    <span className="text-sm text-gray-600">{g.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Per-service FAQ */}
        <div className="mt-14">
          <h2 className="text-center font-heading text-2xl font-bold text-primary">
            שאלות נפוצות על {card.name}
          </h2>
          <Faq items={detail.faqs} />
        </div>

        {/* Quote form. Until now the only conversion path on this template was the aside's
            call/WhatsApp pair, so anyone not ready to talk on the phone had nothing to do.
            The service is pre-selected — the visitor never re-states what this page says. */}
        <div className="mt-14 border-t border-gray-100 pt-10">
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-primary">
              הצעת מחיר ל{card.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              השאירו שם וטלפון ונחזור אליכם. ייעוץ ומדידה ללא עלות וללא התחייבות.
            </p>
            <div className="mt-5">
              <LeadForm location="service-page" defaultService={card.name} />
            </div>
          </div>
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
