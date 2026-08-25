/**
 * site-config.ts — single source of truth for business data (NAP, services, locations).
 *
 * Sky Shade / סקיי שייד — premium aluminum outdoor-structures (est. 2009, nationwide).
 * Rebuilt from the live WordPress site skyshade.co.il. Components import these values rather
 * than hardcoding the phone number, service names, or location slugs.
 *
 * 🔶 = assumption/derived; confirm with client before launch (see manifest _needsConfirmation).
 */

import siteManifest from "@/site.config.json";
import {
  telHref as kitTelHref,
  whatsappHref as kitWhatsappHref,
  type SiteManifest,
} from "@ishub/site-kit";

/** Normalized per-site manifest (single source of truth for NAP/identity/schema). */
export const manifest = siteManifest as unknown as SiteManifest;

export const siteConfig = {
  name: manifest.brandName ?? "",
  nameEn: manifest.brandNameEn ?? "",
  /** One-line elevator pitch. */
  tagline: manifest.tagline ?? "",
  domain: manifest.url,
  founded: manifest.foundedYear ?? 0,

  // ── Contact ──────────────────────────────────────────────────────────────
  phone: manifest.contact.phoneDisplay,
  /** E.164 form for `tel:` links. */
  phoneE164: manifest.contact.phoneE164,
  whatsapp: manifest.contact.whatsappE164.replace(/\D/g, ""),
  email: manifest.contact.email,
  /** Web3Forms PUBLIC access key (per-site UUID). Delivery inbox = email. null until provisioned. */
  formAccessKey: (manifest.contact as { formAccessKey?: string | null }).formAccessKey ?? null,
  serviceArea: manifest.schema.areaServed ?? "",

  /** Business hours (from live site). */
  hours: {
    weekday: "א׳–ה׳ 08:00–18:00",
    friday: "ו׳ 08:00–13:00",
    saturday: "שבת — סגור",
  },

  // ── Social / listings — fill when available ──────────────────────────────
  /**
   * Official profiles, confirmed live 2026-08-25. These are the entity-corroboration signals
   * the audit called the single biggest gap: with nothing to corroborate it, "סקיי שייד" does
   * not resolve to this business in Google's or an assistant's entity graph.
   *
   * They live HERE and not in site.config.json because that file is synced from the hub roster
   * and local edits to synced fields are overwritten (CLAUDE.md §2 rule 4). lib/seo-graph.ts
   * merges these into schema.sameAs, so the footer and the structured data cannot drift apart.
   *
   * 🔶 TODO: also add these to the hub roster (Israeli services sites/roster/sites/skyshade.json,
   * schema.sameAs) so every other consumer of the manifest gets them too.
   *
   * Facebook is the CANONICAL /people/ URL — the profile.php?id= form 301s to it, and sameAs
   * should name the destination, not a redirect.
   */
  social: {
    facebook:
      "https://www.facebook.com/people/Sky-Shade-%D7%A1%D7%A7%D7%99%D7%99-%D7%A9%D7%99%D7%99%D7%93/61568329760860/",
    instagram: "https://www.instagram.com/skyshade2026/",
    /** GBP share link. Deliberately the short form: the expanded /maps/place/ URL carries
        session parameters (g_ep, skid, authuser) that are not stable. */
    googleBusiness: "https://maps.app.goo.gl/1kC9zDxQLW95yZwe6",
  },
} as const;

/** Footer/schema iteration order — Google first: it is the profile that carries reviews. */
export const socialLinks = [
  // Hebrew labels: these become the aria-label/title on icon-only footer links, and a
  // screen-reader user on a dir="rtl" site should not hit an English string mid-list.
  { key: "google", label: "הפרופיל העסקי שלנו בגוגל", href: siteConfig.social.googleBusiness },
  { key: "facebook", label: "פייסבוק", href: siteConfig.social.facebook },
  { key: "instagram", label: "אינסטגרם", href: siteConfig.social.instagram },
].filter((l) => l.href.length > 0);

/**
 * Services (6), most important first.
 * `slug` = English route segment (`app/service/[slug]`); `name` = Hebrew display name.
 * Marketing descriptions live with the page content (lib/content.ts), not here.
 */
export const services = [
  { slug: "pergolas", name: "פרגולות, מחסות וגגות" },
  { slug: "fences-gates", name: "גדרות ושערים" },
  { slug: "wall-cladding", name: "חיפוי קירות" },
  { slug: "decks", name: "דקים" },
  { slug: "outdoor-kitchen", name: "מטבח חוץ" },
  // Display name is what people search and recognise; "מוצרים אקורדיאוניים" is trade jargon
  // nobody types. Slug deliberately unchanged — renaming the URL would discard its ranking
  // signal for no gain. The <title> (content.ts seoTitle) stays frozen until the 90-day title
  // freeze lifts ~2026-11-21, then becomes "סגירת מרפסות ותריסי אקורדיון".
  { slug: "accordion-products", name: "סגירת מרפסות ותריסי אקורדיון" },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

/**
 * Local-SEO location matrix — major Israeli cities (nationwide service).
 * Drives `app/locations/[city]` (`פרגולות אלומיניום ב[עיר]`).
 */
export const locations = [
  { slug: "tel-aviv", name: "תל אביב" },
  { slug: "jerusalem", name: "ירושלים" },
  { slug: "haifa", name: "חיפה" },
  { slug: "rishon-lezion", name: "ראשון לציון" },
  { slug: "petah-tikva", name: "פתח תקווה" },
  { slug: "netanya", name: "נתניה" },
  { slug: "ashdod", name: "אשדוד" },
  { slug: "beer-sheva", name: "באר שבע" },
  { slug: "holon", name: "חולון" },
  { slug: "bnei-brak", name: "בני ברק" },
  { slug: "ramat-gan", name: "רמת גן" },
  { slug: "rehovot", name: "רחובות" },
  { slug: "herzliya", name: "הרצליה" },
  { slug: "kfar-saba", name: "כפר סבא" },
  { slug: "raanana", name: "רעננה" },
  { slug: "modiin", name: "מודיעין" },
] as const;

export type LocationSlug = (typeof locations)[number]["slug"];

// ── Link helpers ───────────────────────────────────────────────────────────

/** `tel:` href for click-to-call (shared @ishub/site-kit, bound to the manifest). */
export const telHref = kitTelHref(manifest);

/** WhatsApp click-to-chat href, with an optional pre-filled message (shared kit). */
export function whatsappHref(message?: string): string {
  return kitWhatsappHref(manifest, message);
}
