/**
 * seo-graph.ts — the site's JSON-LD entity graph.
 *
 * WHY THIS EXISTS instead of calling @ishub/site-kit/seo directly: the kit emits standalone
 * nodes (each with its own @context) with no @id linking, so Google saw a handful of unrelated
 * objects rather than one business. Assistants that must resolve "סקיי שייד" to a real entity
 * need the opposite — one graph, one business @id, everything pointing at it. The kit is a
 * vendored tarball (fix upstream, re-vendor), so the corrected graph lives here.
 * Spec: audit-roadmap-full.md §6.1. Rules: .claude/skills/schema-structured-data/SKILL.md.
 *
 * NEVER add here: Review/AggregateRating (self-serving — the testimonial wording was altered),
 * a second Organization node (fragments the entity), per-city LocalBusiness branches
 * (fabricated), Person/hasCredential (no confirmed human or licence), Offer.price (no published
 * prices), SearchAction (no search page), HowTo (dead rich result).
 */
import {
  manifest,
  services,
  siteConfig,
  socialLinks,
  type ServiceSlug,
} from "@/lib/site-config";
import { srcFor } from "@ishub/site-kit/media";
import type { GalleryItem } from "@ishub/site-kit/media";

export type JsonLd = Record<string, unknown>;

const BASE = manifest.url;

/** Absolute, trailing-slash URL — @ids must match the canonicals exactly. */
export const abs = (path: string): string => `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

export const BUSINESS_ID = `${BASE}/#business`;
export const WEBSITE_ID = `${BASE}/#website`;
const LOGO_ID = `${BASE}/#logo`;

export const pageId = (path: string): string => `${abs(path)}#webpage`;
export const breadcrumbId = (path: string): string => `${abs(path)}#breadcrumb`;
export const serviceId = (slug: string): string => `${abs(`/service/${slug}/`)}#service`;

const images = manifest.images ?? null;
const catalog: readonly GalleryItem[] = images?.gallery?.items ?? [];

const logoUrl = images?.logo ? srcFor(images, images.logo, { fit: "contain" }) : null;
const ogUrl = images?.og ? srcFor(images, images.og, { fit: "cover" }) : null;

/** First N catalog photos of a category, as absolute CDN URLs. */
function photosFor(category: string | null, n = 4): string[] {
  if (!images) return [];
  const pool = category ? catalog.filter((i) => i.category === category) : catalog;
  return pool.slice(0, n).map((i) => srcFor(images, i, { fit: "cover" }));
}

/** Catalog category per service — outdoor-kitchen and accordion have no catalog category yet. */
const SERVICE_CATEGORY: Record<ServiceSlug, string | null> = {
  pergolas: "פרגולות, מחסות וגגות",
  "fences-gates": "גדרות ושערים",
  "wall-cladding": "חיפוי קירות",
  decks: "דקים",
  "outdoor-kitchen": null,
  "accordion-products": null,
};

/** Drop empty values so a blocked field (address locality, sameAs) simply vanishes. */
function prune<T extends Record<string, unknown>>(o: T): T {
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0))
      delete o[k];
  }
  return o;
}

const HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "08:00",
    closes: "18:00",
  },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "13:00" },
];

/** Service area, not branches. There is exactly one business node and it has no per-city clone. */
const AREA_SERVED = [{ "@type": "Country", name: "ישראל" }];

/**
 * The anchor node. Rendered on EVERY page from app/layout.tsx so any URL an assistant lands on
 * resolves the entity.
 *
 * ✅ RESOLVED 2026-08-25: `sameAs` + `hasMap` now carry the real Google Business Profile,
 * Facebook and Instagram (siteConfig.social). This was the single biggest entity-resolution
 * gap — with nothing to corroborate it, assistants answered brand questions with whichever
 * competitor WAS resolvable.
 *
 * 🔶 STILL BLOCKED ON THE OWNER (docs/evidence-register.md):
 *   address.addressLocality — must match the Business Profile verification city; never invent.
 *     The GBP pin implies a locality, but whether the street address may be published (and
 *     whether the profile is a service-area business with a hidden address) is the owner's
 *     call, not an inference from a maps link.
 *   geo — same decision as the address; do not lift coordinates out of the share URL.
 */
