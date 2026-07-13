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
  serviceArea: manifest.schema.areaServed ?? "",

  /** Business hours (from live site). */
  hours: {
    weekday: "א׳–ה׳ 08:00–18:00",
    friday: "ו׳ 08:00–13:00",
    saturday: "שבת — סגור",
  },

  // ── Social / listings — fill when available ──────────────────────────────
  social: {
    facebook: "", // 🔶
    instagram: "", // 🔶
    googleBusiness: "", // 🔶
  },
} as const;

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
  { slug: "accordion-products", name: "מוצרים אקורדיאוניים" },
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
