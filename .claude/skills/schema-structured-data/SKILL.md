---
name: schema-structured-data
description: The JSON-LD entity graph for skyshade.co.il — which types are allowed on which route, the @id linking convention, the site-kit helpers, and the hard ban on Review/AggregateRating and fabricated credentials. Use when adding or auditing structured data, chasing a rich result, or wiring the entity graph for AI retrieval. Triggers: "schema", "JSON-LD", "structured data", "rich result", "LocalBusiness", "FAQPage", "breadcrumb", "Rich Results Test".
---

# Structured data

Schema is how machines resolve **the entity**, not a ranking trick. On this site it does double duty:
Google rich results *and* the entity grounding that AI assistants use when they decide whether
"סקיי שייד" is a real, locatable business (see `geo-ai-visibility`).

## Allowed, per route

| Route | Types |
|---|---|
| `/` | `HomeAndConstructionBusiness` (from `manifest.schema.type`) + `WebSite` + `FAQPage` |
| `/service/[slug]/` | `Service` + `BreadcrumbList` + `FAQPage` |
| `/locations/[city]/` | `BreadcrumbList` (+ `Service` with `areaServed` **only** if the page passes the evidence gate) |
| `/gallery/`, `/projects/[slug]/` | `ImageObject` / `CreativeWork` with real `contentLocation` + date |
| `/guides/[slug]/` | `Article` + `FAQPage` + `BreadcrumbList` |
| `/about/` | the `Organization` node with `founder` / `employee` — **only after the owner intake** |

Helpers (`@ishub/site-kit/seo`): `localBusinessJsonLd(manifest, {logo, image})`,
`serviceJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `jsonLdScript`. Emit an **array** in one
`<script type="application/ld+json">` per page — see `app/page.tsx` and `app/service/[slug]/page.tsx`.

## Never

1. **`Review` / `AggregateRating` / `ratingValue`** for the `lib/content.ts` testimonials. The source
   admits the wording was altered. Self-serving review markup is a spam-policy violation and a
   manual-action risk. Reviews live on the Google Business Profile.
2. **`hasCredential`, `award`, `certification`, `memberOf`** without a document Yossi has produced.
3. **A per-city `LocalBusiness` branch.** One business, one `@id`. Cities are `areaServed`, never
   separate location nodes — inventing branch addresses is fabricated E-E-A-T and, with GBP, fraud.
4. **`Person` nodes for invented staff.** No named human is confirmed yet.
5. **`Offer` / `priceRange` beyond the manifest's `₪₪`** until real price bands are confirmed.
6. **FAQ markup that does not match visible page text**, verbatim. The permit FAQ was wrong in copy
   *and* schema simultaneously — fix both or neither.

## The @id convention

Give every node a stable `@id` and link them, so the graph resolves to one entity:

```
https://skyshade.co.il/#business     the HomeAndConstructionBusiness (the anchor)
https://skyshade.co.il/#website      WebSite, publisher → #business
https://skyshade.co.il/service/pergolas/#service   Service, provider → #business
```

The corrected full graph is written out in `audit-roadmap-full.md` §6.1 — copy from there rather
than composing a new one.

## Fields the business node must carry

`name` (exactly `סקיי שייד` — never keyword-appended), `url`, `telephone` (E.164), `email`,
`foundedDate` 2009, `areaServed`, `openingHoursSpecification`, `image`, `logo`, `priceRange`,
`sameAs` (⚠️ currently `[]` — fill with GBP + real social profiles the moment they exist; an empty
`sameAs` is the single biggest entity-resolution gap on this site).

`address` is **missing** and blocked on the owner. Until then do not emit a fake `PostalAddress`;
emit `areaServed` and nothing else. A `PostalAddress` with only `addressCountry: IL` is honest and
acceptable; a made-up street is not.

## Verify

```bash
curl -sS https://skyshade.co.il/service/pergolas/ \
  | grep -o '<script type="application/ld+json">.*</script>'
```

Then Rich Results Test + Schema Markup Validator. Every FAQ answer in the JSON must appear on the
rendered page. Log the change in `docs/measurement-plan.md` with the rich-result type you expect.