export function businessNode(): JsonLd {
  // Merge: manifest first (hub-synced, currently empty), then the code-level profiles.
  // De-duped so adding them to the roster later cannot produce a doubled sameAs.
  const sameAs = [
    ...(Array.isArray(manifest.schema?.sameAs) ? manifest.schema.sameAs : []),
    ...socialLinks.map((l) => l.href),
  ].filter((v, i, a) => a.indexOf(v) === i);
  return prune({
    "@type": manifest.schema?.type ?? "LocalBusiness",
    "@id": BUSINESS_ID,
    name: manifest.brandName,
    alternateName: [manifest.brandNameEn, "skyshade"].filter(Boolean),
    description: manifest.shortPitch ?? manifest.tagline,
    slogan: manifest.tagline,
    url: `${BASE}/`,
    telephone: manifest.contact.phoneE164,
    email: manifest.contact.email,
    foundingDate: manifest.foundedYear ? String(manifest.foundedYear) : undefined,
    priceRange: manifest.schema?.priceRange,
    currenciesAccepted: "ILS",
    knowsLanguage: "he",
    logo: logoUrl
      ? {
          "@type": "ImageObject",
          "@id": LOGO_ID,
          url: logoUrl,
          width: manifest.images?.logo?.width,
          height: manifest.images?.logo?.height,
        }
      : undefined,
    image: [ogUrl, ...photosFor(null, 3)].filter(Boolean),
    // Country only. A PostalAddress with an invented locality is fabricated E-E-A-T and, once a
    // Business Profile exists, a verification mismatch.
    address: { "@type": "PostalAddress", addressCountry: "IL" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: manifest.contact.phoneE164,
      availableLanguage: ["he"],
      areaServed: "IL",
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    // The GBP share link. Distinct from sameAs: hasMap tells Google which map entry IS this
    // business, which is what ties on-site reviews-free content to the profile that has them.
    hasMap: siteConfig.social.googleBusiness || undefined,
    knowsAbout: [
      "פרגולות אלומיניום",
      "מצללות",
      "סגירת מרפסות ותריסי אקורדיון",
      "גדרות ושערים חשמליים",
      "דקים",
      "חיפוי קירות חוץ",
      "מטבחי חוץ",
    ],
    openingHoursSpecification: HOURS,
    areaServed: AREA_SERVED,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "שירותי אלומיניום",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@id": serviceId(s.slug) },
      })),
    },
  });
}

export function websiteNode(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${BASE}/`,
    name: manifest.brandName,
    alternateName: manifest.brandNameEn,
    inLanguage: "he-IL",
    publisher: { "@id": BUSINESS_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(path: string, crumbs: Crumb[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(path),
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export interface PageOpts {
  path: string;
  name: string;
  description?: string;
  /** WebPage subtype: AboutPage, ContactPage, CollectionPage, ItemPage… */
  type?: string;
  /** True when the page also emits a breadcrumb node for the same path. */
  hasBreadcrumb?: boolean;
  primaryImage?: string;
}

export function webPageNode(o: PageOpts): JsonLd {
  return prune({
    "@type": o.type ?? "WebPage",
    "@id": pageId(o.path),
    url: abs(o.path),
    name: o.name,
    description: o.description,
    inLanguage: "he-IL",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    primaryImageOfPage: o.primaryImage,
    breadcrumb: o.hasBreadcrumb ? { "@id": breadcrumbId(o.path) } : undefined,
  });
}

/** Service node for /service/[slug]/. No Offer.price — nothing is published about price. */
export function serviceNode(svc: {
  slug: ServiceSlug;
  name: string;
  description: string;
}): JsonLd {
  const path = `/service/${svc.slug}/`;
  return prune({
    "@type": "Service",
    "@id": serviceId(svc.slug),
    name: svc.name,
    serviceType: svc.name,
    category: "עבודות אלומיניום",
    description: svc.description,
    url: abs(path),
    mainEntityOfPage: { "@id": pageId(path) },
    provider: { "@id": BUSINESS_ID },
    areaServed: AREA_SERVED,
    image: photosFor(SERVICE_CATEGORY[svc.slug], 4),
  });
}

/**
 * City page Service node. NOT a LocalBusiness — a per-city business node would claim branches
 * that do not exist. The city is areaServed on the one business, nothing more.
 */
export function cityServiceNode(city: { slug: string; name: string }): JsonLd {
  const path = `/locations/${city.slug}/`;
  return {
    "@type": "Service",
    "@id": `${abs(path)}#service`,
    name: `פרגולות אלומיניום ב${city.name}`,
    serviceType: "פרגולות אלומיניום",
    category: "עבודות אלומיניום",
    url: abs(path),
    mainEntityOfPage: { "@id": pageId(path) },
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "Country", name: "ישראל" },
    },
  };
}

/**
 * FAQPage. Every answer here MUST appear verbatim on the rendered page — the building-permit
 * defect shipped in copy and schema at once, and parity is what prevents a repeat.
 */
export function faqNode(path: string, items: readonly { q: string; a: string }[]): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Article node for /guides/[slug]/. `dateModified` must be a date the page really carries. */
export function articleNode(o: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}): JsonLd {
  return prune({
    "@type": "Article",
    "@id": `${abs(o.path)}#article`,
    headline: o.headline,
    description: o.description,
    inLanguage: "he-IL",
    mainEntityOfPage: { "@id": pageId(o.path) },
    // Attributed to the business, not a person: no named human is confirmed yet, and an
    // invented author byline is fabricated E-E-A-T (docs/evidence-register.md).
    author: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    image: o.image,
  });
}

/** ItemList for hub pages (services, locations, guides). */
export function itemListNode(
  path: string,
  items: readonly { name: string; path: string }[],
): JsonLd {
  return {
    "@type": "ItemList",
    "@id": `${abs(path)}#list`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: abs(it.path),
    })),
  };
}

/**
 * Serialize nodes as ONE @graph with a single @context. Escapes `<` so the JSON can never
 * break out of the <script> element.
 */
export function graphScript(nodes: JsonLd[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(
    /</g,
    "\\u003c",
  );
}
