/**
 * Global / shared TypeScript types for the Sky Shade (סקיי שייד) site.
 * Add app-wide interfaces here. Route-specific or component-specific types should live
 * next to the code that uses them.
 */

/** An aluminum service offering (see lib/site-config.ts `services`). */
export interface Service {
  slug: string;
  /** Hebrew display name. */
  name: string;
  /** Short marketing description. */
  description?: string;
}

/** A targeted location for the local-SEO matrix (see lib/site-config.ts `locations`). */
export interface Location {
  slug: string;
  /** Hebrew display name. */
  name: string;
}

/** Payload submitted by the primary lead/quote form. */
export interface LeadFormData {
  name: string;
  phone: string;
  city?: string;
  service?: string;
  message?: string;
  /** Honeypot field — must stay empty (spam protection). */
  company?: string;
}

/** A customer testimonial / review. */
export interface Testimonial {
  author: string;
  rating: number; // 1–5
  text: string;
  source?: string;
  date?: string; // dd/mm/yyyy
}

export {};
