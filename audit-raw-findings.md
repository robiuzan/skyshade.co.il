# Sky Shade — raw audit findings (7 of 15 tracks, UNVERIFIED)


# Local SEO — Israeli market (GBP, citations, city pages, local schema, reviews, tracking)

**Current state:** The local footprint is close to zero and the one asset built for it — 16 city pages — is currently a liability. I masked the city name out of the shipped `<main>` of /locations/tel-aviv/, /modiin/, /haifa/ and /beer-sheva/ and all four are byte-identical: a 146-word template where the only variable is the city name, substituted five times. Those 16 pages emit only BreadcrumbList JSON-LD; the HomeAndConstructionBusiness node ships on exactly 7 pages (out/index.html plus the 6 service pages) and never on a location page, so the pages that exist to win local queries carry no local entity data at all. The one geographic property that does ship, `"areaServed":{"@type":"AdministrativeArea","name":"שירות בכל הארץ"}`, is an untranslatable free-text phrase ("service throughout the country") rather than a resolvable place, so it conveys nothing machine-readable; there is no `address`, no `geo`, no `sameAs` (site.config.json:53 `"sameAs": []`), and no `hasMap`. Off-site there is nothing to corroborate the entity: a Hebrew search for "סקיי שייד" returns Skyroof, Skyve and other Sky-prefixed pergola competitors, not this business. `analytics.googleSiteVerification` is null, so there is no Search Console property and therefore no way to measure any of this. The one genuinely good decision already in place is the absence of any map iframe — the only `<iframe>` in the codebase is the GTM noscript tag at app/layout.tsx:54.


## 1. Rewrite the 16 city pages — they are currently byte-identical doorway pages
`critical` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** I stripped tags from the shipped `<main>` of out/locations/{tel-aviv,modiin,haifa,beer-sheva}/index.html, replaced each city's Hebrew name with a placeholder token, and compared: all four normalise to the SAME 146-word string. Total `<main>` text is 152 words for tel-aviv and 146 for modiin — and that count already includes the breadcrumb trail, the six service-link labels, the FinalCta heading and the phone number. Unique prose is two paragraphs (~110 words) in app/locations/[city]/page.tsx:58-68. The city name is interpolated exactly 5 times (title, subtitle, para 1, para 2, the h2). Heading outline is h1 + a single h2 ('השירותים שלנו ב{city}').

**Recommendation:** Do not ship 16 templated pages. Create `lib/locations-data.ts` keyed by LocationSlug carrying real, per-city facts, and consume it in app/locations/[city]/page.tsx. Minimum bar per page before it stays indexable: (a) at least 2 real projects completed in that city with photos and a one-paragraph description each; (b) 3-6 named neighbourhoods/streets you have actually worked in; (c) the city's own ועדה מקומית לתכנון ובנייה and its specific pergola/permit reality; (d) a genuine travel/logistics note (lead time, whether a crane/מנוף is typically needed, parking/access constraints); (e) 2-3 FAQs that are only true for that city. Any city that cannot clear that bar should be removed from `locations` in lib/site-config.ts and consolidated into /locations/ rather than published thin. The project list and neighbourhood list are business facts — REQUIRES-CLIENT-INPUT; do not invent them.

```
// lib/locations-data.ts
export type CityData = {
  name: string;
  region: string;              // גוש דן | השרון | שפלה | ירושלים והסביבה | צפון | דרום
  nameGenitive: string;        // for correct Hebrew prepositions: "בתל אביב" vs "במודיעין"
  committee: string;           // "הוועדה המקומית לתכנון ובנייה תל אביב-יפו"
  neighborhoods: string[];     // ⚠ REQUIRES-CLIENT-INPUT — only where we actually worked
  permitNote: string;          // city-specific, not the national rule restated
  travelNote: string;
  projectKeys: string[];       // keys into the gallery catalog — real jobs in this city
};

export const locationData: Record<LocationSlug, CityData> = {
  "tel-aviv": {
    name: "תל אביב",
    region: "גוש דן",
    nameGenitive: "בתל אביב",
    committee: "הוועדה המקומית לתכנון ובנייה תל אביב-יפו",
    neighborhoods: [], // ⚠ למלא: רמת אביב, צהלה, לב העיר, נווה צדק...
    permitNote:
      "בתל אביב-יפו כ-75 מתחמים מוגדרים כאזורי שימור, ובהם גם פרגולה שעומדת בתנאי הפטור מחייבת אישור מהעירייה לפני ההתקנה. מחוץ לאזורי השימור חלים תנאי הפטור הארציים, ועדיין נדרש דיווח לרשות הרישוי תוך 45 יום מגמר העבודה.",
    travelNote:
      "התקנות בלב העיר מתואמות מראש מול חניה והיתר עבודה; בבנייני מגורים גבוהים נדרשת לעיתים הרמה במנוף.",
    projectKeys: [],
  },
  // ...
};
```

**Risk:** Google's spam policy on doorway pages targets exactly this pattern (multiple pages generated for cities that funnel users to the same content). Publishing 16 of them risks the whole /locations/ directory being demoted or ignored. Interim mitigation if real content is weeks away: keep only 4-6 cities indexable and add `robots: { index: false, follow: true }` to `generateMetadata` for the rest until they have unique content — a smaller genuinely-useful set beats 16 empty ones.

## 2. Emit LocalBusiness + Service schema on every city page — today they carry only BreadcrumbList
`critical` · impact `high` · effort `M`

**Evidence:** `grep -rl "HomeAndConstructionBusiness" out/ --include="*.html"` returns exactly 7 files: out/index.html and the six out/service/*/index.html pages. No /locations/ page appears. Extracting the JSON-LD from out/locations/tel-aviv/index.html yields a single block: `{"@type":"BreadcrumbList",...}`. app/locations/[city]/page.tsx:33-44 builds only `breadcrumbJsonLd`. There is no FAQPage, no Service, no areaServed and no reference to the `https://skyshade.co.il/#business` node on any of the 16 pages.

**Recommendation:** In app/locations/[city]/page.tsx, emit an array containing the existing BreadcrumbList plus a `Service` node whose `provider` is an `@id` reference to the business node already minted on the homepage (`https://skyshade.co.il/#business`), and whose `areaServed` is a real `City` with `containedInPlace` Israel. Referencing by `@id` rather than re-inlining the whole business avoids 16 conflicting copies of the entity. Add the per-city FAQs from finding #1 as a `FAQPage` on the same page once the copy is real.

```
const cityJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `https://skyshade.co.il/locations/${city.slug}/#service`,
  "name": `פרגולות ופתרונות אלומיניום ב${city.name}`,
  "serviceType": "התקנת פרגולות אלומיניום, גדרות ושערים, דקים ומטבחי חוץ",
  "provider": { "@id": "https://skyshade.co.il/#business" },
  "areaServed": {
    "@type": "City",
    "name": city.name,
    "containedInPlace": { "@type": "Country", "name": "ישראל" }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": `השירותים שלנו ב${city.name}`,
    "itemListElement": services.map((s) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Service", "name": s.name,
        "url": `https://skyshade.co.il/service/${s.slug}/` }
    }))
  }
};
// ship as: jsonLdScript([breadcrumb, cityJsonLd])
```

## 3. Replace the meaningless areaServed string with a resolvable Country + City list
`high` · impact `high` · effort `S`

**Evidence:** The shipped business node in out/index.html contains `"areaServed":{"@type":"AdministrativeArea","name":"שירות בכל הארץ"}`. "שירות בכל הארץ" is a marketing phrase ('service throughout the country'), not a place name — no geocoder resolves it. It originates at site.config.json:32 (`"areaServed": "שירות בכל הארץ"`) and is reused as display copy via lib/site-config.ts:37, so the same string is doing double duty as UI text and as a schema place value. It ships on 7 pages.

**Recommendation:** Split the two uses. Keep `siteConfig.serviceArea` as the human-facing footer/contact string, but give the schema a real geography: `areaServed` as an array of one `Country` (ישראל / IL) plus the 16 `City` nodes from `locations`. Change site.config.json to add a distinct `schema.areaServedPlaces` array and have the site-kit `localBusinessJsonLd` helper read it. Also add `@id`-stable `sameAs` (finding #6) and a `hasMap` pointing at the GBP place URL once it exists.

```
// site.config.json — schema block
"areaServed": "שירות בכל הארץ",            // display copy only
"areaServedPlaces": [
  { "type": "Country", "name": "ישראל", "code": "IL" },
  { "type": "City", "name": "תל אביב" },
  { "type": "City", "name": "ירושלים" }
  /* … the 16 from lib/site-config.ts locations[] */
]

// emitted JSON-LD
"areaServed": [
  { "@type": "Country", "name": "ישראל" },
  { "@type": "City", "name": "תל אביב" },
  { "@type": "City", "name": "ירושלים" }
]
```

## 4. Hide the address on GBP but pick one canonical city for citations — and never publish the street address on-site
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** The site publishes no street address anywhere: components/layout/Footer.tsx renders `{siteConfig.serviceArea}` next to the MapPin icon, and app/contact/page.tsx does the same — both output 'שירות בכל הארץ'. The emitted LocalBusiness node has no `address` and no `geo` property at all. Google's current guidance for service-area businesses is explicit: 'If you're a service-area business, you should hide your business address from customers… If you hide your business address, your Business Profile will only show your service area.' It also forbids PO boxes and virtual offices for the verification address.

**Recommendation:** Correct posture, three parts. (1) GBP: enter the real base address (home/workshop) for verification — it must be a real location, no PO box — then Edit profile → Location → turn OFF 'Show business address to customers'. This is the sanctioned mechanism for a home-based SAB and does not penalise you. (2) On-site: keep the street address off entirely. The absence of a PostalAddress does NOT hurt map-pack ranking (Google ranks the pack from GBP data, not from your HTML) — so do not add the home address to schema just to 'complete' it. What it does hurt is entity confidence and directory dedup, which is fixed by sameAs + citations, not by publishing a home address. (3) Citations: Israeli directories (B144, דפי זהב, Zap) force a city field. Choose ONE city — the actual base — and use the identical string on every listing, e.g. `סקיי שייד | 050-5063152 | [עיר הבסיס] | skyshade.co.il`. Inconsistent city values across directories are the main NAP failure mode for Israeli SABs. Confirm the base city with the client before any listing is created.

**Risk:** The GBP pin still governs map-pack proximity even when hidden. If the base is in, say, גוש דן, the Haifa and Be'er Sheva map packs are effectively unwinnable — plan those cities as organic-only plays (finding #1) and concentrate GBP effort on the ~1-hour radius. Also: do NOT create additional GBP listings at customers' or relatives' addresses to reach other cities — that is the fastest route to a hard suspension.

## 5. Create and fully configure the Google Business Profile — categories are the single highest-leverage lever
`critical` · impact `transformational` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:53 `"sameAs": []` and lib/site-config.ts:50 `googleBusiness: ""` (marked 🔶) mean no GBP URL is known to the codebase. A Hebrew web search for "סקיי שייד" surfaces skyroof.co.il, skyve-pergolas.com and other competitors — no Sky Shade profile or brand result appeared. GBP now exposes ~4,046 categories; the primary category carries more ranking weight than any other single profile field.

**Recommendation:** Set the primary category to the highest-margin, highest-volume service — for this business that is pergolas, so primary = 'Awning supplier' (Hebrew UI: ספק סככות/תוננים) or 'Pergola builder' if it appears in the IL category picker; verify which of the two the picker actually offers before deciding, as availability varies by locale. Then add secondary categories mapped 1:1 to the six services in lib/site-config.ts: Fence contractor (קבלן גדרות), Deck builder (בונה דקים), Aluminum supplier / Aluminum welder (ספק אלומיניום), Outdoor furniture store or Kitchen remodeler for מטבח חוץ, and Contractor (קבלן) as a catch-all. Do not add categories for work you don't do — irrelevant categories dilute relevance. Set the opening date to 2009 so it matches `foundedYear` in site.config.json. Once live, put the profile's short URL into site.config.json `schema.sameAs` and lib/site-config.ts `social.googleBusiness`.

**Risk:** Category availability differs between the English and Hebrew GBP interfaces. Confirm in the live Hebrew picker rather than assuming; a category that does not exist in IL cannot be forced.

## 6. Populate schema.sameAs — the business has zero entity corroboration and a live name-collision problem
`high` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:53 `"sameAs": []`; lib/site-config.ts:47-51 has facebook/instagram/googleBusiness all as empty strings marked 🔶. Searching "סקיי שייד" in Hebrew returns Skyroof (סקיי רופ), Skyve Pergolas (סקיי לייט) and Skyroof's testimonials page — three separate Sky-prefixed Israeli pergola companies. Nothing in the results was skyshade.co.il.

**Recommendation:** This is not a generic 'add your socials' item — it is entity disambiguation in a market where at least three competitors share the 'Sky' prefix in Hebrew transliteration. Populate `schema.sameAs` in site.config.json with every profile that resolves to THIS business: the GBP place URL, Facebook page, Instagram, the B144 listing URL, the דפי זהב listing URL, and the WhatsApp Business catalogue if one exists. Mirror them into lib/site-config.ts `social` and render them as real anchors in components/layout/Footer.tsx (a `sameAs` array with no corresponding visible link is weaker corroboration than one that matches on-page reality). Also add `alternateName` variants to the business node so the transliteration ambiguity is explicitly resolved.

```
// site.config.json
"sameAs": [
  "https://www.google.com/maps/place/?q=place_id:XXXXXXXX",
  "https://www.facebook.com/…",
  "https://www.instagram.com/…",
  "https://www.b144.co.il/…",
  "https://www.d.co.il/…"
]

// business node — resolve the Sky* collision explicitly
"name": "סקיי שייד",
"alternateName": ["Sky Shade", "סקיי שייד אלומיניום", "skyshade.co.il"]
```

## 7. Configure GBP service areas as Israeli regions, not 16 individual cities
`high` · impact `high` · effort `S`

**Evidence:** lib/site-config.ts:74-91 lists 16 cities. GBP caps service areas at 20 distinct entries and Google advises the area should not extend much beyond a two-hour drive from the business's physical base. In Israel a two-hour drive from a Gush Dan base already reaches Haifa (~1h), Jerusalem (~1h) and Be'er Sheva (~1.5h) — so 'nationwide' is defensible for most of the country, but 16 individual city pins consume 80% of the slot budget for no gain.

**Recommendation:** Do not enumerate the 16 cities. Enter broader Israeli geographies that Google's IL place picker recognises — מחוז תל אביב, מחוז המרכז, מחוז חיפה, מחוז ירושלים, מחוז הדרום, מחוז הצפון — which covers the whole matrix in six entries and leaves headroom. Then, where the picker supports it, add the 3-4 individual cities you most want to win that sit at the edge of the base's radius. Deliberately exclude anything you would not actually drive to (Eilat, the far north) — 'adding areas you cannot realistically serve dilutes your profile's relevance signals' and there is no ranking bonus for filling all 20 slots. Keep the on-site `locations` matrix separate from this; the site's 16 pages serve organic intent, the GBP areas serve the pack.

**Risk:** Setting an implausibly wide service area on a hidden-address profile is a known trigger for reinstatement scrutiny. Match the declared area to what the client will genuinely travel for — confirm the real limit.

## 8. GBP chat is dead — wire the profile to WhatsApp instead, which is the dominant Israeli channel
`high` · impact `high` · effort `S`

**Evidence:** Google discontinued Business Profile chat entirely: new conversations stopped 15 July 2024 and the feature ended 31 July 2024, alongside call history. Google has since been rolling out a 'chat' section that accepts a text-messaging number and/or a WhatsApp number for Maps and Search. Meanwhile this site already treats WhatsApp as a first-class channel — components/layout/MobileCtaBar.tsx and FinalCta ship `https://wa.me/972505063152?text=…` with a pre-filled Hebrew message, and site.config.json:16 sets `whatsappE164` to the same number as the phone line.

**Recommendation:** Do not budget any effort for GBP messaging as a channel — it no longer exists in its old form. Instead, as soon as the WhatsApp field is available on the IL profile, add +972505063152 there so the profile's contact affordance matches the site's. Separately, register the number as a WhatsApp Business account (not personal) to unlock the business profile, catalogue, away messages and quick replies; the catalogue is a genuine local asset for a visual product like pergolas. Keep the existing `wa.me` pre-filled message wording identical to what you use in GBP so lead attribution in GTM stays clean.

**Risk:** Google has not shipped the WhatsApp field to every locale. Check the Hebrew GBP interface; if absent, the wa.me link on the site plus the phone number on the profile is sufficient.

## 9. Build a review acquisition and response system — currently there is no review surface at all
`critical` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** No GBP is referenced anywhere in the repo (lib/site-config.ts:50 `googleBusiness: ""`). The business node in out/index.html contains no `aggregateRating` and no `review`. The only social proof on the site is three testimonials in lib/content.ts:305-324 with no source URL, no date and no verifiable origin.

**Recommendation:** Reviews are the strongest local ranking factor this business is currently forfeiting entirely. Concretely: (a) After every installation handover, send a WhatsApp message containing the GBP short review link — WhatsApp, not email, because that is where Israeli homeowners actually respond. Draft: 'תודה שבחרתם בסקיי שייד! נשמח מאוד אם תוכלו לשתף את החוויה שלכם בגוגל — זה עוזר לנו יותר מכל: [קישור]'. (b) Target a steady cadence rather than a burst — a handful per month, sustained, reads as organic; 20 in one week reads as a purchase and can get them filtered. (c) Ask the customer to mention the city and the product naturally ('פרגולת אלומיניום ברעננה') — never dictate wording. (d) Respond to 100% of reviews in Hebrew within 48 hours; the response is indexable text and is your only chance to add city + service context to someone else's review. (e) Never offer a discount or gift for a review — that violates Google's policy and Israeli consumer-protection norms.

**Risk:** Review gating (screening for positives before asking) is against Google's policy. So is any incentive. Both are common practice among Israeli SEO vendors — instruct the client explicitly not to accept such an offer.

## 10. Do NOT add Review/AggregateRating schema for the existing testimonials — they were partially written by us
`high` · impact `medium` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** lib/content.ts:301-304 states verbatim: 'Testimonials — real reviews carried over from the live skyshade.co.il site. (Full wording lightly completed from the live excerpts; confirm before launch.)' The three entries at lines 305-324 each carry `rating: 5` and `source: "בעל בית"` with no date, no URL and no verification path. lib/content.ts:6 flags the file's stats and testimonials with 🔶 = unconfirmed assumption.

**Recommendation:** Leave these out of structured data. 'Lightly completed' wording means the text is not what the customer wrote, and self-serving Review/AggregateRating markup for reviews not genuinely collected on the site is a direct structured-data policy violation with manual-action exposure. Two legitimate paths: (1) keep them as plain on-page testimonials with no markup — which is what ships today and is fine — but get the client to confirm each is substantively accurate, or replace with verbatim text; or (2) once real Google reviews accumulate (finding #9), display them on-site with attribution and a link to the GBP profile, still without AggregateRating markup, and let Google surface the rating from the profile itself where it belongs. Also fix the adjacent staleness: trustStats at lib/content.ts:287 says '15+ שנות ניסיון' while `foundedYear` is 2009 — that is 17 years in 2026, and it must match whatever opening date you set on GBP.

**Risk:** This finding is a do-not-do. If another workstream proposes adding Review schema to boost rich results, this is the blocker.

## 11. Build the Israeli citation set — B144 first, because it syndicates into Yad2's professionals board
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** No citations are referenced anywhere in the repo (`sameAs: []`). Yad2's professionals search runs at `https://www.yad2.co.il/b144/search?category=871` — the `/b144/` path segment shows the board is B144-powered, so a single B144 listing earns distribution on Israel's largest classifieds portal. That category currently holds 87+ pergola listings and 51+ aluminium professionals, i.e. the competitive set is already there and Sky Shade is not.

**Recommendation:** Work this order, using one identical NAP string everywhere (name 'סקיי שייד', phone 050-5063152, the single base city from finding #4, URL https://skyshade.co.il/). Tier 1, do first: Google Business Profile; B144 (bezeq, free self-registration at b144.co.il/selfRegister — and it feeds Yad2 בעלי מקצוע); דפי זהב / d.co.il (free business add at d.co.il/LandingPage/AddBusiness/); Zap עסקים; Waze (via the Waze Ad partner/business listing — high value in Israel where Waze, not Apple Maps, is the default navigation app); Facebook Business Page; Bing Places. Tier 2, worthwhile: easy.co.il (free, but the listing's visibility is driven by review count, so pair it with finding #9); Apple Business (Apple Business Connect was folded into Apple Business in April 2026 — claim the place card, low traffic in IL but it is a clean, authoritative sameAs). Explicitly deprioritise: Madlan and Homeless are real-estate listing portals for buyers and renters — they carry no contractor directory relevant to a pergola installer, so skip them despite being on the shortlist. Record every resulting URL in site.config.json `schema.sameAs`.

**Risk:** Israeli directories aggressively upsell paid placement. The SEO value is in the consistent citation, not the paid tier — start with every free listing and only pay where the directory itself sends measurable leads (track with a UTM per directory).

## 12. Give the 16 cities depth instead of multiplying into 96 service×city pages
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** 6 services × 16 cities = 96 unrealised combinations. But the existing 16 city pages already fail the uniqueness test (finding #1) with a 146-word template, and app/locations/[city]/page.tsx:73-85 links out to the six generic service pages rather than saying anything city-specific about each service. Generating 96 pages from the same generator would produce 96 near-duplicates.

**Recommendation:** Go deeper on fewer, and do it in stages. Stage 1: pick the 5-6 cities where the client has the most completed projects and make those pages genuinely substantial (finding #1). Stage 2: only for the single highest-intent service — פרגולות (pergolas) — and only in cities that cleared stage 1, add /service/pergolas/[city]/ pages, each anchored on real local projects and that city's permit reality. That is at most 6 new pages, each defensible. Do not build fences×16 or decks×16. The determinant of whether a service×city page deserves to exist is whether you can write something about that service in that city that is not true of the same service elsewhere — for pergolas the municipal permit/שימור angle supplies that; for דקים it generally does not.

**Risk:** Scaling the matrix without unique per-combination substance is the textbook doorway pattern and would compound the exposure from finding #1 sixfold.

## 13. Use the pergola permit exemption as the legitimate per-city differentiator
`high` · impact `high` · effort `L`

**Evidence:** The national framework is verifiable and stable: תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר), תשע"ד-2014, following תיקון 101, in force since 1 August 2014 — exemption up to 50 m² or a quarter of the free plot/roof area, whichever is greater; light materials (aluminium qualifies); gaps evenly distributed and at least 40% of the shading surface; and a report to the licensing authority within 45 days of completion. Municipal application then diverges — Tel Aviv-Yafo has roughly 75 conservation districts where municipal approval is required even for an otherwise-exempt pergola, and permit processing in Tel Aviv can run 4-6 months. The site currently compresses all of this into one 30-word homepage FAQ (lib/content.ts:345-347: 'פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר').

**Recommendation:** This is the one topic that is simultaneously high-intent, genuinely city-variable, and outside competitors' willingness to research — which makes it the honest way to differentiate 16 city pages without spinning text. Per city, state: the name of that city's ועדה מקומית, whether the city has designated שימור areas that override the exemption, the city's own reporting portal/form for the 45-day דיווח, and any local quirk (e.g. building-line deviation rules). Write it as an h2 on each city page — 'פרגולה ב{עיר}: מתי צריך היתר ומתי לא' — with 150-250 words of city-specific substance. Link every city page to one canonical explainer page on the national regulation so you are not restating the same 50 m² rule 16 times.

**Risk:** Municipal rules change and vary. Verify each city's specifics against that municipality's own engineering/licensing pages before publishing, date-stamp the section, and add a line stating this is general information rather than a legal opinion. Do not publish a per-city permit claim you have not checked at source.

## 14. Turn the 55 gallery photos into city-tagged, indexable project pages
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json ships a 55-item gallery catalog, but every item's metadata is generic — `"altHe": "פרויקט אלומיניום של סקיי שייד — גדרות ושערים 30"` — carrying only a category and a sequence number. There is no city field, no `ImageObject` schema anywhere in out/, and zero per-project pages. Meanwhile the 16 city pages contain no images at all: the shipped `<main>` of out/locations/tel-aviv/index.html is pure text plus two CTA buttons.

**Recommendation:** Add a `city` field to each item in the `images.gallery.items` array in site.config.json (and to the upstream imgquarry catalog so it survives a re-sync), then surface the matching photos on each city page via lib/gallery.ts. This solves two problems at once: it makes city pages visually credible and it gives each photo a geographic context. Rewrite `altHe` to be descriptive and locational rather than sequential — 'פרגולת אלומיניום עם הצללה חשמלית בחצר פרטית ברעננה' beats 'פרויקט אלומיניום … 30'. Where a project has enough substance (before/after, size, materials, timeline), give it its own page under /projects/[slug]/ with `ImageObject` schema and `contentLocation` set to the city. The city assignment for each of the 55 photos is a business fact — REQUIRES-CLIENT-INPUT; do not guess it from the filename.

```
// site.config.json — per gallery item
{
  "key": "skyshade/gallery/project-30.webp",
  "category": "גדרות ושערים",
  "city": "רעננה",                    // ⚠ REQUIRES-CLIENT-INPUT
  "altHe": "שער אלומיניום חשמלי בכניסה לבית פרטי ברעננה",
  "year": 2025
}

// city page — ImageObject with location
{
  "@type": "ImageObject",
  "contentUrl": "https://imgquarry.com/cdn-cgi/image/…/project-30.webp",
  "caption": "שער אלומיניום חשמלי בכניסה לבית פרטי ברעננה",
  "contentLocation": { "@type": "City", "name": "רעננה" },
  "creator": { "@id": "https://skyshade.co.il/#business" }
}
```

## 15. Four of the sixteen cities are orphaned from the sitewide footer
`medium` · impact `medium` · effort `S`

**Evidence:** components/layout/Footer.tsx:64 renders `locations.slice(0, 12).map(...)`. Against the 16-entry array at lib/site-config.ts:74-91, that silently drops הרצליה, כפר סבא, רעננה and מודיעין — the last four. I confirmed the truncation in the shipped output: the footer nav in out/locations/tel-aviv/index.html ends at רחובות. Those four pages therefore receive internal links only from /locations/ and the sitemap, giving them the weakest internal signal of the set — and Herzliya, Kfar Saba and Raanana are among the highest-value affluent markets for premium aluminium work.

**Recommendation:** Either render all 16 (the grid is already `grid-cols-2`, so 16 entries add four rows and no layout risk) or — better, given finding #1 — cut `locations` down to the cities you can genuinely support and render all of whatever remains. A hardcoded `slice(0, 12)` that silently diverges from the data array is a bug either way: if the list must be truncated for layout, the footer should link to /locations/ for the remainder rather than dropping cities without trace.

```
// components/layout/Footer.tsx:64 — render all, no silent truncation
{locations.map((c) => (
  <li key={c.slug}>
    <Link href={`/locations/${c.slug}`} className="text-white/70 hover:text-white">
      {c.name}
    </Link>
  </li>
))}
```

## 16. Keep the site map-embed-free — link to the GBP place instead, and add hasMap to schema
`low` · impact `low` · effort `S`

**Evidence:** `grep -rn "iframe|maps.google|google.com/maps|hasMap" app/ components/ lib/` returns exactly one hit: app/layout.tsx:54, the GTM noscript iframe. There is no Google Maps embed anywhere, and app/contact/page.tsx renders the location as plain text next to a MapPin icon.

**Recommendation:** Do not add one. A Google Maps iframe pulls roughly 500KB-1MB of JS across several third-party origins, is a consistent LCP/INP regression, and — decisively here — a service-area business with a hidden address has no pin worth embedding. The correct substitute costs nothing: once the GBP exists, link the contact page's location line to the profile's place URL (`https://www.google.com/maps/place/?q=place_id:…`) and add `hasMap` with the same URL to the business node in schema. That gives users a route to directions/reviews and gives Google an explicit site→profile association, with zero bytes added. If a visual is wanted on /contact/, use a static illustrated coverage map of Israel as an inline SVG rather than a live tile embed.

```
// business node addition
"hasMap": "https://www.google.com/maps/place/?q=place_id:XXXXXXXX"

// app/contact/page.tsx — location line becomes a link
<a href={siteConfig.social.googleBusiness} target="_blank" rel="noopener"
   className="font-medium hover:text-primary">
  {siteConfig.serviceArea} — צפו בפרופיל שלנו בגוגל
</a>
```

## 17. Verify Search Console and stand up local rank tracking — nothing is measurable today
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:57 `"googleSiteVerification": null`, so no meta verification tag ships and the property is almost certainly unverified. GTM-KWGGH438 is installed (confirmed in out/index.html) but GTM measures on-site behaviour only — it cannot report impressions, queries or the map-pack. There is no GBP, therefore no GBP Performance data either. Every other finding here is currently unfalsifiable.

**Recommendation:** Three steps, in order. (1) Verify Search Console via DNS TXT at Cloudflare (which already fronts the domain per the `Server: cloudflare` response header) — this verifies the whole domain and survives the static export, and is more robust than the meta-tag path; if you prefer the meta tag, set `analytics.googleSiteVerification` in site.config.json and let the kit emit it. Submit https://skyshade.co.il/sitemap.xml (already generated by app/sitemap.ts, correctly with trailing slashes). Then use the Pages report filtered to `/locations/` to test finding #1 empirically — if the 16 city pages accrue impressions but near-zero clicks, or fail to get indexed at all, that confirms the duplicate-template diagnosis. (2) Once the GBP is live, its Performance report is the primary local KPI: searches broken into direct vs discovery, calls, direction requests, website clicks. (3) For rank tracking, whole-country position is meaningless for local intent — you need geo-gridded tracking that samples results from coordinates inside each target city (Local Falcon and BrightLocal both support IL coordinates). Track a small honest set: 'פרגולות אלומיניום {עיר}', 'גדרות אלומיניום {עיר}', 'מתקין פרגולות {עיר}' across the 5-6 stage-1 cities, and separately in Search Console for the organic side.

**Risk:** GBP Performance data is retained for a limited window and is not backfilled — create the profile before the content work lands so you have a baseline to measure the rest against.


# Keyword universe and information architecture expansion

**Current state:** The site is a 36-page static export whose entire keyword surface is six service hubs, sixteen city pages, and a gallery. I measured what actually ships: a city page (`out/locations/tel-aviv/index.html`) carries 266 total visible words of which roughly 100 are unique body copy, and after normalising the city name all sixteen city pages are byte-for-byte identical at 55,792 bytes each (`diff` returns zero across tel-aviv/jerusalem/haifa/modiin). Every one of the sixteen is titled `פרגולות אלומיניום ב{city}` (app/locations/[city]/page.tsx:22), so they all chase one head term with a geo modifier while the other five services get no geo targeting at all. Grepping all 36 shipped pages for the terms Israelis actually type returns zero hits for מצללה/מצללות, רפפות, פרגולה מרחפת, ביוקלימטית, מחירון, "כמה עולה", וילון זכוכית, נאספת, מתקפלת, סוכה and "תיקון 101" — the entire product-variant, pricing and regulation vocabulary is absent, and הצללה appears only inside the boilerplate meta/JSON-LD description string, never in body copy. There is no blog, no pricing page, no glossary, no project pages, and the 55 catalogued gallery photos carry auto-generated alt text (`פרויקט אלומיניום של סקיי שייד — דקים 1`) with no addressable category URLs because filtering is client-side `useState` (components/marketing/FilterableGallery.tsx:35). The architecture is not merely thin — its one attempt at scale, the city matrix, is already sitting on the wrong side of Google's doorway-page line, which makes "expand it 6×" the most dangerous available move.


## 1. Fix the 16 existing city pages before building anything on top of them — they are byte-identical doorway pages today
`critical` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** Normalising the city name out of four shipped city pages produces four files of exactly 55,792 bytes with zero `diff` output: `sed 's/תל אביב/CITY/g...' out/locations/{tel-aviv,jerusalem,haifa,modiin}/index.html` → identical. The template (app/locations/[city]/page.tsx:56-86) is two paragraphs plus a link list; total visible text is 266 words including nav and footer chrome, leaving ~100 words of body copy, of which the only per-city variation is the token `{city.name}` appearing three times.

**Recommendation:** Do not add a single new programmatic page until this is resolved. Two acceptable paths, pick one per city rather than globally. (a) Earn the page: give each city 200+ words that could only have been written about that city — named neighbourhoods served, a real delivered project with its photo, the local planning quirk that actually applies (Tel Aviv balcony pergolas need ועד בית consent and often a הנחיות מרחביות check; Jerusalem's stone-cladding requirement changes the חיפוי קירות conversation entirely; Beer Sheva's dust and heat load drive different aluminium finishes). (b) Retire the page: cut lib/site-config.ts:74-91 down to the cities where real work exists, and let /locations/ carry the rest as plain text mentions. Add the uniqueness gate described in the 'publishing gate' finding so this cannot regress. Concretely: replace the inline JSX paragraphs in app/locations/[city]/page.tsx with a lookup into a new `lib/locations-content.ts` keyed by LocationSlug, and make the route `notFound()` when no entry exists.

```
// lib/locations-content.ts — one hand-written entry per city that earns a URL.
export interface CityContent {
  /** 200+ words that are true ONLY of this city. No token substitution. */
  intro: string;
  /** Real neighbourhoods/areas served — client-supplied. */
  areas: string[];
  /** Planning/HOA reality specific to this municipality. */
  planningNote: string;
  /** Catalog keys of projects actually delivered here. Empty => no page. */
  projectKeys: string[];
}

export const cityContent: Partial<Record<LocationSlug, CityContent>> = {
  "tel-aviv": {
    intro:
      "בתל אביב רוב הפרויקטים שלנו הם פרגולות מרפסת בבנייני מגורים, לא פרגולות חצר. " +
      "המשמעות המעשית: כמעט תמיד נדרש אישור ועד הבית, ולעיתים גם בדיקה מול ההנחיות " +
      "המרחביות של עיריית תל אביב-יפו לגבי מרפסות פונות רחוב…",
    areas: ["הצפון הישן", "רמת אביב", "פלורנטין", "יפו", "נווה צדק"], // 🔶 REQUIRES-CLIENT-INPUT
    planningNote:
      "מצללה על מרפסת אינה נכללת בפטור הגורף של תקנות הפטור — הפטור מנוסח לקרקע ולגג המבנה.",
    projectKeys: ["skyshade/gallery/project-47.webp"],
  },
};
```

**Risk:** Option (b) removes URLs. On GitHub Pages there is no server-side 301 (public/.htaccess is inert), so retired city pages must be redirected via a Cloudflare Bulk Redirect rule or they will 404. Budget that before deleting.

## 2. Build the product-variant layer — it is the single largest missing keyword surface and it does not require any client facts
`critical` · impact `transformational` · effort `XL`

**Evidence:** Grep across all 36 shipped pages: מצללה 0, מצללות 0, רפפות 0, מרחפת 0, ביוקלימטית 0, נאספת 0, מתקפלת 0, וילון זכוכית 0. Meanwhile the Israeli SERP for these is a dedicated-page market: unikit.co.il/פרגולה-מרחפת-מאלומיניום/, silvergate.co.il/…/bioclimatic-pergula/, pergolass.co.il/electrical-pergola/, sorag.co.il/glass-curtain-balcony/ all run one URL per variant. Sky Shade compresses all of this into six hub pages — app/service/pergolas/ is 430 visible words covering manual pergolas, electric pergolas, polycarbonate, glass and timber roofs at once.

**Recommendation:** Add a `/service/[slug]/[variant]/` segment and give each commercially distinct product its own URL, H1 and FAQ. This is the taxonomic child of a service, so it earns the service parent (see the URL-direction finding for why the city axis goes elsewhere). Launch set, ordered by commercial value: under pergolas — `electric` (פרגולה חשמלית), `bioclimatic` (פרגולה ביוקלימטית / רפפות מתכווננות), `cantilever` (פרגולה מרחפת / תלויה ללא עמודים), `attached` (פרגולה צמודה לקיר), `polycarbonate` (פרגולת פוליקרבונט), `shade-structure` (מצללה); under accordion-products — `balcony-glazing` (סגירת מרפסת בזכוכית), `folding-glass` (וילון זכוכית נאסף/מתקפל), `windbreak` (מחסום רוח למרפסת); under decks — `wpc` (דק WPC/סינתטי), `natural-wood` (דק עץ טבעי), `pool-deck` (דק לבריכה); under fences-gates — `sliding-gate` (שער הזזה חשמלי), `swing-gate` (שער כנף חשmali), `slat-fence` (גדר השחלה / גדר הייטק); under wall-cladding — `hpl`, `acp` (אלוקובונד/קומפוזיט). Each variant page needs 500+ words of genuinely different substance: mechanism, when it is and is not the right choice, maintenance, and the honest downside. Register variants in a new `lib/variants.ts` and derive both the route and the sitemap from it.

```
// lib/variants.ts
export interface Variant {
  service: ServiceSlug;
  slug: string;
  /** H1 — the query, phrased as a person types it. */
  h1: string;
  /** Synonyms to work naturally into body copy, not to stuff. */
  alsoKnownAs: string[];
  intro: string;      // 150+ words
  howItWorks: string; // mechanism, in plain Hebrew
  suitedFor: string[];
  notSuitedFor: string[]; // the honest downside — this is what earns the ranking
  faqs: FaqPair[];
}

export const variants: Variant[] = [
  {
    service: "pergolas",
    slug: "bioclimatic",
    h1: "פרגולה ביוקלימטית — רפפות אלומיניום מתכווננות",
    alsoKnownAs: ["פרגולה עם רפפות מתכווננות", "פרגולה ביו-אקלימית", "פרגולה חשמלית מתכווננת"],
    notSuitedFor: [
      "תקציב נמוך — מנגנון הרפפות מייקר משמעותית לעומת גג קבוע",
      "מרפסות קטנות מאוד, שבהן עומק הפרופיל גורע מגובה המעבר",
    ],
    // …
  },
];

// app/service/[slug]/[variant]/page.tsx
export function generateStaticParams() {
  return variants.map((v) => ({ slug: v.service, variant: v.slug }));
}
```

**Risk:** Sixteen new pages written fast will read as templated. Write them in batches of three or four, each genuinely different in structure, not filled into one shape. If the team cannot sustain that, ship six variants well rather than sixteen badly.

## 3. The site never uses מצללה — the head-term synonym that is also the legal term in the planning regulations
`high` · impact `high` · effort `S`

**Evidence:** Zero occurrences of מצללה or מצללות across all 36 shipped pages. הצללה appears 138 times repo-wide but that is one boilerplate string echoed into meta description, og:description and JSON-LD on every page — visible-text extraction of out/index.html finds it exactly once, inside no body paragraph. Yet the exemption regulations Sky Shade's own FAQ leans on (lib/content.ts:111-113) are literally written about a מצללה: 'שטחה של המצללה לא יהיה יותר מ-50 מ"ר', 'המצללה תוקם רק על גבי הקרקע או על גג המבנה'.

**Recommendation:** Treat מצללה as a first-class term, not a synonym to sprinkle. It carries a distinct intent — a shade structure, often over a car park, a school yard or a garden seating area — where פרגולה skews decorative/residential. Three changes. (1) In lib/content.ts serviceMeta.pergolas, work מצללה into the description naturally: 'פרגולות ומצללות אלומיניום מעוצבות בהתאמה אישית…'. (2) Give it its own variant URL `/service/pergolas/shade-structure/` per the variant finding, with an H1 of `מצללות אלומיניום — פתרונות הצללה לחצר, לגינה ולחניה`. (3) Rewrite the permit FAQ answer at lib/content.ts:112 to use the regulation's own vocabulary, which both improves accuracy and picks up the term: this single edit is a two-minute change with outsized value because it aligns the copy with the phrasing of the query and of the law.

```
// lib/content.ts — serviceDetails.pergolas.faqs[1]
{
  q: "האם צריך היתר בנייה לפרגולה?",
  a: "תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר) — המוכרות כ\"חוק הפרגולות\" " +
     "או תיקון 101 — פוטרות מצללה מהיתר בתנאים: שטח עד 50 מ\"ר או עד רבע משטח " +
     "הקרקע/הגג (הגדול מביניהם), מבנה מחומרים קלים ללא קירות, ולפחות 40% " +
     "רווחים בתקרה. גם עבודה פטורה מחייבת דיווח לרשות הרישוי תוך 45 יום. " +
     "נסייע לכם לבדוק את המצב אצלכם מול הוועדה המקומית.",
}
```

## 4. Put service×city under /locations/[city]/[service]/, not /service/[slug]/[city]/ — the variant axis has the stronger claim to the service parent
`high` · impact `high` · effort `M`

**Evidence:** Both axes want to be the child of /service/[slug]/ and Next's App Router cannot host two dynamic siblings at one level — `app/service/[slug]/[city]` and `app/service/[slug]/[variant]` are the same route. The market shows no consensus that settles it externally: silvergate.co.il nests city under the service (`/פרגולות-אלומיניום/התקנת-פרגולות-אלומיניום-בתל-אביב/`), perlumpergola.com goes flat (`/pergola-ramat-gan/`), pergolass.co.il goes flat Hebrew (`/פרגולות-בתל-אביב/`). Meanwhile /locations/[city]/ already exists as 16 published URLs (app/locations/[city]/page.tsx) with nothing beneath them.

**Recommendation:** Assign the service parent to the variant (a genuine subtype) and the geo parent to the city page (a modifier). This yields: `/service/[slug]/[variant]/` for products, `/locations/[city]/[service]/` for geo. Three practical reasons beyond taxonomy. It requires zero migration — the 16 existing /locations/[city]/ URLs keep their exact meaning and simply gain children, so nothing needs a redirect on a host that cannot issue one. It converts the currently worthless city page into a real hub with spokes, fixing the doorway problem and the hub problem with one build. And the breadcrumb reads honestly: בית ← אזורי שירות ← תל אביב ← פרגולות אלומיניום. Set the H1 to the query regardless of path — `פרגולות אלומיניום בתל אביב` — because the H1 and title carry the ranking weight, not the directory. Create app/locations/[city]/[service]/page.tsx driven by a curated registry, never by a cartesian product.

```
// app/locations/[city]/[service]/page.tsx
import { serviceAreas } from "@/lib/service-areas";

export function generateStaticParams() {
  // The registry IS the allowlist. No .flatMap over locations × services anywhere.
  return serviceAreas.map((a) => ({ city: a.city, service: a.service }));
}

export function generateMetadata({ params }): Metadata {
  const a = find(params);
  if (!a) return {};
  return {
    alternates: { canonical: `/locations/${a.city}/${a.service}/` },
    title: `${a.serviceName} ב${a.cityName} — סקיי שייד`,
    description: a.metaDescription, // hand-written per pair, not templated
  };
}
```

**Risk:** If the team later decides service-first was right, moving 20+ published URLs on GitHub Pages needs Cloudflare Bulk Redirects. Decide once, now, before publishing.

## 5. Build roughly 18-24 of the 96 service×city combinations, not 96 — and gate each on delivered work
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** 6 services × 16 cities = 96. The existing 16-page city matrix already demonstrates what happens when the matrix outruns the content: 100 unique words per page, byte-identical output. There is also demand asymmetry the matrix ignores — the SERP for `פרגולות אלומיניום תל אביב` is saturated with dedicated vendor pages, while `מטבח חוץ בני ברק` or `חיפוי קירות מודיעין` show no such competition because the query volume does not support one.

**Recommendation:** Tier explicitly and encode the tiers in `lib/service-areas.ts`. Tier 1 (build first, 6-8 pages): pergolas × the cities where the client has real delivered projects — likely tel-aviv, ramat-gan, herzliya, raanana, kfar-saba, petah-tikva given the Sharon/Gush Dan concentration of the market, but this must come from the client's job list, not from assumption. Tier 2 (build second, 8-12 pages): the second and third services by revenue (probably fences-gates and decks) across the same 4-6 cities, plus accordion-products × the high-rise cities where balcony closure is the dominant job — tel-aviv, ramat-gan, bnei-brak, netanya, ashdod. Tier 3 (do not build): everything else — outdoor-kitchen and wall-cladding × secondary cities have neither the query volume nor, realistically, the delivered projects to write about. Cover those through the service hub plus the nationwide statement. Hard rule to write into the registry: no page ships without at least one real delivered project in that city for that service. That single constraint is what separates a legitimate local landing page from a doorway, and it also happens to make the pages good.

```
// lib/service-areas.ts
export interface ServiceArea {
  service: ServiceSlug;
  city: LocationSlug;
  tier: 1 | 2;
  /** 200+ words unique to THIS pair. */
  intro: string;
  /** Real delivered jobs. Empty => the page is not published. */
  projects: { catalogKey: string; year: number; note: string }[];
  /** Pair-specific — e.g. ועד בית consent for TLV balcony pergolas. */
  faqs: FaqPair[];
}

const MIN_WORDS = 200;

export const publishable = serviceAreas.filter(
  (a) => a.projects.length > 0 && a.intro.trim().split(/\s+/).length >= MIN_WORDS,
);
```

**Risk:** The whole plan depends on the client's real project-by-city list. Without it, either the pages are fabricated (spam) or the tiering is guesswork. Get the job list before writing a line.

## 6. There is no pricing content anywhere — the largest commercial-investigation cluster in this market is fully unaddressed
`high` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** Zero occurrences of מחירון or "כמה עולה" across all 36 shipped pages; the word מחיר appears only inside CTA copy ('הצעת מחיר'), never attached to a number or a range. The Israeli SERP for this category is almost entirely price-led: results are titled `פרגולות אלומיניום מחיר מ-700₪ למ"ר`, `מחירון פרגולות מעודכן [2026]`, `כמה עולה דק סינטטי`, `מחירון סגירת מרפסות (מעודכן לשנת 2025)`. Published ranges cluster at roughly ₪700-1,200/m² for a post-supported aluminium pergola, ₪1,000-1,800/m² attached, ₪1,300-2,200/m² electric/bioclimatic, ~₪850/m² installed for WPC decking, ₪800-1,500/m² for balcony closure — meaning buyers arrive already anchored, and a site with no price signal is filtered out before contact.

**Recommendation:** Build a pricing hub at `/pricing/` (`מחירון סקיי שייד — כמה עולה?`) with a child per service at `/pricing/[service]/`. Structure each child as: what drives the price (size, mechanism, finish, access, foundation), an honest range with an explicit 'why your quote will differ' section, a worked example ('פרגולה חשמלית 4×5 מ\" — טווח X-Y ₪'), and what is and is not included (VAT, foundations, electrical infrastructure, permit assistance). Do not publish a number the client has not confirmed — the ranges above are competitor-published, not Sky Shade's. Ask for: typical ₪/m² by service and mechanism, whether quotes include מע\"מ, whether foundations and electrical hookup are in scope, and the minimum job size. Add a lastReviewed date to each pricing page and a build-time staleness warning; a price page that silently ages is worse than none. Register the hub in app/sitemap.ts.

```
// lib/pricing.ts — every number here is CLIENT-CONFIRMED or the page does not build.
export interface PriceBand {
  service: ServiceSlug;
  variant?: string;
  label: string;              // "פרגולת אלומיניום חשמלית"
  minPerSqm: number;
  maxPerSqm: number;
  vatIncluded: boolean;
  includes: string[];         // ["ייצור", "התקנה", "אחריות"]
  excludes: string[];         // ["יסודות בטון", "תשתית חשמל"]
  lastReviewed: string;       // "2026-08"
}

// Fails the build rather than shipping a stale price page.
const STALE_MONTHS = 9;
export function assertFresh(b: PriceBand) {
  if (monthsSince(b.lastReviewed) > STALE_MONTHS)
    throw new Error(`Price band "${b.label}" is stale (${b.lastReviewed}) — re-confirm or remove.`);
}
```

**Risk:** Publishing ranges invites price-shoppers and lets competitors undercut. It also constrains quoting. Frame as 'טווח מחירים — הצעה מדויקת לאחר מדידה' and confirm the client accepts the tradeoff before building.

## 7. Build a /guides/ hub and make the building-permit guide its anchor — it is the highest-intent informational query in this category
`high` · impact `transformational` · effort `XL`

**Evidence:** The site has no informational content at all; the only permit coverage is two FAQ answers (lib/content.ts:111-113 and 345-347) totalling about 60 words, and 'תיקון 101' / 'חוק הפרגולות' / 'רפורמת הפרגולות' appear zero times across the export. The competing SERP for this is contested by law firms (felaw.co.il, benyacov.com), architecture publications (architecture.org.il) and vendors (goodlife-outdoors.com, ipac.co.il, nayer.co.il) — a category where a vendor with real installation experience can legitimately outrank a law firm, because the buyer's actual question is 'will my pergola get me a demolition order' and the vendor is the one who deals with it weekly.

**Recommendation:** Create `/guides/` (מדריכים) with `/guides/[slug]/`. Anchor piece: `/guides/pergola-building-permit/` — `היתר בנייה לפרגולה: מתי פטור ומתי חייבים (תיקון 101)`. It must cover the actual exemption conditions — up to 50 m² or a quarter of the plot/roof area, whichever is larger; light materials, no walls; at least 40% gaps in the roof plane so no more than 60% is opaque; ground or building roof only, which is exactly why balcony pergolas usually fall outside the exemption; and the 45-day post-construction report to the licensing authority that most homeowners miss. Then the cases the regulations do not answer cleanly: bnei-hayir apartment balconies, ועד בית consent, and the fact that a municipality's הנחיות מרחביות can be stricter than the national exemption. Follow-on guides in priority order: `/guides/balcony-closure-permit/` (סגירת מרפסת — כמעט תמיד דורשת היתר, בניגוד לפרגולה), `/guides/pergola-sukkah/`, `/guides/wpc-vs-wood-deck/`, `/guides/aluminium-vs-wood-pergola/`, `/guides/hpl-vs-acp-cladding/`. Add `guides` to app/sitemap.ts:19-29. Add HowTo or FAQPage schema only where the content genuinely matches the shape.

```
// app/guides/[slug]/page.tsx — MDX or a typed registry, either is fine on a static export.
export interface Guide {
  slug: string;
  h1: string;
  intent: "informational" | "commercial-investigation";
  /** The service hub this guide funnels to — drives the in-body CTA and the hub link. */
  ownedBy: ServiceSlug;
  lastReviewed: string;
  /** Regulation guides cite the source; this is what makes them trustworthy. */
  sources?: { label: string; url: string }[];
}

// Disclosure line that belongs on every regulation guide:
// "המידע כאן הוא הסבר כללי ואינו ייעוץ משפטי או תכנוני. הדרישות משתנות בין רשויות —
//  בדקו מול הוועדה המקומית שלכם."
```

**Risk:** Regulatory content ages and being wrong here is costly for readers. Cite the regulation, date every page, and carry the non-advice disclosure. Do not let an AI draft ship unreviewed.

## 8. The Sukkot cluster is a uniquely Israeli seasonal opportunity with zero current coverage
`medium` · impact `high` · effort `M`

**Evidence:** Zero occurrences of סוכה or סוכות across all 36 shipped pages. The query is real and commercially contested: pergola vendors run dedicated pages (pergolan.co.il/pergolot/pergola-for-a-sukkah/, stb.co.il/פרגולה-סוכה/, wood-artist.co.il/wooden-pergolas/sukkot/) alongside halachic authorities (yeshiva.org.il, toraland.org.il, ph.yhb.org.il). The halachic problem is specific and directly product-relevant: סכך resting on metal is problematic because metal is מקבל טומאה, and the standard resolution is timber battens laid across the aluminium so the metal becomes מעמיד דמעמיד — which is a construction detail Sky Shade controls at design time.

**Recommendation:** Create `/guides/pergola-sukkah/` — `פרגולת אלומיניום כשרה לסוכה: מה צריך לתכנן מראש`. Cover the מעמיד דמעמיד solution with timber battens, the retractable/opening-roof pergola as the cleanest answer (a roof that opens fully leaves the סכך under open sky), the three-wall requirement, and the design decisions that must be made before manufacture rather than retrofitted in Elul. Cross-link it from `/service/pergolas/` and from the electric and bioclimatic variant pages, since an opening roof is the product this query converts into. Time the publish for late spring — the buying decision precedes Sukkot by months because manufacture and installation take weeks. Critically: present halachic content as a summary of published rulings with sources, and close with 'הכרעה הלכתית — שאלו את הרב שלכם'; a vendor asserting kashrut on its own authority is both wrong and a trust liability.

```
// Copy for the guide's closing block:
// "אנחנו לא פוסקים הלכה. מה שאנחנו כן יודעים לעשות: לתכנן את הפרגולה מראש כך
//  שתאפשר סוכה כשרה — לייסטים מעץ בכיוון מנוגד לרפפות האלומיניום, או גג נפתח
//  לחלוטין. את ההכרעה ההלכתית קבלו מהרב שלכם, ואנחנו נבנה לפיה."
//
// Internal links out of this guide:
//   /service/pergolas/           (hub)
//   /service/pergolas/electric/  (opening roof = the converting product)
//   /service/pergolas/bioclimatic/
```

**Risk:** Getting halacha wrong damages credibility with a large segment of the target market. Have the copy reviewed by someone competent, and never claim a product is 'כשר' as a blanket statement.

## 9. The accordion-products service is named after a category, not a query — it is invisible to the balcony-closure market
`high` · impact `high` · effort `M`

**Evidence:** The slug is `accordion-products` and the Hebrew name is `מוצרים אקורדיאוניים` (lib/site-config.ts:65) — a literal translation nobody types into a search box. The actual queries are סגירת מרפסת, וילון זכוכית, זכוכית נאספת, זכוכית מתקפלת, סגירת חורף למרפסת, and the SERP is a dense commercial market with published ranges around ₪700-1,500/m² for aluminium-profile closure and ₪1,500-1,800/m² + VAT for frameless folding glass. The page does contain the phrase סגירת מרפסת in its body (lib/content.ts:226-246) but the title, H1, slug, metadata and every internal link label say מוצרים אקורדיאוניים, so the strongest signals all point at a non-query.

**Recommendation:** Rename the display name in lib/site-config.ts:65 from `מוצרים אקורדיאוניים` to `סגירת מרפסות ופתרונות אקורדיון` — this propagates automatically to the H1 (app/service/[slug]/page.tsx:73), the title template (line 36), the nav, the footer and every related-services list, because they all read from the same source. Keep the `accordion-products` URL slug unchanged: renaming it would need a redirect this host cannot issue, and the URL string is the weakest of the signals being fixed. Then add the variant children `/service/accordion-products/balcony-glazing/`, `/…/folding-glass/` and `/…/windbreak/` per the variant finding. Also rewrite the tagline at lib/content.ts:57 to lead with the query rather than the mechanism.

```
// lib/site-config.ts:65
{ slug: "accordion-products", name: "סגירת מרפסות ופתרונות אקורדיון" },

// lib/content.ts — serviceMeta["accordion-products"]
{
  tagline: "סגירת מרפסת בזכוכית · וילון זכוכית נאסף · מחסום רוח",
  description:
    "סגירת מרפסת בזכוכית ואלומיניום — וילון זכוכית נאסף או מתקפל, תריסי אקורדיון " +
    "ומחסומי רוח. הופכים את המרפסת לחדר נוסף בחורף, בלי לוותר על הנוף בקיץ.",
  icon: "Blinds",
}
```

**Risk:** Changing the display name changes the label in the nav and in six related-service lists. Check the header does not overflow at mobile width — the new name is longer.

## 10. 55 gallery photos, zero addressable URLs, zero project pages, and machine-generated alt text
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json images.gallery holds 55 items across four categories; all 55 ship in out/gallery/index.html (56 <img> including the logo), so they are crawlable. But every alt string is generated as `פרויקט אלומיניום של סקיי שייד — {category} {n}` (lib/gallery.ts:56-57, mirrored into the catalog), carrying no material, no city, no product. The four category tabs live only in client `useState` (components/marketing/FilterableGallery.tsx:35) so `/gallery/` is one URL for four topics. The gallery page ships 173 visible words for 55 photographs.

**Recommendation:** Three layers, in order of ratio. (1) Cheap and immediate: add `/gallery/[category]/` static routes for the four categories so each becomes an addressable, linkable, titled page — `דקים`, `חיפוי קירות`, `גדרות ושערים`, `פרגולות, מחסות וגגות` — with the client filter defaulting from the route. Add ImageObject entries inside an ItemList on each. (2) Medium: replace the generated alt text with real descriptions written per photo. Alt text is the only text this page has; `דק WPC בגוון אגוז סביב בריכה פרטית ברעננה` is worth more than fifty copies of `דקים 1`. (3) Highest value, gated on client input: `/projects/[slug]/` case studies for the 12-20 best jobs — city, service, materials, size, timeline, the constraint that made it interesting, and 3-5 photos. These are the pages that make the service×city pages legitimate, because a city page that links to two real local projects is demonstrably not a doorway. Do not generate 55 project pages from 55 photos; that recreates the doorway problem in a new namespace.

```
// app/gallery/[category]/page.tsx
export function generateStaticParams() {
  return galleryCategories.map((c) => ({ category: slugifyCategory(c) }));
}

// lib/projects.ts — one entry per REAL job. No entry, no page.
export interface Project {
  slug: string;              // "pergola-electric-raanana-2025"
  service: ServiceSlug;
  city: LocationSlug;
  title: string;             // "פרגולה חשמלית 6×4 מ' ברעננה"
  year: number;
  materials: string[];
  sizeSqm?: number;
  challenge: string;         // what made this job non-obvious
  outcome: string;
  catalogKeys: string[];     // 3-5 keys from site.config.json images.gallery
}
```

**Risk:** Project pages need real job facts — city, size, year, materials. Inventing them is fabrication. If the client cannot supply them, ship layers (1) and (2) only; they are still worth doing.

## 11. Sitemap paths are a hardcoded array — every new section will be silently orphaned
`high` · impact `medium` · effort `M`

**Evidence:** app/sitemap.ts:19-29 hardcodes nine static paths and then maps over `services` and `locations` from lib/site-config. Nothing derives from a content registry. Any new section — variants, guides, pricing, projects, gallery categories — ships as real HTML that never enters /sitemap.xml unless someone remembers to edit this array. Given the plan adds five new route families, the failure is close to certain.

**Recommendation:** Refactor app/sitemap.ts to build from the same registries the routes use, so a page cannot exist without a sitemap entry. Import from lib/variants.ts, lib/guides.ts, lib/pricing.ts, lib/projects.ts and lib/service-areas.ts and map each. Add a build-time assertion that cross-checks the sitemap URL set against the files actually emitted under out/ and fails on any mismatch in either direction — an out/ page missing from the sitemap, or a sitemap URL with no file. Also replace `lastModified: now` (line 32): stamping every URL with build time on every deploy tells crawlers all 100+ pages changed simultaneously, which is noise. Carry a real lastReviewed date on each registry entry and use it.

```
// app/sitemap.ts
const entries: MetadataRoute.Sitemap = [
  ...staticPaths.map((p) => ({ url: url(p), lastModified: siteLastReviewed })),
  ...services.map((s) => ({ url: url(`service/${s.slug}`), lastModified: s.lastReviewed })),
  ...variants.map((v) => ({ url: url(`service/${v.service}/${v.slug}`), lastModified: v.lastReviewed })),
  ...publishableAreas.map((a) => ({ url: url(`locations/${a.city}/${a.service}`), lastModified: a.lastReviewed })),
  ...guides.map((g) => ({ url: url(`guides/${g.slug}`), lastModified: g.lastReviewed })),
  ...priceBands.map((b) => ({ url: url(`pricing/${b.service}`), lastModified: b.lastReviewed })),
  ...projects.map((p) => ({ url: url(`projects/${p.slug}`), lastModified: p.lastReviewed })),
];

// ops/verify-sitemap.mjs — run after `next build`, fail the deploy on drift.
// Walk out/**/index.html -> URL set A; parse out/sitemap.xml -> set B; assert A === B
// (excluding /404 and the legal pages you deliberately omit).
```

## 12. Internal linking is a flat footer blanket with no hub-and-spoke structure and almost no contextual in-body links
`high` · impact `high` · effort `M`

**Evidence:** Every page ships the same footer carrying all six services and twelve of the sixteen cities (visible in out/locations/tel-aviv/index.html footer text). Contextual body links are nearly absent: the city template's only in-body links are the six service cards (app/locations/[city]/page.tsx:73-85), and the service template's only ones are four sibling services (app/service/[slug]/page.tsx:155-167) selected by `.slice(0, 4)` — arbitrary array order, not relevance. Nothing links pergolas→decks as a natural pairing, nothing links a service to a project, and no page links to any FAQ answer's subject.

**Recommendation:** Adopt an explicit hub-and-spoke model and encode it rather than hand-linking. Four hubs: `/services/` (service hub), `/locations/` (geo hub), `/guides/` (informational hub), `/pricing/` (commercial hub). Linking rules — a spoke always links up to its hub and sideways to 2-3 genuinely related siblings; a hub links down to every one of its spokes; guides link across to the one service or variant they funnel to, and that service links back to the 1-2 guides that answer its top objection; project pages link to their service, their variant and their city page, and those three link back. Replace the `.slice(0, 4)` at app/service/[slug]/page.tsx:48 with a curated relatedness map — pergolas pairs with decks and outdoor-kitchen because they are one outdoor-living project; accordion-products pairs with pergolas because balcony closure is frequently sold onto an existing pergola; wall-cladding pairs with fences-gates on the facade-appearance job. Add a shared `<RelatedLinks>` component so every new route family gets the structure by default instead of by memory. Then trim the footer: with 100+ URLs, a footer listing everything stops being navigation.

```
// lib/linking.ts
export const relatedServices: Record<ServiceSlug, ServiceSlug[]> = {
  pergolas: ["decks", "outdoor-kitchen", "accordion-products"],
  decks: ["pergolas", "outdoor-kitchen"],
  "outdoor-kitchen": ["decks", "pergolas"],
  "accordion-products": ["pergolas", "wall-cladding"],
  "fences-gates": ["wall-cladding", "pergolas"],
  "wall-cladding": ["fences-gates", "decks"],
};

/** Guides that answer the top objection on each service page. */
export const serviceGuides: Record<ServiceSlug, string[]> = {
  pergolas: ["pergola-building-permit", "aluminium-vs-wood-pergola", "pergola-sukkah"],
  decks: ["wpc-vs-wood-deck"],
  "wall-cladding": ["hpl-vs-acp-cladding"],
  "accordion-products": ["balcony-closure-permit"],
  "fences-gates": [],
  "outdoor-kitchen": [],
};

// app/service/[slug]/page.tsx:48 — replace
// const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);
const others = relatedServices[card.slug].map((s) => byslug(s));
```

## 13. Comparison queries are answered in one-line FAQ answers with no URL of their own
`medium` · impact `high` · effort `M`

**Evidence:** Three high-value comparisons already exist as FAQ pairs but are buried: WPC vs natural wood (lib/content.ts:186-188, 42 words), composite/ACP vs HPL (lib/content.ts:161-163, 47 words), aluminium vs iron fencing (lib/content.ts:136-138, 33 words). None has a URL, an H1, or a title. The aluminium-vs-wood pergola comparison — the single most searched decision in this category, covered by ynet among others — is not addressed at all. These are commercial-investigation queries: the searcher has decided to buy and is choosing a material, which is the highest-converting moment a vendor can intercept.

**Recommendation:** Promote each comparison to its own guide URL with the comparison as the H1, keeping the FAQ answer in place as a summary that links to the full piece. Priority order: `/guides/aluminium-vs-wood-pergola/` (`פרגולת אלומיניום או עץ — מה עדיף?`), `/guides/wpc-vs-wood-deck/` (`דק WPC או עץ טבעי — השוואה`), `/guides/hpl-vs-acp-cladding/` (`חיפוי HPL או קומפוזיט — מה מתאים לחזית שלכם`), `/guides/aluminium-vs-iron-fence/` (`גדר אלומיניום או ברזל`). Each needs a real comparison table across cost, lifespan, maintenance, appearance, heat behaviour in Israeli sun, and — the part that earns trust and rankings — a clear statement of when the other option wins. A vendor page that says 'עץ טבעי עדיף אם אתם רוצים מראה חם ומוכנים לשמן אותו פעם בשנה' is more credible and more linkable than one that concludes aluminium always. Mark up the table honestly; do not force FAQPage schema onto prose that is not a Q&A.

```
// Comparison table shape — render as a real <table> with scope attrs, RTL-safe.
export interface ComparisonRow {
  criterion: string;   // "תחזוקה"
  optionA: string;     // "אלומיניום: ניקוי בלבד"
  optionB: string;     // "עץ: שימון כל 12-18 חודשים"
  winner: "a" | "b" | "depends";
}

// The section that makes the page trustworthy — do not omit it:
// <h2>מתי דווקא עץ טבעי עדיף?</h2>
```

## 14. /locations/ is a 207-word bare link list — it should be the geo hub that makes the city pages legitimate
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** out/locations/index.html carries 207 total visible words including nav and footer, and its heading outline is `<h1>אזורי שירות` followed only by the shared CTA `<h2>רוצים לשדרג את החוץ שלכם?` — no structural headings, no regional grouping, nothing but sixteen links.

**Recommendation:** Rebuild app/locations/page.tsx as a genuine hub. Group the sixteen cities into named Israeli regions with an h2 each — גוש דן (תל אביב, רמת גן, בני ברק, חולון, פתח תקווה), השרון (הרצליה, כפר סבא, רעננה, נתניה), שפלה ומרכז (ראשון לציון, רחובות, מודיעין), ירושלים והסביבה, חיפה והצפון, הדרום (אשדוד, באר שבע) — which both improves the outline and picks up regional queries the current page cannot rank for, since אזור השרון and גוש דן are how Israelis describe service areas. Add 150-200 words explaining how nationwide service actually works: travel, whether measurement visits are free everywhere, typical lead time by distance. Once the service×city pages exist, list each city's available services beneath it so the hub links down to every spoke. Add regional coverage statements to make the AdministrativeArea schema the site already emits correspond to visible content.

```
// lib/regions.ts
export const regions = [
  { name: "גוש דן", cities: ["tel-aviv", "ramat-gan", "bnei-brak", "holon", "petah-tikva"] },
  { name: "השרון", cities: ["herzliya", "kfar-saba", "raanana", "netanya"] },
  { name: "שפלה ומרכז", cities: ["rishon-lezion", "rehovot", "modiin"] },
  { name: "ירושלים והסביבה", cities: ["jerusalem"] },
  { name: "חיפה והצפון", cities: ["haifa"] },
  { name: "הדרום", cities: ["ashdod", "beer-sheva"] },
] as const;
```

**Risk:** Lead-time and travel claims by region are business facts. Confirm before publishing.

## 15. Keep English URL slugs — a Hebrew-slug migration cannot be executed safely on this host
`medium` · impact `low` · effort `S`

**Evidence:** Israeli competitors do rank with Hebrew slugs (pergolass.co.il/פרגולות-בתל-אביב/, silvergate.co.il/פרגולות-אלומיניום/…), so the question will come up. But the deploy target is GitHub Pages via .github/workflows/deploy.yml with `output: "export"` (next.config.mjs:8) and no server runtime; public/.htaccess is Apache-only and therefore inert. There is no mechanism in the current stack to issue a 301 from an old English URL to a new Hebrew one.

**Recommendation:** Decide explicitly not to migrate, and record why in next.config.mjs (whose comment at lines 6-7 already misstates the deploy target as cPanel/Apache and should be corrected in the same edit). The reasoning: slug language is a weak ranking signal next to the H1, title and internal anchor text, all of which are already Hebrew; percent-encoded Hebrew slugs are unreadable when shared or logged; and the migration would strand every existing URL. If the client ever insists, the only viable mechanism on this stack is a Cloudflare Bulk Redirect list or a Cloudflare Worker sitting in front of Pages — name that explicitly so it is a costed decision rather than a surprise. Apply the same rule to the new route families: `/service/pergolas/bioclimatic/`, `/guides/pergola-building-permit/`, `/locations/tel-aviv/pergolas/` — English slugs, Hebrew H1s.

```
// next.config.mjs — correct the stale comment while you are here.
//   Static HTML export. Deploy target is GitHub Pages (see .github/workflows/deploy.yml),
//   fronted by Cloudflare. There is NO server runtime and NO redirect capability:
//   public/.htaccess is Apache-only and inert here. Consequence for SEO: a published URL
//   is effectively permanent. Slugs stay English (ASCII, stable); Hebrew lives in the H1,
//   the <title> and the anchor text. Any future URL change needs a Cloudflare Bulk
//   Redirect list or a Worker — budget it before renaming anything.
```

## 16. Add a publishing gate that makes doorway pages fail the build rather than relying on discipline
`high` · impact `high` · effort `M`

**Evidence:** The existing city matrix proves the failure mode is real and silent: sixteen pages generated from one template, byte-identical after token substitution, shipped and indexed without anyone noticing. The plan in this report adds five new programmatic route families, several of which are matrix-shaped. Without a mechanical check the same outcome is near-certain at larger scale.

**Recommendation:** Add ops/verify-uniqueness.mjs to the build, run after `next build` and before deploy. For each programmatic route family it should extract visible body text from out/**/index.html excluding header, footer and the shared CTA, then assert two things: every page carries at least N words of body text (150 for city and service×city pages, 400 for variants and guides), and no two pages in a family exceed roughly 70% shingle similarity. Fail the deploy on violation. Beyond the mechanical check, hold three editorial lines. A page must answer a question a searcher actually has, not merely contain a keyword — `מטבח חוץ בחולון` with no Holon-specific substance is a doorway regardless of word count. A geo page must reference something that could only be written about that place: a real project, a named area, a municipal requirement. And never spin one article into six by swapping the city name; that is scaled content abuse whether a human or a model writes it. Where a page cannot clear the bar, the correct move is not to publish it — the six service hubs plus a strong nationwide statement will outrank ninety-six empty ones.

```
// ops/verify-uniqueness.mjs
const MIN_WORDS = { "locations/*/": 150, "locations/*/*/": 150, "service/*/*/": 400, "guides/*/": 400 };
const MAX_SIMILARITY = 0.70;

function bodyText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<header[\s\S]*?<\/header>/g, "")
    .replace(/<footer[\s\S]*?<\/footer>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Jaccard over 5-word shingles, pairwise within each family.
// Had this existed, the 16 city pages would have scored 1.00 and blocked the deploy.
for (const [a, b] of pairs(family)) {
  const sim = jaccard(shingles(bodyText(a.html), 5), shingles(bodyText(b.html), 5));
  if (sim > MAX_SIMILARITY)
    fail(`${a.path} and ${b.path} are ${(sim * 100).toFixed(0)}% identical — doorway risk.`);
}
```

**Risk:** A strict gate will block deploys while content is being written. Run it as a warning for the first sprint, then flip to failing — but do flip it, or it becomes decoration.


# E-E-A-T, trust, authority and off-site reputation

**Current state:** Sky Shade currently ships almost no verifiable trust evidence. The shipped HTML in `out/` contains zero `Organization`, `Person`, `Review`, `AggregateRating`, `hasCredential`, `memberOf` or `award` nodes, `site.config.json` has `schema.sameAs: []` and no `schema.address`, so the `HomeAndConstructionBusiness` node in `out/index.html` is an unanchored entity with a phone number and nothing else corroborating it. The `/about/` page ships 1,631 characters of text of which roughly 150 words are unique — two paragraphs and six one-word "values" — with no named human being, no photo of a person, no workshop, no founding story detail, no licence, no insurance, no certification. Worse, the site actively ships trust-*destroying* content: an unsubstantiated "מספר 1 בישראל" superiority claim in the hero (`components/marketing/Hero.tsx:23`), internal 🔶 placeholder markers rendered live on `/privacy/`, `/terms/` and `/accessibility/` ("🔶 נוסח משפטי מלא לאישור."), a `trustStats` bar whose "15+ שנות ניסיון" contradicts the site's own `foundedYear: 2009` (17 years as of 2026), and three testimonials whose own source comment admits the wording was "lightly completed". The single genuine asset — 55 real project photographs — is dumped into an undifferentiated filter grid with generated alt text ("פרויקט אלומיניום של סקיי שייד — דקים 1") and produces zero indexable, evidence-bearing project pages. The one thing the site gets right on this dimension is that it does *not* emit self-serving `Review`/`AggregateRating` schema, which would be ineligible for rich results and a policy risk; that restraint should be preserved.


## 1. Remove the unsubstantiated "מספר 1 בישראל" superiority claim from the hero
`critical` · impact `high` · effort `S`

**Evidence:** components/marketing/Hero.tsx:23 renders the badge `מספר 1 בישראל · מאז 2009`, and it ships: `grep -c "מספר 1 בישראל" out/index.html` returns 1. Nothing anywhere in the repo, the manifest, or lib/content.ts substantiates a #1 market-position claim; trustStats (500+ projects, 200+ customers) would not substantiate it even if verified.

**Recommendation:** Edit components/marketing/Hero.tsx:23 and replace the superlative with a claim the business can actually prove on request. Israel's חוק הגנת הצרכן, תשמ"א-1981 §2 prohibits misleading representations and the רשות להגנת הצרכן ולסחר הוגן can demand substantiation for advertising claims — an unqualified "number 1 in Israel" is exactly the kind of claim that must be evidenced. It is also a direct E-E-A-T negative: unsupported exaggeration is one of the clearest 'low trust' markers in Google's quality guidelines, and it is the very first thing a visitor reads. Substitute a concrete, checkable fact (years in business, number of installations, materials, warranty length) — those convert better anyway because they are specific.

```
// components/marketing/Hero.tsx:23 — BEFORE
  מספר 1 בישראל · מאז 2009

// AFTER (pick whichever the client can evidence):
  מתמחים באלומיניום לחוץ מאז 2009 · שירות בכל הארץ
// or, once the real project count is confirmed:
  {projectCount}+ פרויקטים מאז 2009 · אחריות {warrantyYears} שנים
```

**Risk:** If the client insists the claim is true, it still needs documented substantiation (market-share study, industry award) held on file before it can be republished; a bare assertion is not substantiation.

## 2. Strip internal 🔶 placeholder markers that ship live on /privacy/, /terms/ and /accessibility/
`critical` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** app/privacy/page.tsx:24 and app/terms/page.tsx:23 render `<span>🔶 נוסח משפטי מלא לאישור.</span>`; app/accessibility/page.tsx:39 renders `🔶 פרטי רכז נגישות ותאריך עדכון לאישור.` All three ship: `grep -o "🔶[^<]*" out/privacy/index.html out/terms/index.html out/accessibility/index.html` returns the visible strings on all three built pages.

**Recommendation:** Delete the three `<span className="text-gray-400">🔶 …</span>` elements and replace the surrounding stub text with finalised policy copy. These three pages are precisely where a cautious buyer or a quality rater looks to decide whether a business is real, and they currently announce in Hebrew that the legal text is unfinished and awaiting approval. For /accessibility/ the placeholder is worse than cosmetic: Israeli accessibility regulations expect a named רכז נגישות with contact details and a stated last-updated date, and the page currently says those are still pending. Add: named accessibility coordinator (name, phone, email), date of the accessibility survey, date of last update. For /privacy/ and /terms/, have the client's lawyer supply final text — but in the interim remove the marker rather than advertising the gap.

```
// app/accessibility/page.tsx — replace the 🔶 span with real data
<p>
  רכז הנגישות: <strong>{a11y.coordinatorName}</strong> · טלפון{" "}
  <span dir="ltr">{a11y.coordinatorPhone}</span> · דוא״ל{" "}
  <span dir="ltr">{a11y.coordinatorEmail}</span>
</p>
<p className="text-sm text-gray-500">
  הצהרה זו עודכנה לאחרונה בתאריך {a11y.updatedAt}.
</p>
```

**Risk:** The accessibility coordinator's name and the survey date are business facts — do not invent them. Publishing a fabricated coordinator is worse than the placeholder.

## 3. Do not publish the current trustStats — they are unverified and internally contradictory
`critical` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** lib/content.ts:284-289 defines `trustStats = [500+ פרויקטים, 200+ לקוחות מרוצים, 15+ שנות ניסיון, 100% אחריות מלאה]` under the file header comment at line 6: `🔶 = assumption; confirm with client (esp. stats and testimonials)`. The bar renders on two pages (`grep -rl "500+" --include=index.html out/` → out/index.html, out/about/index.html). site.config.json:10 sets `foundedYear: 2009`, which is 17 years as of 2026 — the site's own stat bar says 15+.

**Recommendation:** Either get the real numbers from the client and hard-code them with a `verifiedOn` date comment, or replace the numeric stats with claims that are true by construction. The 500-projects/200-customers pairing is also self-contradicting on its face (2.5 projects per customer for a business selling one pergola per household), which a careful reader notices. Concretely: change lib/content.ts:284-289 to derive years from the manifest so it can never drift again, and gate the two invented counts behind confirmed values. If the client cannot produce a defensible project count, drop those two tiles and use non-numeric trust tiles instead — a smaller bar of true statements outperforms a larger bar of dubious ones.

```
// lib/content.ts — years derived, counts gated on confirmed data
import { siteConfig } from "@/lib/site-config";
const yearsInBusiness = new Date().getFullYear() - siteConfig.founded; // build-time constant

export const trustStats = [
  { value: `${yearsInBusiness}`, label: "שנות ניסיון" },        // ✅ derived, always true
  { value: "אלומיניום בלבד", label: "התמחות" },                  // ✅ true by construction
  { value: "בכל הארץ", label: "אזור שירות" },                    // ✅ matches schema.areaServed
  { value: `${warrantyYears} שנים`, label: "אחריות בכתב" },      // ⚠️ needs the real number
] as const;
```

**Risk:** Static export bakes `new Date()` at build time — acceptable here since the site rebuilds on deploy, but note it will drift if the site is not rebuilt for over a year. Alternatively hard-code and add a yearly reminder next to the existing `const year = 2026` in components/layout/Footer.tsx:7.

## 4. Do not publish the current testimonials as-is — the source file admits the wording was altered
`critical` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** lib/content.ts:301-304 comment: `Testimonials — real reviews carried over from the live skyshade.co.il site. (Full wording lightly completed from the live excerpts; confirm before launch.)` Three testimonials with named individuals (יונתן כהן, מיכל דהן, רועי ונועה שפירא) and 5-star ratings render on the homepage only (`grep -rl "יונתן כהן" --include=*.html out/` → ./index.html). components/marketing/Reviews.tsx:28 headlines them with `מאות לקוחות מרוצים בכל הארץ`.

**Recommendation:** Publishing customer quotes whose wording was authored or 'completed' by anyone other than the customer, attributed to named private individuals, is a consumer-protection exposure under חוק הגנת הצרכן §2 and a defamation/privacy exposure toward the named people if the names are real but the words are not theirs. Two clean paths: (a) get written consent and the verbatim quote from each customer, store the consent, and add a project reference (city + service + month) to each testimonial so it is checkable; or (b) delete the hand-copied testimonials from lib/content.ts entirely and replace the Reviews section with a link out to the live Google Business Profile review page. Path (b) is faster, is what Google's own guidance points at, and is more persuasive to Israeli buyers who reflexively check Google reviews. Also fix the headline at components/marketing/Reviews.tsx:28 — 'מאות לקוחות מרוצים' over three quotes is an unsupported count.

```
// Option (b): components/marketing/Reviews.tsx — replace the hard-coded grid
<SectionHeading
  eyebrow="לקוחות ממליצים"
  title="מה לקוחות כותבים עלינו בגוגל"
  subtitle="כל חוות הדעת מתפרסמות בפרופיל העסקי שלנו בגוגל — בלי עריכה מצידנו."
/>
<a
  href={siteConfig.social.googleBusiness}
  target="_blank"
  rel="noopener"
  data-cta="reviews-gbp"
  className="..."
>
  קראו את כל חוות הדעת בגוגל ←
</a>

// Option (a): lib/content.ts — every testimonial becomes checkable
export const testimonials = [
  {
    author: "מיכל ד.",              // initial only unless full-name consent is on file
    city: "רעננה",
    service: "פרגולה חשמלית",
    date: "2025-06",
    rating: 5,
    text: "…",                       // VERBATIM. Never edited.
    consentOnFile: true,
  },
] as const;
```

**Risk:** If the three names are real customers who did give reviews, deleting them loses genuine social proof — so ask the client first whether verbatim originals and consent exist before removing.

## 5. Keep Review/AggregateRating schema OFF the site — collect real Google reviews instead
`high` · impact `high` · effort `S`

**Evidence:** No `Review` or `AggregateRating` node exists anywhere in out/ (`grep -o '"Review"\|AggregateRating' -r out/ --include=*.html` returns nothing). @ishub/site-kit's seo/index.ts provides no review builder either — localBusinessJsonLd (lines 78-115) emits no rating fields.

**Recommendation:** This absence is correct and must be defended against the obvious temptation to 'add review schema for stars'. Google's September 2019 self-serving-review restriction makes LocalBusiness/Organization pages ineligible for review rich results when the reviewed entity controls the reviews — including reviews injected via an embedded third-party widget on the entity's own site. Marking up the three hand-written testimonials in lib/content.ts as `Review` would therefore produce zero stars in the SERP while creating a structured-data policy exposure and, given finding #4, a false-statement exposure. The stars that actually appear for a business like this come from the Google Business Profile, not from the website. So: no Review schema, no AggregateRating, no review widget that exists purely to feed markup. Put the effort into the GBP review programme (see the review-acquisition finding) — that is where the star rating is rendered and where it influences the local pack.

```
// lib/content.ts / any future component — DO NOT DO THIS:
// {"@type":"Review","itemReviewed":{"@id":"…/#business"},
//  "reviewRating":{"@type":"Rating","ratingValue":5},
//  "author":{"@type":"Person","name":"יונתן כהן"}}
//
// Self-serving → ineligible for the review snippet, and here also unverified.
// The legitimate place for the aggregate rating is the Google Business Profile.
```

**Risk:** An agency or a plugin may 'helpfully' add review schema later. Add a comment in lib/content.ts above `testimonials` explaining why it is deliberately unmarked-up.

## 6. Publish a real physical address and wire it into schema.address (the builder already supports it)
`high` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:29-54 `schema` block has no `address` key at all, so the LocalBusiness node in out/index.html carries no PostalAddress. app/contact/page.tsx:72-79 shows only `{siteConfig.serviceArea}` = "שירות בכל הארץ" next to a map pin. Confirmed absent site-wide: greps for `רחוב`/`כתובת` across out/ match only the city name רחובות. Meanwhile @ishub/site-kit/seo/index.ts:87-89 already handles `s.address` and will emit a PostalAddress the moment the manifest has one — zero code change required.

**Recommendation:** Add the real registered/workshop address to site.config.json under `schema.address`; the JSON-LD builder picks it up automatically. Then surface it in components/layout/Footer.tsx (next to the existing phone/email/hours list) and on app/contact/page.tsx replacing the bare 'שירות בכל הארץ' pin. For a business that installs at the customer's home, the address does not have to be a showroom — a workshop or registered office is fine, and if the client does not want walk-ins the Google Business Profile can hide it while still using it for verification. But *some* verifiable address is the single largest missing trust and local-SEO signal: it is what lets Google connect the site to a Business Profile, and it is what a customer about to hand over a five-figure deposit looks for. Keep the address byte-identical between site.config.json, the GBP, and every directory listing.

```
// site.config.json — inside "schema", alongside priceRange/areaServed
"address": {
  "@type": "PostalAddress",
  "streetAddress": "<רחוב ומספר>",
  "addressLocality": "<עיר>",
  "postalCode": "<מיקוד>",
  "addressCountry": "IL"
},

// components/layout/Footer.tsx — add above the MapPin service-area line
<li className="flex items-start gap-2">
  <MapPin className="mt-0.5 h-4 w-4 text-accent-400" aria-hidden />
  <span>
    {manifest.schema.address.streetAddress}, {manifest.schema.address.addressLocality}
    <br />
    <span className="text-white/60">{siteConfig.serviceArea}</span>
  </span>
</li>
```

## 7. Disclose the legal entity: ח.פ. / ע.מ. number and full legal name in the footer and schema
`high` · impact `medium` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:7 sets `"legalName": "סקיי שייד"` — the brand name, not a registered entity. No company/VAT number appears anywhere in out/ (greps for `ח.פ`, `ע.מ.`, `עוסק מורשה` return nothing). components/layout/Footer.tsx:119-121 shows only `© 2026 סקיי שייד. כל הזכויות שמורות.` app/terms/page.tsx never names a contracting party.

**Recommendation:** Add the registered legal name and the company/dealer number (ח.פ. for a בע\"מ, or ע.מ./עוסק מורשה number for a sole trader) to the footer copyright line, to app/terms/page.tsx as the contracting party, and to the schema graph via `legalName` plus `vatID`/`taxID`. For a business asking customers for deposits on custom-manufactured goods, an anonymous 'סקיי שייד' with a mobile number and no legal identity is a genuine conversion blocker — Israeli buyers who have been burned by pergola installers check this. It is also the cheapest possible authoritativeness signal: a registration number is externally verifiable in the רשם החברות / מאגר עוסקים, which is exactly the kind of off-site corroboration the entity graph lacks today.

```
// site.config.json
"legalName": "<השם הרשום המלא, למשל: סקיי שייד בע״מ>",
"schema": {
  …,
  "vatID": "IL<9-digit>",
  "taxID": "<ח.פ. / ע.מ.>"
}

// components/layout/Footer.tsx:119-121
<p>
  © {year} {manifest.legalName} · ח.פ. {manifest.schema.taxID}. כל הזכויות שמורות.
</p>
```

**Risk:** The kit's SiteSchema type (node_modules/@ishub/site-kit/src/types.ts:33-41) does not declare vatID/taxID, and localBusinessJsonLd does not emit them — either extend the shared kit at its source (do not edit node_modules or the vendored tgz) or spread the extra fields onto the node in app/page.tsx after calling the builder.

## 8. Rebuild /about/ around named people, photographs and a checkable company history
`high` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** app/about/page.tsx is 54 lines and renders exactly two paragraphs plus six single-phrase values from lib/content.ts:292-299. Extracted visible text of out/about/index.html is 1,631 characters *including* the full header/footer chrome — roughly 150 words of unique body copy. It contains no person's name, no photograph of any human being, no address, no founding detail beyond the year, and no h3 subheadings (h1 → one h2 → a bullet list).

**Recommendation:** This is the highest-leverage single page on the site for this dimension and it is currently a stub. Rebuild it with, in order: (1) the founder — real name, real photograph, how many years in aluminium before founding Sky Shade in 2009, what he did before, why he started; the manifest already tells us the owner's email is yossi@skyshade.co.il, so there is a person to name. (2) The team — installers, fabricator, measurer — with first names, roles, tenure, and real photos taken on site. (3) The workshop/fabrication capability with real photographs (do they cut and weld in-house or assemble supplied kits? that distinction is exactly the Experience signal a buyer wants). (4) A dated milestone timeline (2009 founded · first electric pergola · move to current workshop · Nth project). (5) The concrete trust block: address, ח.פ., insurance, licences, warranty length, standards. (6) Only then the values list. Add h3 subheadings so the outline is genuinely three levels deep. Every photo must be an original photograph of Sky Shade's own people and work — stock imagery on an About page is a detectable negative and defeats the entire purpose. Target 700-900 words of unique copy.

```
// lib/content.ts — new structured about data (fill from the client interview)
export const team = [
  {
    name: "יוסי <שם משפחה>",
    role: "מייסד ובעלים",
    since: 2009,
    bio: "…עשר שנים בעבודות אלומיניום לפני שהקים את סקיי שייד ב-2009…",
    photoKey: "skyshade/team/yossi.webp",
    linkedin: "https://www.linkedin.com/in/<slug>",
  },
] as const;

export const milestones = [
  { year: 2009, text: "סקיי שייד נוסדה ומתמחה מהיום הראשון באלומיניום לחוץ." },
  { year: 20XX, text: "פתיחת בית המלאכה ב<עיר> וייצור עצמי של קונסטרוקציות." },
  { year: 20XX, text: "התקנת הפרגולה החשמלית הראשונה עם להבים מתכווננים." },
] as const;
```

**Risk:** Do not write a founder bio from imagination. If the client will not sit for a 30-minute interview and supply photos, ship a shorter honest page rather than a longer invented one.

## 9. Model the founder as a Person entity and link it to the business node
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** No `Person` node exists in out/ (`grep -o '"Person"' -r out/ --include=*.html` returns nothing). @ishub/site-kit/seo/index.ts has no Person builder. The business node in out/index.html has no `founder`, `employee` or `knowsAbout` property.

**Recommendation:** Yes, an expert entity should exist here — not as a fake 'author' byline on manufactured blog posts, but as the real person who has been fabricating aluminium since before 2009 and whose name will carry any future content. Add a `Person` node on /about/ with a stable @id, link it from the business node via `founder`, and give it `sameAs` to a real LinkedIn profile and any real professional listing. `knowsAbout` should list the six actual service topics so the entity is topically anchored. This is the correct model precisely because it is verifiable: a LinkedIn profile with employment history at Sky Shade since 2009 is external corroboration that the site itself cannot manufacture. Reuse the same @id as `author` on any future guide or project write-up so authorship consolidates on one entity rather than fragmenting.

```
// app/about/page.tsx
import { jsonLdScript } from "@ishub/site-kit/seo";
import { manifest } from "@/lib/site-config";

const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${manifest.url}/about/#founder`,
  name: "יוסי <שם משפחה>",
  jobTitle: "מייסד ובעלים",
  worksFor: { "@id": `${manifest.url}/#business` },
  image: "<URL לתצלום אמיתי>",
  knowsAbout: [
    "פרגולות אלומיניום", "פרגולה חשמלית", "גדרות ושערי אלומיניום",
    "חיפוי קירות אלומיניום וקומפוזיט", "דקים", "מטבחי חוץ",
  ],
  sameAs: ["https://www.linkedin.com/in/<slug>"],
};

<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: jsonLdScript(founderJsonLd) }} />

// app/page.tsx — attach to the business node (spread, do not edit the vendored kit)
const business = localBusinessJsonLd(manifest, { logo, image });
const jsonLd = [
  { ...business, founder: { "@id": `${manifest.url}/about/#founder` } },
  faqJsonLd([...faqs]),
];
```

**Risk:** Only ship this if the LinkedIn profile actually exists and is public. A `sameAs` pointing at a thin or empty profile corroborates nothing; an invented one is a policy violation.

## 10. Populate schema.sameAs — the entity currently has zero off-site corroboration
`high` · impact `transformational` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:53 `"sameAs": []`, and lib/site-config.ts:47-51 has `social: { facebook: "", instagram: "", googleBusiness: "" }` all empty and marked 🔶. `grep -o sameAs -r out/ --include=*.html` returns nothing — the prune() helper at @ishub/site-kit/seo/index.ts:19-27 drops empty arrays, so the property vanishes entirely from the shipped node. No social icons exist in components/layout/Footer.tsx either.

**Recommendation:** An entity with no sameAs is an entity Google cannot confirm exists. Populate it, in this priority order for the Israeli market: (1) Google Business Profile — the single highest-leverage asset, see the next finding; (2) Facebook business page — still the dominant social channel for Israeli home-improvement buying decisions and where before/after project albums perform; (3) Instagram — visual trade, 55 project photos already exist; (4) LinkedIn company page, which also anchors the founder Person node; (5) the free listings on דפי זהב (d.co.il), B144, מידרג (midrag.co.il), המקצוענים (pro.co.il) and THE INDEX (theindex.co.il). Each of these gives an independently controlled page asserting the same name, phone and address, which is what NAP consistency means in practice. Then add the array to site.config.json (the builder emits it automatically at seo/index.ts:113) and render social icons in the footer so the links are crawlable from the HTML, not only from JSON-LD.

```
// site.config.json — schema.sameAs
"sameAs": [
  "https://www.google.com/maps/place/?q=place_id:<PLACE_ID>",
  "https://www.facebook.com/<page>",
  "https://www.instagram.com/<handle>",
  "https://www.linkedin.com/company/<slug>",
  "https://www.d.co.il/<listing>",
  "https://www.midrag.co.il/<listing>"
]

// lib/site-config.ts:47-51 — stop keeping a second, empty copy
social: {
  googleBusiness: manifest.schema.sameAs.find(u => u.includes("google.com/maps")) ?? "",
  facebook:       manifest.schema.sameAs.find(u => u.includes("facebook.com"))    ?? "",
  instagram:      manifest.schema.sameAs.find(u => u.includes("instagram.com"))   ?? "",
},
```

**Risk:** Only list profiles that exist and are actively maintained. A sameAs to an abandoned Facebook page with three 2019 posts is weak corroboration but not harmful; a sameAs to a 404 is.

## 11. Stand up and verify a Google Business Profile, then run a compliant review-acquisition programme
`high` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** lib/site-config.ts:50 `googleBusiness: ""` — no profile URL is known to the codebase. site.config.json:57 `"googleSiteVerification": null`. No GBP link, no review count, and no star rating appears anywhere in out/. The site's only social proof is the three unverified testimonials in lib/content.ts:305-324.

**Recommendation:** For an Israeli home-improvement SMB, the Google Business Profile *is* the reputation surface: it renders the star rating in the local pack and in branded search, and it is the only place review stars for this business will ever legitimately appear (see the self-serving-review finding). Set it up as a Service Area Business (hide the address, list the served cities) using the exact same NAP as site.config.json — brand name סקיי שייד, phone 050-5063152, and the address from the address finding. Then run a review programme that is compliant: ask every completed customer, ask all of them (not only the happy ones — review gating violates Google's policy), never offer any incentive, and never buy reviews. Practical mechanics that work in Israel: a WhatsApp message with the short review link sent by the installer on the day of handover, while satisfaction peaks. Target a steady trickle — 2-4 per month sustained beats 30 in one week, which trips spam detection. Reply to every review in Hebrew, including negative ones, since the replies are public evidence of how the business handles problems. Finally, once the profile exists, put its URL in schema.sameAs and link it from the Reviews section and the footer.

```
// WhatsApp handover message template (Hebrew, no incentive, no gating)
הי {שם},
תודה שבחרתם בסקיי שייד! נשמח אם תוכלו לשתף את החוויה שלכם
בחוות דעת בגוגל — זה עוזר ללקוחות הבאים להחליט:
{קישור קצר לחוות דעת}
בכל שאלה או תקלה — אנחנו כאן: 050-5063152

// ❌ אין לכתוב: "נשמח לחוות דעת 5 כוכבים", "קבלו הנחה עבור ביקורת",
// ❌ ואין לסנן: לשלוח רק ללקוחות שאמרו שהם מרוצים.
```

**Risk:** Verification for a SAB can take weeks and may require a video verification of the workshop and vehicles — factor that into the timeline. Also: if a profile already exists but is unclaimed or has the wrong phone, claiming and correcting it is the first step, not creating a duplicate.

## 12. Ship a /warranty/ page — "אחריות מלאה" is claimed 19 times on the homepage with no terms
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `grep -o "אחריות מלאה" out/index.html | wc -l` → 19 occurrences on the homepage alone. It appears in trustStats (lib/content.ts:288 "100% אחריות מלאה"), differentiators (lib/content.ts:266-267), every service's benefits list, processSteps (lib/content.ts:280), aboutValues (lib/content.ts:296), the FAQ (lib/content.ts:349-350) and every city page. Not once does any file state a duration, a covered component, an exclusion, or a claims procedure. There is no /warranty/ route in app/.

**Recommendation:** An unqualified '100% אחריות מלאה' repeated nineteen times reads as marketing noise, not as a commitment — and because it is unbounded it is arguably a misleading representation under חוק הגנת הצרכן. Replace the slogan with a real, bounded, written warranty and give it a page at app/warranty/page.tsx (Hebrew title: אחריות). Structure it as a table: component (קונסטרוקציית אלומיניום / צביעה בתנור או אנודייז / מנועים ובקרה בפרגולה חשמלית ובשער / זיגוג / התקנה), warranty period, what is covered, what is not. Add exclusions (כוח עליון, נזק מכוון, שינויים שבוצעו על ידי גורם אחר, אי-ביצוע תחזוקה), the claims procedure with a response-time commitment, and whether the warranty is transferable on sale of the property. Then change every '100%/מלאה' instance in lib/content.ts to the specific number ('אחריות X שנים בכתב') and link the phrase to /warranty/. A stated 7-year structural warranty converts far better than an unstated 'full' one, because it is checkable.

```
// app/warranty/page.tsx — table skeleton (numbers REQUIRE-CLIENT-INPUT)
<h1>האחריות של סקיי שייד</h1>
<table>
 <thead><tr><th>רכיב</th><th>תקופת אחריות</th><th>מה מכוסה</th></tr></thead>
 <tbody>
  <tr><td>קונסטרוקציית אלומיניום</td><td>X שנים</td><td>ריתוכים, חיבורים ועיוות מבני</td></tr>
  <tr><td>צביעה בתנור / אנודייז</td><td>X שנים</td><td>קילוף, בועות ודהייה חריגה</td></tr>
  <tr><td>מנוע ובקרה (פרגולה חשמלית / שער)</td><td>X שנים</td><td>מנוע, כרטיס בקרה ושלט</td></tr>
  <tr><td>עבודות התקנה</td><td>X שנים</td><td>עיגון, איטום וניקוז</td></tr>
 </tbody>
</table>
<h2>מה לא מכוסה</h2>
<ul><li>נזק מכוון או שימוש חורג</li><li>כוח עליון (סערה חריגה, שיטפון, רעידת אדמה)</li>
<li>שינוי או תיקון שבוצע על ידי גורם שאינו סקיי שייד</li>
<li>אי-ביצוע תחזוקה שוטפת כמפורט בהוראות התחזוקה</li></ul>
<h2>איך מממשים אחריות</h2>
<p>פנייה בטלפון 050-5063152 או במייל yossi@skyshade.co.il · מענה תוך X ימי עסקים.</p>
```

## 13. Publish a standards, permits and insurance page — the Israeli regulatory context is a trust moat
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** The site references regulation only in passing: lib/content.ts:111-112 claims 'פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר' inside a service FAQ, and lib/content.ts:345-346 repeats it on the homepage FAQ. No page discusses standards compliance, insurance, engineering certification or the actual conditions of the permit exemption. `grep` across out/ finds no תקן reference except ת״י 5568 on the accessibility page.

**Recommendation:** Build app/standards/page.tsx (Hebrew: תקנים, היתרים וביטוח). This is high-value because it is genuinely useful to the buyer, it is hard for a low-effort competitor to fake, and it demonstrates real Experience. Cover: (1) the permit exemption honestly — תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר), תשע\"ד-2014 exempts a מצללה subject to conditions, not just a 50 m² cap: light materials, and the shading surface must leave openings of at least 40% distributed evenly, plus a duty to report the works to the committee. The current FAQ answer omits all of that and is therefore misleading; fix it. (2) Wind loading — ת\"י 414 governs wind loads for structural design, and a large cantilevered pergola on an exposed roof is a real engineering question. State whether Sky Shade obtains a structural engineer's calculation and for which spans. (3) Glazing — ת\"י 938 and ת\"י 1099 govern safety glazing in buildings; balcony closures and glass pergola roofs fall squarely in scope. State that safety glass is used and to which standard. (4) Insurance — ביטוח צד ג' and ביטוח עבודות קבלניות with cover limits, and whether installers are covered by ביטוח חבות מעבידים. (5) The aluminium profile system supplier and its certification. Every one of these is checkable, which is exactly why it builds authority.

```
// lib/content.ts — the permit FAQ answer is currently incomplete; replace it
{
  q: "האם צריך היתר בנייה לפרגולה?",
  a: "מצללה (פרגולה) עשויה להיות פטורה מהיתר לפי תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר), תשע״ד-2014 — אך הפטור מותנה בתנאים: שטח של עד 50 מ״ר או עד רבע מהשטח הפנוי (הגדול מביניהם), בנייה מחומרים קלים, ומשטח הצללה שאינו אטום — המרווחים בין החלקים האטומים מחולקים באופן שווה ומהווים לפחות 40% מהשטח. גם כשקיים פטור נדרש דיווח לוועדה המקומית, וייתכנו הנחיות מקומיות נוספות. אנחנו בודקים את התנאים מול הוועדה שלכם לפני הייצור.",
}
```

**Risk:** Do not state a standard the business does not actually comply with, and do not claim insurance cover without seeing the policy — a false compliance claim is far more damaging than silence. Have the client's insurance broker and profile supplier confirm each line before publishing.

## 14. Add a data-collection notice and privacy link to the lead form (Amendment 13 obligation)
`high` · impact `medium` · effort `S`

**Evidence:** components/forms/LeadForm.tsx renders name, phone, service and message fields and posts to Web3Forms, ending at the submit button with only a WhatsApp alternative link — there is no notice of what the data is used for, no mention of transfer to a third-party processor (api.web3forms.com), and no link to /privacy/. The form appears on the homepage hero (components/marketing/Hero.tsx) and on /contact/, i.e. on the two highest-traffic pages.

**Recommendation:** Amendment 13 to Israel's Privacy Protection Law came into force on 14 August 2025 and carries a notification duty at the point of collection: the person must be told, in clear language and at the moment of collection, what the data is for, whether it will be transferred to third parties, and what their rights are. The form currently transmits the lead to Web3Forms — a third-party processor — with no disclosure at all. Add a short notice directly beneath the submit button in components/forms/LeadForm.tsx, linking to /privacy/, and expand app/privacy/page.tsx to name Web3Forms as the processor and describe retention and the right to request deletion. Beyond compliance this is a conversion asset: a visible, plain-language line about what happens to the phone number reduces the hesitation that kills form fills for a business asking for a callback.

```
// components/forms/LeadForm.tsx — directly under the submit <Button>
<p className="text-center text-xs leading-relaxed text-gray-500">
  הפרטים שתמסרו ישמשו אך ורק ליצירת קשר ולמתן הצעת מחיר, ויישמרו אצלנו לצורך זה בלבד.
  אנחנו לא מעבירים אותם לצדדים שלישיים למטרות שיווק. ניתן לבקש מאיתנו לעיין בפרטים
  או למחוק אותם בכל עת בטלפון <span dir="ltr">{siteConfig.phone}</span>.
  {" "}
  <Link href="/privacy" className="font-medium text-secondary hover:underline">
    מדיניות הפרטיות
  </Link>
</p>
```

## 15. Turn the 55 project photos into evidence-bearing case studies instead of an anonymous grid
`high` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:96-811 catalogues 55 gallery items whose alt text is machine-generated boilerplate — e.g. `"altHe": "פרויקט אלומיניום של סקיי שייד — גדרות ושערים 34"`. lib/content.ts:366-419 maps them to four category tabs. There is no /projects/ or /project/[slug] route in app/, so 55 real photographs of real completed work produce exactly zero indexable pages of evidence.

**Recommendation:** Experience is the E this business can actually prove and the only one it currently wastes. Add app/project/[slug]/page.tsx generating one static page per selected project (start with 10-15 of the strongest, not all 55). Each page carries the facts that make it evidence rather than decoration: city, service, structure size in m², profile system and colour (RAL code), glazing or roofing material, number of install days, the specific constraint the site imposed and how it was solved, and 3-6 photographs including a before shot. Link each project to its service page and its city page — this is the legitimate way to earn service×city relevance without doorway pages, because each page documents a distinct real job. Rewrite the alt text from the catalogue boilerplate to describe what is actually in each photograph. Where a customer consents, add a first name and a one-line verbatim quote; where they do not, the project stands on its own facts. Schema: keep it modest — WebPage plus ImageObject for the photos, `about` pointing at the Service node and `contentLocation` at the city. Do not use Product/Offer (there is no price) and do not attach Review schema.

```
// lib/projects.ts — one entry per documented job (all fields from real records)
export const projects = [
  {
    slug: "pergola-hashmalit-raanana-24sqm",
    title: "פרגולה חשמלית 24 מ״ר במרפסת גג ברעננה",
    city: "רעננה",
    service: "pergolas" as const,
    areaSqm: 24,
    system: "<שם מערכת הפרופילים>",
    colorRal: "RAL 7016",
    installDays: 2,
    completedAt: "2025-05",
    challenge: "מרפסת גג חשופה לרוח מערבית, ללא אפשרות עיגון לקיר…",
    solution: "קונסטרוקציה עצמאית על ארבעה עמודים עם בסיסים מוגדלים…",
    images: ["skyshade/projects/raanana-24/before.webp", "…"],
  },
];

// app/project/[slug]/page.tsx — schema (no Product, no Review)
const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebPage",
    name: p.title,
    about: { "@type": "Service", name: serviceName, provider: { "@id": `${manifest.url}/#business` } },
    contentLocation: { "@type": "City", name: p.city },
    primaryImageOfPage: { "@type": "ImageObject", contentUrl: heroUrl, caption: p.title } },
  breadcrumbJsonLd(manifest, [ … ]),
];
```

**Risk:** Photographing customers' private homes requires their permission; get written consent per project. If records for older jobs do not exist, document new jobs going forward rather than reconstructing details from memory.

## 16. Build an off-site authority plan appropriate to an Israeli aluminium SMB
`medium` · impact `high` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:53 `sameAs: []` and lib/site-config.ts:47-51 all-empty social means the site currently has no known inbound reference of any kind. Nothing in the repo (footer, about, service pages) links out to a supplier, association, partner or publication.

**Recommendation:** Work these in order of realism, not of glamour. (1) Supplier and manufacturer pages — Israeli aluminium profile makers (קליל, סחר-אלובין, אקסטל) and polycarbonate/roofing manufacturers (e.g. פלרם) run dealer, installer and project-reference pages; a fabricator who buys their systems has a legitimate claim to a listing, and the links are topically perfect. Same for the motor/automation brands used in electric pergolas and gates, via their Israeli importers. (2) Trade bodies — התאחדות הקבלנים בוני הארץ (acb.org.il) and the relevant לשכת המסחר chamber, if the business qualifies for membership; these give a `memberOf` claim that is externally checkable. (3) Free, moderated local directories: דפי זהב (d.co.il), B144, מידרג (midrag.co.il), המקצוענים (pro.co.il), THE INDEX (theindex.co.il). Low authority individually, but they establish NAP consistency, which is the point. (4) Partnerships — architects, landscape designers (אדריכלי נוף) and pool contractors who spec pergolas and decks; offer a joint project page where you host their credit and they host yours. This is the highest-quality realistic link source for this trade because it is a genuine business relationship. (5) Digital PR — pitch completed projects to Israeli home and architecture desks that regularly run outdoor-space features: ynet.co.il/architecture and Xnet both publish garden/courtyard and renovation stories. The pitchable angles are visual and specific, not promotional: a difficult rooftop install, a heritage-building facade cladding, a before/after of a west-facing balcony made usable year-round. Supply professional photography and the homeowner's consent and the pitch converts far more often. AVOID: paid link packages sold by Israeli SEO shops, Hebrew blog networks/PBNs, mass automated directory submission, reciprocal-link schemes, sponsored 'articles' without rel=sponsored, and anything resembling paid or incentivised reviews.

```
// Once a membership or certification is real, model it — do not fabricate:
// app/page.tsx, spread onto the business node
{ ...business,
  memberOf: { "@type": "Organization", name: "התאחדות הקבלנים בוני הארץ",
              url: "https://www.acb.org.il/" },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: "<שם ההסמכה מיצרן מערכת הפרופילים>",
    recognizedBy: { "@type": "Organization", name: "<שם היצרן>" },
  },
}
```

**Risk:** memberOf and hasCredential must reflect real, current memberships and certifications. Fabricating either is a spam-policy violation and, for a construction trade, a consumer-protection one.

## 17. Wire the unused images.badges slot to display real certification and supplier marks
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json:86 `"badges": []` — empty. The manifest schema explicitly supports it: node_modules/@ishub/site-kit/src/media/types.ts declares `badges?: ImageRef[]` on SiteImages, so the pipeline was built for exactly this and the site never used it. No trust-badge component exists in components/marketing/.

**Recommendation:** Once the client confirms which supplier certifications, system-partner marks, insurance certificates or standards marks are genuinely held (see the standards finding), add them to `images.badges` in site.config.json and render a TrustBadges strip near the footer and on /about/ and /warranty/. Each badge should link to the issuing body's page verifying it, not just sit as a decorative image — an unlinked logo is decoration, a linked one is a credential. Pair the visual strip with the `hasCredential`/`memberOf` JSON-LD from the off-site authority finding so the machine-readable and human-readable claims agree.

```
// components/marketing/TrustBadges.tsx
import { SiteImage } from "@ishub/site-kit/components";
import { siteImages } from "@/lib/gallery";

export function TrustBadges() {
  const badges = siteImages?.badges ?? [];
  if (!badges.length) return null;   // renders nothing until real badges exist
  return (
    <div className="border-t border-gray-100 bg-white py-8">
      <p className="text-center text-sm font-semibold text-gray-500">
        תקנים, הסמכות ושותפים
      </p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-8">
        {badges.map((b) => (
          <li key={b.key}>
            <SiteImage images={siteImages} image={b} className="h-10 w-auto opacity-80" />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 18. Add the missing Organization and WebSite entity nodes so the graph has a root
`medium` · impact `medium` · effort `M`

**Evidence:** out/index.html contains only HomeAndConstructionBusiness + FAQPage. No `Organization` or `WebSite` node exists anywhere in out/ (`grep -o '"Organization"' -r out/ --include=*.html` returns nothing). @ishub/site-kit/seo/index.ts exposes only localBusinessJsonLd, serviceJsonLd, faqJsonLd and breadcrumbJsonLd — there is no Organization or WebSite builder in the shared kit.

**Recommendation:** The LocalBusiness node is doing double duty as the brand entity and is missing the properties that make an entity legible: `legalName`, `slogan`, `numberOfEmployees`, `foundingLocation`, `founder`, `award`, `hasOfferCatalog` listing the six services. Add a WebSite node with `publisher` pointing at the business @id so the site and the organisation are explicitly connected, and extend the business node with the identity properties. Because the kit is vendored (vendor/ishub-site-kit-0.0.0.tgz) do not edit it in place — either add the properties by spreading onto the builder's output in app/page.tsx, or, better, contribute an `organizationJsonLd`/`websiteJsonLd` builder to the shared kit at its canonical source so the whole fleet gets it. Note that a SearchAction/potentialAction is NOT worth adding here: the site has no search function, so declaring one would be a false claim.

```
// app/page.tsx
const business = localBusinessJsonLd(manifest, { logo, image });
const jsonLd = [
  {
    ...business,
    legalName: manifest.legalName,
    slogan: manifest.tagline,
    founder: { "@id": `${manifest.url}/about/#founder` },
    foundingLocation: { "@type": "Place", name: "<עיר>" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "השירותים שלנו",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${manifest.url}/service/${s.slug}/` },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${manifest.url}/#website`,
    url: manifest.url,
    name: manifest.brandName,
    inLanguage: "he-IL",
    publisher: { "@id": `${manifest.url}/#business` },
  },
  faqJsonLd([...faqs]),
];
```

**Risk:** foundingLocation and numberOfEmployees are business facts — omit them rather than guessing. The prune() helper in the kit only runs inside the builder, so any spread-in field that is undefined must be omitted manually.

## 19. Extend trust content beyond the homepage — service and city pages carry none
`medium` · impact `medium` · effort `M`

**Evidence:** Testimonials render on exactly one page (`grep -rl "יונתן כהן" --include=*.html out/` → ./index.html only). The TrustBar renders on two (out/index.html, out/about/index.html). The 16 city pages built from app/locations/[city]/page.tsx contain only a PageHeader, two boilerplate paragraphs with the city name interpolated, a service link list and a CTA — no proof of any kind, and their JSON-LD is a BreadcrumbList and nothing else.

**Recommendation:** The pages a visitor lands on from search — /service/pergolas/, /locations/raanana/ — are the ones with the least trust content, which is backwards. Once real project case studies exist, surface 2-3 relevant ones on each service page and each city page (filtered by service and by city respectively), plus a link to /warranty/ and to /standards/ in the service sidebar. That gives the thin city pages something genuinely local and genuinely differentiating — a documented job in that city — which is the only defensible way to make 16 near-identical location pages worth having. Also add the founder's name and photo as a small 'מי מגיע אליכם' block on service pages: a named human attached to the work is a stronger conversion signal than another generic benefit bullet.

```
// app/locations/[city]/page.tsx — after the intro paragraphs
const cityProjects = projects.filter((p) => p.city === city.name).slice(0, 3);

{cityProjects.length > 0 && (
  <>
    <h2 className="mt-10 font-heading text-xl font-bold text-primary">
      פרויקטים שביצענו ב{city.name}
    </h2>
    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
      {cityProjects.map((p) => (
        <li key={p.slug}>
          <Link href={`/project/${p.slug}`}>{p.title}</Link>
          <p className="text-sm text-gray-500">
            {p.areaSqm} מ״ר · {p.installDays} ימי התקנה · {p.completedAt}
          </p>
        </li>
      ))}
    </ul>
  </>
)}
```

**Risk:** Depends on the case-study finding landing first. Do not fill these blocks with the generic gallery images and invented captions as a stopgap — that reintroduces the unverified-content problem at 16× the scale.


# Content quality, depth and on-page optimisation

**Current state:** The site is a well-built shell wrapped around roughly 1,900 words of unique Hebrew copy spread over 36 URLs — and it shows. Measured on the shipped HTML in out/, visible words inside <main> are: home 747, /services 221 (of which only 24 are not byte-identical to the homepage's services block), each /service/[slug] 287–316 (180–226 unique after removing the 5-step process and CTA boilerplate repeated on all six), each /locations/[city] 152, /about 158, /gallery 65, /contact 78. The 16 city pages are not merely similar: after masking the city name and slug, all 16 normalised <main> bodies hash to a single value — one identical document served 16 times, which is the textbook definition of a doorway page set. Title and description patterns are mechanically templated, with 43 characters of identical suffix on every service title and a description template on the city pages whose only variable is the city name. Every page except the homepage and /gallery ships zero images inside <main>, so the 55-photo catalog — the strongest proof asset the business owns — is locked behind one filterable grid with formulaic alt text ("פרויקט אלומיניום של סקיי שייד — {category} {n}", 52 of 55 English `alt` values on a Hebrew site). There is no middle-of-funnel content at all: no pricing, no materials comparison, no permit guide, no buying guides — precisely the pages competitors (pergolass.co.il, lidar.co.il, catomltd.co.il, pergolas4u.co.il) rank with. I also found a live Hebrew rendering bug on all 16 city pages and a factually misleading permit FAQ that contradicts the company's own product mix.


## 1. Rewrite or retire the 16 city pages — all 16 are one identical document
`critical` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** Hashing the normalised <main> of all 16 built city pages in out/locations/*/index.html (city name → CITY, slug → SLUG) yields exactly 1 distinct body: `distinct normalised <main> bodies across 16 city pages: 1`. Visible words in <main> = 152 (tel-aviv), 146 (jerusalem). The only variable content is the city name, which appears 20 times per document (title, description, canonical, breadcrumb JSON-LD, h1, subtitle, two body paragraphs, one h2). Template: app/locations/[city]/page.tsx lines 22–23 (metadata), 47–48 (header), 58–72 (entire body).

**Recommendation:** Either cut to the 4–6 cities where Sky Shade can genuinely say something specific, or give each surviving page a real content model. Target 700–900 visible words per city with this outline in app/locations/[city]/page.tsx, driven by a new per-city record in lib/site-config.ts (add fields: `demandProfile`, `climate`, `planningAuthority`, `permitNote`, `projects[]`, `faqs[]`):

H1 פרגולות אלומיניום ב{עיר}
H2 מה מתקינים ב{עיר} — ולמה (~150w: apartment-balcony closures in תל אביב/רמת גן/בני ברק vs private gardens in רעננה/כפר סבא/מודיעין vs rooftops)
H2 היתרים ואישורים ב{עיר} (~180w: the actual ועדה מקומית name, its published פטור-מהיתר procedure and the ארנונה treatment — REQUIRES RESEARCH per city, cite the municipality page)
H2 האקלים ב{עיר} ומה זה אומר לחומרים (~120w: מלח ורוח ים in הרצליה/נתניה/אשדוד; חום ואבק מדברי in באר שבע; קור, רוח ושלג in ירושלים)
H2 פרויקטים שביצענו ב{עיר} (3 real projects, photo + 40w caption each — REQUIRES-CLIENT-INPUT)
H2 שאלות נפוצות על פרגולות ב{עיר} (3 genuinely city-specific Q&A, ~150w)
H2 השירותים שלנו ב{עיר} (keep the existing link grid)

Rule: if you cannot write 400 words about a city that are true only of that city, delete the page and let /locations carry it. Sixteen thin near-duplicates actively suppress the domain; six strong ones do not.

```
// lib/site-config.ts — extend the flat list into a content record
export const locations = [
  {
    slug: "herzliya",
    name: "הרצליה",
    demandProfile:
      "בהרצליה פיתוח ובאזורי הווילות רוב הפניות הן לפרגולות גדולות מעל פינת ישיבה או סביב בריכה; בהרצליה העיר מדובר בעיקר בסגירת מרפסות ובמחסומי רוח לבנייני מגורים.",
    climate:
      "הקרבה לים אומרת רסס מלח ולחות גבוהה. אנחנו עובדים באלומיניום בצביעה אלקטרוסטטית בתנור ובאביזרי נירוסטה, כי ברזל וברגים מגולוונים מתחילים להחליד כאן תוך שנים ספורות.",
    planningAuthority: "הוועדה המקומית לתכנון ובנייה הרצליה",
    permitNote: "", // REQUIRES-CLIENT-INPUT / municipal research
  },
  // …
] as const;
```

**Risk:** Deleting city URLs needs 301s to /locations/ — impossible on GitHub Pages static export. Either keep the pages and fill them, or add a Cloudflare Pages Function / Worker redirect rule (Cloudflare already fronts the domain per the live `Server: cloudflare` header), or ship `<meta name="robots" content="noindex">` on the thin ones until they are written.

## 2. Fix the broken Hebrew on every city page: "כולל תל אביבוהסביבה"
`critical` · impact `high` · effort `S`

**Evidence:** Shipped HTML, out/locations/tel-aviv/index.html: `…בכל הארץ, כולל <!-- -->תל אביב<!-- -->והסביבה. כל פרויקט…` — no space between the city name and "והסביבה", so readers see "כולל תל אביבוהסביבה". Cause: app/locations/[city]/page.tsx lines 65–66, where the newline after `{city.name}` is stripped by JSX whitespace rules. Present on all 16 city pages.

**Recommendation:** Replace the JSX text-node interpolation with a template literal in app/locations/[city]/page.tsx. This also removes the `<!-- -->` text-node separators React injects, which currently fragment the sentence for any parser reading the raw HTML.

```
// app/locations/[city]/page.tsx — replace lines 64–68
<p className="mt-4 text-gray-700">
  {`מ-2009 אנחנו מעצבים מרחבי חוץ ללקוחות פרטיים ועסקיים בכל הארץ, כולל ${city.name} והסביבה. כל פרויקט מלווה בייעוץ ומדידה ללא עלות, הצעת מחיר שקופה ואחריות מלאה על העבודה ועל המוצר.`}
</p>

// and lines 58–63
<p className="text-lg leading-relaxed text-gray-700">
  {`מחפשים חברת אלומיניום מקצועית ב${city.name}? סקיי שייד מתכננת, מייצרת ומתקינה פרגולות אלומיניום, גדרות ושערים, חיפוי קירות, דקים ומטבחי חוץ — בהתאמה אישית למידות, לסגנון ולצרכים שלכם.`}
</p>
```

## 3. Give /services its own reason to exist — it is currently 24 unique words
`critical` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** out/services/index.html <main> is 221 visible words. The `<section id="services">` block (10,045 chars, 175 words) is byte-for-byte identical to the same block on out/index.html — verified by string equality. Subtracting that block and the sitewide FinalCta leaves exactly 24 unique words: the breadcrumb, the h1 "השירותים שלנו", and one subtitle line. app/services/page.tsx is 25 lines and renders only <PageHeader>, <ServicesGrid> (the shared homepage component) and <FinalCta>. Heading outline is h1 + one real h2 (which is itself the homepage's h2 "פתרונות אלומיניום לכל מרחב חוץ") + the CTA h2.

**Recommendation:** Stop rendering the shared <ServicesGrid/> here and build a genuine category hub at 800–1,000 words in app/services/page.tsx:

H1 שירותי אלומיניום לחוץ — פרגולות, גדרות, דקים וחיפויים
H2 מה מתאים לכם? בחירה לפי המרחב (~200w — decision table: מרפסת דירה → סגירת מרפסת / מחסום רוח; חצר פרטית → פרגולה + דק; חזית בית → חיפוי + גדר ושער; פינת אירוח → מטבח חוץ + פרגולה)
H2 השירותים שלנו (the six cards, each with 2–3 sentences of NEW copy, not the homepage card text)
H2 החומרים שאנחנו עובדים איתם (~200w — אלומיניום 6063 בצביעה אלקטרוסטטית, פוליקרבונט, זכוכית מחוסמת, WPC, קומפוזיט ACP, HPL — one paragraph each, REQUIRES-CLIENT-INPUT for the exact alloy/coating spec)
H2 טווחי מחירים לפי סוג פרויקט (~150w, REQUIRES-CLIENT-INPUT)
H2 שילובים נפוצים (~120w — pergola+deck, cladding+fence — this is how you sell the second job)

Rewrite the homepage's card descriptions or the hub's, so the same 175 words never ship twice.

**Risk:** If /services stays a mirror, Google will pick one of /services or / for "פתרונות אלומיניום" queries and the other becomes dead weight in the crawl budget.

## 4. Service pages carry 180–226 unique words — triple them with a real content model
`high` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** Sentence-level de-duplication across the six built service pages: pergolas 316 total / 226 unique, fences-gates 287/197, wall-cladding 294/203, decks 288/197, outdoor-kitchen 288/182, accordion-products 287/180. The 90–107 shared words are the identical 5-step process (lib/content.ts:272–281) and the FinalCta, repeated verbatim on all six. Heading outline on out/service/pergolas/index.html is h1 + 4 h2 (one of which is the sitewide CTA) + 4 FAQ h3s. Zero images inside <main> (measured: `imgs-in-main=0` on pergolas, decks, outdoor-kitchen). Meta description is verbatim identical to the first on-page paragraph (app/service/[slug]/page.tsx:38 reuses `card.description`, which line 85 also renders).

**Recommendation:** Target 1,200–1,600 visible words per service page. Extend `ServiceDetail` in lib/content.ts with `variants`, `pricing`, `spec`, `regulation`, `maintenance` and render them in app/service/[slug]/page.tsx:

H1 (money keyword — see the title finding)
Intro 80–120w (NEW copy, not the meta description)
H2 סוגי {שירות} — with H3 per variant (~300w). Pergolas: H3 פרגולה ידנית קבועה / H3 פרגולה חשמלית עם להבים מתכווננים / H3 פרגולת פוליקרבונט / H3 פרגולת זכוכית / H3 פרגולה תלויה. Decks: H3 דק WPC / H3 דק עץ טבעי (איפאה, גרפילי) / H3 דק סביב בריכה.
H2 כמה עולה {שירות}? (~200w — ranges + the five drivers that move the price: מ״ר, גובה, סוג הגג, ביסוס/עיגון, גישה למנוף) — REQUIRES-CLIENT-INPUT
H2 חומרים ומפרט טכני (~200w — סגסוגת, עובי דופן הפרופיל, סוג הצביעה, סוג הברגים/אביזרים) — REQUIRES-CLIENT-INPUT. This is the single strongest E-E-A-T signal available and no competitor page in the SERP publishes it.
H2 היתרים ורגולציה (~200w — see the permit finding)
H2 תחזוקה ואחריות (~120w — what the warranty actually covers and for how long) — REQUIRES-CLIENT-INPUT
H2 פרויקטים שביצענו (4 photos from the catalog, filtered by category, each with a real caption — fixes the zero-images problem)
H2 שאלות נפוצות (expand from 3–4 to 6–8)
H2 איך אנחנו עובדים (keep)

Also decouple the meta description from `card.description` so the SERP snippet and the opening paragraph are two different pieces of writing.

## 5. Rewrite service titles around the terms customers actually search
`high` · impact `high` · effort `S`

**Evidence:** Built titles from out/: `פרגולות, מחסות וגגות — אלומיניום פרימיום בהתאמה אישית | סקיי שייד` (65 ch), `מוצרים אקורדיאוניים — אלומיניום פרימיום בהתאמה אישית | סקיי שייד` (64), `דקים — אלומיניום פרימיום בהתאמה אישית | סקיי שייד` (49). The suffix `— אלומיניום פרימיום בהתאמה אישית` is 32 identical characters on all six, plus 14 more from the `%s | סקיי שייד` template in app/layout.tsx:23. Generated at app/service/[slug]/page.tsx:36. The pergolas page — the company's flagship — does not contain the exact string "פרגולות אלומיניום" in its title; it uses the internal catalogue name "פרגולות, מחסות וגגות". Likewise "מוצרים אקורדיאוניים" is an internal product-line label; the consumer query is "סגירת מרפסת" (search results for "סגירת מרפסת" and "חוק הפרגולות וסגירת מרפסת" show established commercial pages competing for it).

**Recommendation:** Replace the template at app/service/[slug]/page.tsx:36 with a per-service `seoTitle` field in lib/content.ts. Proposed (all ≤60 ch before the `| סקיי שייד` suffix):

pergolas → פרגולות אלומיניום — ידניות וחשמליות, מחירים והתקנה (aluminium pergolas — manual and electric, prices and installation)
fences-gates → גדרות אלומיניום ושערים חשמליים — התקנה ומחירים (aluminium fences and electric gates)
wall-cladding → חיפוי קירות חוץ — אלומיניום, קומפוזיט ו-HPL (exterior wall cladding)
decks → דק WPC ודק עץ טבעי — התקנת דקים למרפסת ולבריכה (WPC and natural-wood decking)
outdoor-kitchen → מטבח חוץ מאלומיניום ואבן — תכנון, גריל ומחירים (outdoor kitchen in aluminium and stone)
accordion-products → סגירת מרפסת — תריסי אקורדיון וקירות זכוכית (balcony enclosure — accordion shutters and glass walls)

Keep the H1s as the human-facing product names if the client prefers them, but the <title> must carry the query. Note the last one is not just a title change: rename the page's H1 and consider the slug `/service/balcony-enclosure/` on the next structural change, since "מוצרים אקורדיאוניים" has essentially no consumer search demand.

```
// lib/content.ts — add to ServiceMeta
interface ServiceMeta {
  tagline: string;
  description: string;
  /** SERP title, ≤60 chars, carries the head query (NOT the catalogue name). */
  seoTitle: string;
  /** SERP snippet — written for the click, distinct from on-page copy. */
  seoDescription: string;
  icon: IconName;
}

pergolas: {
  seoTitle: "פרגולות אלומיניום — ידניות וחשמליות, מחירים והתקנה",
  seoDescription:
    "פרגולת אלומיניום בהתאמה אישית — ידנית או חשמלית עם להבים מתכווננים. חיפוי פוליקרבונט, זכוכית או עץ. מדידה חינם, 1–3 ימי התקנה, אחריות מלאה. 050-5063152",
  // …
}

// app/service/[slug]/page.tsx:34-38
return {
  alternates: { canonical: `/service/${card.slug}/` },
  title: card.seoTitle,
  description: card.seoDescription,
};
```

## 6. The permit FAQ is misleading given Sky Shade's own product range
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** lib/content.ts:112 (pergolas FAQ) and :346 (homepage FAQ) both ship the answer "פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר". Verified in out/index.html and out/service/pergolas/index.html. But תיקון 101 conditions the exemption on the roof gaps being evenly distributed and constituting at least 40% of the מצללה ceiling — i.e. no more than 60% may be opaque. Sky Shade's pergolas page (lib/content.ts:97, 102) explicitly sells "חיפוי פוליקרבונט, זכוכית או גג עץ" and "פרגולה חשמלית עם להבים מתכווננים" — a solid or closed-louvre roof, which fails the 40% test. The FAQ also omits the post-construction "הודעה על ביצוע עבודה פטורה" filing (within 45 days) and the building-line constraint.

**Recommendation:** Rewrite both FAQ answers and build a dedicated guide. This is simultaneously a legal-exposure fix, an E-E-A-T win, and the single best link/traffic magnet available — "חוק הפרגולות" is a query multiple competitors (catomltd.co.il, pergola-o.co.il, opal-alum.co.il, architecture.org.il) rank for with dedicated pages.

Replacement for lib/content.ts:112:
"פרגולה (מצללה) עד 50 מ״ר או רבע משטח החצר/הגג — הגדול מביניהם — פטורה מהיתר, אבל רק אם המרווחים בתקרה מחולקים באופן שווה ומהווים לפחות 40% משטח הגג. כלומר: פרגולה עם גג פוליקרבונט מלא, זכוכית או להבי אלומיניום סגורים אינה עומדת בתנאי הפטור ודורשת היתר. גם בפטור יש להגיש לרשות המקומית 'הודעה על ביצוע עבודה פטורה' תוך 45 יום מסיום העבודה. אנחנו נאמר לכם מראש, בביקור המדידה, לאיזו קטגוריה הפרויקט שלכם נופל — ונלווה אתכם בהגשה."
(A pergola up to 50 sqm is exempt only if ≥40% of the ceiling is evenly-distributed open gaps; solid polycarbonate, glass or closed-louvre roofs do NOT qualify and require a permit; a post-completion notification is due within 45 days.)

Then remove the duplicate generic version at lib/content.ts:345–347 and link the homepage FAQ to the new guide instead — currently the same answer emits inside two separate FAQPage graphs.

**Risk:** The exact wording of the exemption and the 45-day filing should be confirmed against the current תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר) text and by the client's own planning contact before publishing — the site should not become the authority on a rule it got second-hand. Publishing a wrong permit rule is worse than publishing none.

## 7. Turn the 55 gallery photos into indexable project case studies
`high` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json images.gallery holds 55 items across four categories (גדרות ושערים 18, חיפוי קירות 15, פרגולות מחסות וגגות 13, דקים 9). All 55 render on exactly one URL — out/gallery/index.html, whose <main> contains just 65 visible words. lib/gallery.ts:36–38 already exposes a stable, resizer-backed key per photo (`skyshade/gallery/project-N.webp`). No per-project page exists anywhere in app/.

**Recommendation:** Add `app/projects/[slug]/page.tsx` plus a `projects` array in a new lib/projects.ts, generating 20–30 static pages at 350–500 words each. Each project reuses 2–4 existing catalog keys — zero new photography needed, only the facts behind photos the client already owns.

Per-project outline:
H1 {מה נבנה} ב{עיר} — {מ״ר}, {חומר/גימור}   e.g. "פרגולה חשמלית ברעננה — 28 מ״ר, אלומיניום בגימור דמוי עץ"
H2 האתגר (~80w — the constraint: west-facing balcony with no afternoon shade / a sloping garden / a body-corporate restriction)
H2 הפתרון (~120w — what was designed and why that choice)
H2 חומרים ומידות (~60w — spec list: profile, coating, roofing, dimensions)
H2 משך העבודה (~40w)
2–4 photos, each with a real descriptive alt
Inline links to the parent /service/[slug]/ and /locations/[city]/

This is the highest-leverage move on the site: it is the only content type that simultaneously (a) makes the city pages non-duplicate, (b) puts photos on service pages, (c) produces genuine long-tail entities ("פרגולה חשמלית רעננה"), and (d) supplies material for real, non-fabricated proof. Cross-link each project from its service page ("פרויקטים שביצענו") and its city page.

**Risk:** Requires the client to supply, per photo set: city, service, approximate size, materials/finish, duration and the problem solved. Do NOT invent these. Start with the 8–10 projects the client can recall in detail and expand; ten real case studies beat thirty invented ones, and invented project details would be exactly the fabricated-credential pattern Google's spam policies target.

## 8. Replace the formulaic alt text on all 55 photos
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** All 56 alt values in out/gallery/index.html follow one pattern: "פרויקט אלומיניום של סקיי שייד — {category} {n}" (e.g. "…— חיפוי קירות 12"). site.config.json shows 52 of the 55 `alt` fields are ENGLISH ("Sky Shade aluminium project - wall cladding 12") on a he-IL site, with only `altHe` in Hebrew. The numbering is also broken: project-53/54/55 carry altHe "…— פרגולות 4 / 3 / 2" while project-52 and project-43 carry "…— פרגולות, מחסות וגגות 52 / 43". On the homepage the mismatch is visible in shipped HTML: tiles labelled under the tab "פרגולות" carry alts reading "פרגולות, מחסות וגגות 52", "פרגולות 2", "פרגולות 3" side by side. Alt is generated at lib/gallery.ts:56–57 for the legacy path and read straight from the catalog otherwise.

**Recommendation:** Add `subject`, `city`, `materials` fields to each item in site.config.json `images.gallery` (and to the Media Studio sync that writes it, ops/sync-media.ps1), then compose alt from those. Alt should describe the photograph, not the brand — the brand name in 55 identical alts is keyword repetition with no user benefit and no accessibility value.

Current: פרויקט אלומיניום של סקיי שייד — חיפוי קירות 12
Target:  חיפוי חזית בית פרטי בלוחות קומפוזיט אפורים, עם גדר אלומיניום תואמת
         (private-house facade clad in grey composite panels, with a matching aluminium fence)
Target:  פרגולה חשמלית מעל פינת ישיבה במרפסת, להבי אלומיניום פתוחים
         (electric pergola over a balcony seating area, aluminium louvres open)

Rules: 8–16 Hebrew words, no "תמונה של", no brand name, no serial number, city only where it is genuinely identifiable. Fix the 52 English `alt` fields — on a he-IL site `alt` and `altHe` should both be Hebrew unless there is a separate English locale. Fix the project-53/54/55 numbering collision.

**Risk:** Alt text must describe what is actually in each photo, which means someone has to look at all 55. Do not batch-generate plausible descriptions — a wrong alt is worse than a generic one for accessibility.

## 9. Build the missing middle of the funnel — a Hebrew guides hub
`high` · impact `transformational` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** No blog, guides, or article route exists anywhere in app/ (confirmed by full directory listing: about, accessibility, contact, gallery, locations, privacy, service, services, terms). out/sitemap.xml lists 31 URLs, all of them transactional or legal. Meanwhile the SERP for "פרגולות אלומיניום מחיר למ״ר" is owned by dedicated pricing pages: pergolass.co.il/pergola-price, lidar.co.il, catomltd.co.il, pergolas4u.co.il — all publishing concrete ranges (₪550–₪1,500/m² manual, ₪1,600–₪3,000/m² electric). "חוק הפרגולות" is likewise owned by dedicated guide pages. Sky Shade has zero content that can rank for any informational query and therefore no way to reach a buyer before they are already shortlisting.

**Recommendation:** Create `app/guides/[slug]/page.tsx` + `app/guides/page.tsx` and publish 10 pieces at 1,200–2,000 words over two quarters. Prioritised by commercial value:

1. מחירון פרגולות אלומיניום 2026 — כמה עולה פרגולה למ״ר (aluminium pergola price list) — highest-value head term; publish real ranges with the drivers, REQUIRES-CLIENT-INPUT
2. חוק הפרגולות ותיקון 101 — מתי צריך היתר ומתי לא (the pergola law) — see the permit finding; the strongest link-earning asset
3. פרגולה חשמלית או פרגולה קבועה — מה מתאים לכם (electric vs fixed pergola)
4. פוליקרבונט, זכוכית או להבי אלומיניום — מדריך גגות לפרגולה (roofing comparison)
5. סגירת מרפסת — אפשרויות, מחירים והיתרים (balcony enclosure) — feeds the accordion-products page
6. דק WPC מול עץ טבעי — השוואה מלאה כולל עלות ותחזוקה (WPC vs natural wood)
7. אלומיניום, ברזל או PVC לגדר — מה עמיד באקלים הישראלי (fence material comparison)
8. חיפוי קירות חוץ: אלומיניום מול קומפוזיט ACP מול HPL (cladding comparison)
9. מטבח חוץ — תכנון, תשתיות מים וחשמל ותקציב (outdoor kitchen planning)
10. תחזוקת פרגולת אלומיניום — צ׳ק ליסט עונתי (seasonal maintenance checklist)

Each guide links down to its service page and out to 2–3 relevant project case studies. Items 3, 4, 6, 7, 8 are pure comparison content that the six service pages currently gesture at in one FAQ line each (e.g. lib/content.ts:161–163 on ACP vs HPL, :186–188 on WPC vs wood) — those two-sentence answers are the seeds; expand each into its own page and shorten the FAQ to a link.

**Risk:** Publishing ten guides quickly is only safe if each is genuinely written from the company's own installation experience. Ten thin AI-templated articles would be scaled-content abuse and would cost more than the zero pages cost today. Rate: one guide per two weeks, written or dictated by the person who does the measuring.

## 10. City pages, service pages and the homepage all fight over "פרגולות אלומיניום"
`high` · impact `high` · effort `M`

**Evidence:** The homepage H1 is "סקיי שייד — פרגולות ופתרונות אלומיניום פרימיום". All 16 city H1s are "פרגולות אלומיניום ב{עיר}" (app/locations/[city]/page.tsx:47), and their meta descriptions all open with the full six-service list "פרגולות, גדרות, שערים, דקים ומטבחי חוץ מאלומיניום" (line 23) — so each city page targets all six services plus the head term. The dedicated /service/pergolas/ page, meanwhile, does not use the string "פרגולות אלומיניום" in its title at all. Net: 18 URLs compete for one term while the page that should own it is under-optimised for it.

**Recommendation:** Assign one intent per template and enforce it in lib/content.ts and the two dynamic templates:

/service/pergolas/ owns the national head terms: פרגולות אלומיניום, פרגולה חשמלית, מחיר פרגולה
/locations/[city]/ owns geo-modified terms only: פרגולות אלומיניום ב{עיר}, סגירת מרפסת ב{עיר}, גדרות ושערים ב{עיר} — and must earn them with city-specific substance, not with the head term repeated
/ owns the brand term סקיי שייד and the category-navigational intent
/services/ owns broad category terms: חברת אלומיניום, פתרונות אלומיניום לחוץ
/guides/* own the informational terms (מחירון, חוק הפרגולות, השוואות)

Concretely: stop listing all six services in every city meta description; make each city description lead with the one service that city actually generates. And add contextual links from each city page to the specific service pages using geo-modified anchor text ("סגירת מרפסת בתל אביב"), which the current template does not do — its service list uses bare service names as anchors (lines 74–84).

## 11. Rewrite the templated meta descriptions — 16 differ only by the city name
`medium` · impact `medium` · effort `S`

**Evidence:** Every city description from out/ is the same 141–147-character string with one substitution, e.g. `סקיי שייד — פרגולות, גדרות, שערים, דקים ומטבחי חוץ מאלומיניום בתל אביב. עיצוב בהתאמה אישית, חומרים מהמשובחים בשוק ואחריות מלאה. שירות בכל הארץ.` (app/locations/[city]/page.tsx:23). The homepage description is 163 characters (out/index.html) — past the ~155-char snippet budget, so "…שירות בכל הארץ מאז 2009" gets cut. All six service descriptions are `card.description` reused verbatim as the first paragraph of the page body. None of the 36 descriptions contains a phone number, a differentiator, or a reason to click rather than click the competitor above.

**Recommendation:** Write descriptions for the click, at 120–150 characters, each carrying one concrete hook. Examples:

Homepage (replace manifest.shortPitch, currently 163 ch):
"פרגולות אלומיניום ידניות וחשמליות, גדרות, שערים, דקים ומטבחי חוץ — בהתאמה אישית, מאז 2009. מדידה והצעת מחיר חינם. חייגו 050-5063152." (129 ch)

/locations/tel-aviv/:
"פרגולות אלומיניום וסגירת מרפסות בתל אביב — עמידות ברוח ים ובלחות, ועם ליווי מלא מול ועדת התכנון העירונית. מדידה חינם: 050-5063152." (128 ch)

/locations/beer-sheva/:
"פרגולות אלומיניום והצללה בבאר שבע — מתוכננות לחום, לקרינה ולאבק המדברי. אלומיניום שלא מחליד, אחריות מלאה. מדידה חינם: 050-5063152." (127 ch)

/service/decks/:
"דק WPC או דק עץ טבעי למרפסת, לחצר ולסביבת הבריכה — משטח מונע החלקה, בהתאמה אישית למידות. השוואת חומרים ומחירים בשיחה אחת. 050-5063152." (131 ch)

Every city description must reflect content that actually appears on the page — otherwise it is a snippet promise the page does not keep, and the click bounces.

## 12. Remove or substantiate the "מספר 1 בישראל" claim and the unverified trust stats
`high` · impact `medium` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** components/marketing/Hero.tsx renders the badge "מספר 1 בישראל · מאז 2009" — verified present in shipped out/index.html. lib/content.ts:284–289 ships "500+ פרויקטים", "200+ לקוחות מרוצים", "15+ שנות ניסיון", "100% אחריות מלאה" on the homepage, /about and every service page via <TrustBar/>; the file header at lib/content.ts:6 explicitly marks these "🔶 = assumption; confirm with client (esp. stats and testimonials)". The three testimonials at lib/content.ts:305–324 carry the note "Full wording lightly completed from the live excerpts; confirm before launch." Two internal inconsistencies are visible to any reader: 500 projects from 200 customers implies 2.5 projects per household, and "15+ שנות ניסיון" contradicts "מאז 2009" (17 years as of 2026) — a hardcoded number that has already gone stale.

**Recommendation:** Three separate actions:
(1) Delete the "מספר 1 בישראל" badge in components/marketing/Hero.tsx unless the client holds a citable ranking. An unsubstantiated superiority claim is a misleading-advertising exposure under Israeli consumer-protection law and a quality-rater red flag. Replace with something verifiable: "פועלים בכל הארץ מאז 2009" or the actual project count once confirmed.
(2) Get the real numbers from the client and reconcile them. Derive the years figure rather than hardcoding it: `${new Date().getFullYear() - siteConfig.founded}+ שנות ניסיון` computed at build time, or simply "מאז 2009" which never goes stale.
(3) Confirm the three testimonials are verbatim from real customers who consented to attribution. If the wording was "lightly completed", either restore the original excerpt or drop the quote. Do not add Review/AggregateRating schema to these until (3) is settled — self-serving review markup for reviews not genuinely collected is an explicit spam-policy violation.

## 13. Heading outlines are shallow — several pages have only the sitewide CTA as an h2
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** Extracted from built HTML: /locations/[city] = h1 + "השירותים שלנו ב{עיר}" + "רוצים לשדרג את החוץ שלכם? בואו נתחיל." (the shared FinalCta). /locations = h1 + FinalCta only. /gallery = h1 + FinalCta only — 65 words and one heading. /about = h1 + "הערכים שלנו" + FinalCta. /services = h1 + the homepage's h2 + FinalCta. Service pages fare better (h1 + 4 h2 + 3–4 h3) but the h2s awkwardly inline the full catalogue name: "למה לבחור בנו לפרגולות, מחסות וגגות?" (app/service/[slug]/page.tsx:89) and "שאלות נפוצות על פרגולות, מחסות וגגות" (line 147).

**Recommendation:** Wire headings to the content models in the other findings. Immediate low-cost fixes:
(a) app/service/[slug]/page.tsx:89 — the h2 should read naturally, not concatenate. Add a short `shortName` to lib/content.ts (pergolas → "פרגולות", accordion-products → "סגירת מרפסת") and use `למה לבחור בסקיי שייד ל{shortName}?` and `שאלות נפוצות על {shortName}`.
(b) /gallery — add h2s per category so the four tabs become an outline: "פרגולות, מחסות וגגות (13 פרויקטים)", "גדרות ושערים (18)", "חיפוי קירות (15)", "דקים (9)", each with a 40–60 word intro. That alone takes the page from 65 to ~300 words and makes the filter states meaningful to a crawler that never clicks a tab.
(c) /about — add h2s the page badly needs: "איך התחלנו" (REQUIRES-CLIENT-INPUT), "הצוות שלנו", "איפה אנחנו עובדים", "האחריות שלנו — מה היא כוללת בפועל". 158 words is not an About page for a 17-year-old business.
(d) The FinalCta h2 appears on 34 of 36 pages with identical text; it is fine as a CTA but should not be the only h2 on a page.

## 14. /service/accordion-products/ receives zero internal links from sibling service pages
`medium` · impact `medium` · effort `S`

**Evidence:** app/service/[slug]/page.tsx:48 — `const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);`. Because accordion-products is last in the `services` array (lib/site-config.ts:65), it never falls inside the first four of any filtered list. Measured across the six built pages: pergolas 5 inbound sibling links, fences-gates 5, wall-cladding 5, decks 5, outdoor-kitchen 4, accordion-products 0. Separately, components/layout/Footer.tsx uses `locations.slice(0, 12)`, so הרצליה, כפר סבא, רעננה and מודיעין get no footer link — verified absent from out/index.html's <footer>.

**Recommendation:** Drop both slices. In app/service/[slug]/page.tsx:48 use the full list (`filter(...)` with no `.slice`) and let the existing `lg:grid-cols-4` wrap to a second row — five cards read fine. In components/layout/Footer.tsx, render all 16 locations or, better, cut the location list down to whatever survives the city-page decision. This matters more than it looks: accordion-products is also the thinnest service page (180 unique words) and, per the title finding, targets the highest-volume consumer query on the site ("סגירת מרפסת") — it is simultaneously the least-linked and the most commercially promising page.

```
// app/service/[slug]/page.tsx:48
-const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);
+const others = serviceCards.filter((c) => c.slug !== card.slug);

// components/layout/Footer.tsx
-{locations.slice(0, 12).map((c) => (
+{locations.map((c) => (
```

## 15. Two of six services have no photos and the thinnest copy on the site
`medium` · impact `medium` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json images.gallery categories cover only four of six services — גדרות ושערים 18, חיפוי קירות 15, פרגולות מחסות וגגות 13, דקים 9, total 55. There are zero photos categorised for מטבח חוץ or מוצרים אקורדיאוניים. Those same two pages have the least unique copy of the six (outdoor-kitchen 182 unique words, accordion-products 180, versus pergolas 226). Neither page renders any image at all (`imgs-in-main=0` on out/service/outdoor-kitchen/index.html).

**Recommendation:** Commission or locate photos for these two lines and add two categories to the media catalog ("מטבח חוץ", "סגירת מרפסת"), then surface them on their service pages and in the /gallery tabs. A page selling a ₪20,000+ outdoor kitchen with 182 words and no photograph converts at close to zero, whatever it ranks for. If no photos exist because the company has done few of these jobs, that is the more important finding: consider whether these two belong as full service pages at all, or whether they should be sections inside /service/pergolas/ and a renamed balcony-enclosure page until there is proof to show.

## 16. Nothing on the site can go stale-detectable — no dates, and 31 identical sitemap lastmods
`medium` · impact `medium` · effort `M`

**Evidence:** out/sitemap.xml carries 31 URLs and exactly 1 distinct <lastmod> value: `2026-08-16T17:43:41.310Z` — the build timestamp, applied to every page including /privacy and /terms. components/layout/Footer.tsx hardcodes `const year = 2026; // static export — keep build deterministic; update yearly.` No page anywhere carries a published or updated date, and there is no content type whose freshness is meaningful.

**Recommendation:** Three changes:
(1) Stop broadcasting a false lastmod. In app/sitemap.ts, derive per-URL lastmod from real content-change dates — a `lastUpdated` field on each service/location/guide record in lib/content.ts, falling back to the build time only for pages that genuinely have none. A sitemap that claims all 31 pages changed on every deploy trains Google to discard the signal entirely, which then costs you the recrawl you want when a guide is actually revised.
(2) Once /guides/ exists, put a visible `עודכן לאחרונה: {תאריך}` on each guide and a matching `dateModified` in Article schema. Pricing and permit content is the kind buyers check the date on before trusting.
(3) Replace the hardcoded footer year with a build-time expression so the deterministic-build goal is met without a yearly manual edit.

Cadence to hold: the pricing guide and the permit guide reviewed every 6 months (regulations and prices both move); one new project case study per month from jobs the company completes anyway; one new guide every two weeks until the ten are published, then quarterly.

```
// components/layout/Footer.tsx — deterministic per build, no yearly edit
const year = new Date().getFullYear();

// app/sitemap.ts — per-URL lastmod
url: `${base}/service/${s.slug}/`,
lastModified: serviceDetails[s.slug].lastUpdated ?? BUILD_TIME,
```

## 17. The permit FAQ is duplicated between the homepage and /service/pergolas
`low` · impact `low` · effort `S`

**Evidence:** lib/content.ts:345–347 (homepage `faqs`) and lib/content.ts:111–113 (pergolas `serviceDetails.faqs`) carry near-identical Q&A, both opening "פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר". Both strings verified present in out/index.html and out/service/pergolas/index.html, and both are rendered as visible h3+body AND serialised into a FAQPage graph (per the ground-truth count of 7 FAQPage instances).

**Recommendation:** Keep exactly one canonical answer per question. Give /service/pergolas/ the full, corrected permit answer (see the permit finding) and reduce the homepage FAQ item to a one-line summary plus a link to the guide. More broadly: the homepage's six general FAQs (lib/content.ts:327–352) overlap with per-service FAQs on materials and warranty too — audit the 6 + 20 questions as one set, dedupe, and route each question to the single page where it belongs. This also thins out the seven overlapping FAQPage graphs, which is worth doing regardless of whether FAQ rich results are still granted to commercial sites.


# Navigation, internal linking and site structure

**Current state:** Crawl depth is genuinely good and should not be "fixed": a BFS over the 33 shipped HTML files in out/ reaches all 31 canonical URLs at depth 1 from the homepage, with zero broken internal links, correct trailing-slash hrefs everywhere (`href="/service/pergolas/"`), and a sitemap.xml carrying exactly those 31 URLs. What is broken is link *distribution* and *contextual* linking. Measured sitewide inbound link counts: /locations/ 116, /gallery/ 100, /about/ 99, /contact/ 99, /services/ 72, service pages 51–56, twelve city pages 35 each — and herzliya, kfar-saba, raanana, modiin at **2 each**, because Footer.tsx:64 renders `locations.slice(0, 12)`. Utility pages (/about/, /contact/) therefore outrank every money page on internal links, and /gallery/ — a page whose body contains zero outbound links at all — is the second most-linked URL on the site. Almost all linking is boilerplate: header nav (rendered twice, desktop + mobile), footer, and templated card grids. There is not one contextual in-body link anywhere: no service links to another service from prose, no service links to a city or to the gallery, no city links to another city or to the gallery, and the gallery links to nothing. Breadcrumbs render on 9 templates that emit no BreadcrumbList schema (only /service/[slug] and /locations/[city] emit it, and those two are correct and match the visible crumbs exactly). FilterableGallery's four category filters are `<button role="tab">` with client-side state and no URLs, so four high-intent collections (9/15/18/13 photos) have no address. There is no HTML sitemap for users, no project pages, and no service×city surface.


## 1. Give the gallery's four categories real URLs and turn the gallery into a linking hub
`high` · impact `transformational` · effort `L`

**Evidence:** out/gallery/index.html ships all 55 tiles in the default tab (56 <img> incl. logo) but its body contains ZERO outbound links — measured hrefs are only chrome: /service/* ×1 each (footer), /locations/* ×1 each (footer), /gallery/ ×3 (nav×2 + footer). The four filters are `role="tab"` <button>s in components/marketing/FilterableGallery.tsx:56-77 with `useState` only — no URL changes, so the filtered views are unaddressable and unindexable under output:"export". site.config.json images.gallery.categories = ["דקים","חיפוי קירות","גדרות ושערים","פרגולות, מחסות וגגות"] with 9/15/18/13 items — these map 1:1 onto four of the six service slugs. /gallery/ receives 100 sitewide inbound links (2nd highest on the site) and passes none of it onward.

**Recommendation:** Add `app/gallery/[category]/page.tsx` generating four static routes — /gallery/pergolas/, /gallery/fences-gates/, /gallery/wall-cladding/, /gallery/decks/ — each with PageHeader crumbs [בית, גלריה, <category>], a breadcrumbJsonLd, a short unique intro paragraph, the filtered grid, and one prominent contextual link to the matching /service/<slug>/. Add a `galleryCategoryMap` + `itemsInCategory()` helper to lib/gallery.ts. On /gallery/ itself, replace the single flat grid with four <h2> sections (one per category), each ending in a 'לכל התמונות' link to its category URL and a 'למידע על השירות' link to its service page. Add the four new URLs to `staticPaths` in app/sitemap.ts. Google's faceted-navigation guidance says index a facet only when it maps to real demand, offers unique content, and returns a non-empty set — these four qualify; do NOT generate parameter combinations or an ?cat= surface. Note a taxonomy inconsistency to resolve first: the homepage preview uses two different labels ("פרגולות" / "חיפויים", lib/content.ts:422) that do not match the catalog's four canonical categories. Also note מטבח חוץ and מוצרים אקורדיאוניים have zero photos in the catalog, so no category page exists for them.

```
// lib/gallery.ts — add
export const galleryCategoryMap = [
  { slug: "pergolas",      category: "פרגולות, מחסות וגגות", title: "גלריית פרגולות אלומיניום" },
  { slug: "fences-gates",  category: "גדרות ושערים",          title: "גלריית גדרות ושערי אלומיניום" },
  { slug: "wall-cladding", category: "חיפוי קירות",           title: "גלריית חיפוי קירות" },
  { slug: "decks",         category: "דקים",                  title: "גלריית דקים — WPC ועץ טבעי" },
] as const;
export const itemsInCategory = (category: string) =>
  galleryItems.filter((i) => i.category === category);

// app/gallery/[category]/page.tsx
export function generateStaticParams() {
  return galleryCategoryMap.map((c) => ({ category: c.slug }));
}
// …inside the page, under the grid:
<p className="mt-10 text-center">
  <Link href={`/service/${entry.slug}/`} className="font-semibold text-secondary hover:underline">
    כל מה שצריך לדעת על {serviceName} — מחירים, חומרים ולוחות זמנים ←
  </Link>
</p>
```

## 2. Add contextual in-body links between services — the copy already cross-references them in plain text
`high` · impact `high` · effort `M`

**Evidence:** lib/content.ts:182 (decks) reads "שילוב מושלם עם פרגולה ומטבח חוץ" and lib/content.ts:207 (outdoor-kitchen) reads "מרחב אירוח שלם — משתלב עם דק ופרגולה" — both are plain strings rendered as <li> text in app/service/[slug]/page.tsx:92-97, with no anchor. Measured: out/service/pergolas/index.html contains exactly 2 links to each sibling service (one templated 'שירותים נוספים' card + one footer link) and none from prose. The `FaqPair` type (lib/content.ts:79-82) declares `a: string`, so FAQ answers structurally cannot carry a link even though several answers cross-reference other products.

**Recommendation:** Two changes in lib/content.ts. (1) Add `related: ServiceSlug[]` to `ServiceDetail` and render a short prose sentence above the benefits list, e.g. on /service/decks/: 'רוב הלקוחות שמזמינים דק מוסיפים גם <a href="/service/pergolas/">פרגולת אלומיניום</a> מעליו ו<a href="/service/outdoor-kitchen/">מטבח חוץ</a> בצד — כך המרחב שלם ומוצל לאורך כל היום.' (2) Widen `FaqPair.a` to `string | React.ReactNode` (or add an optional `aLinks?: {text:string; href:string}[]`) so answers can link — e.g. the pergolas answer about היתר בנייה should link to /service/accordion-products/ where סגירת מרפסת is discussed. Write these as editorial sentences per service, not a repeated boilerplate block; 2-3 contextual links per service page is the right density.

```
// lib/content.ts
interface ServiceDetail {
  about: string;
  benefits: string[];
  faqs: FaqPair[];
  /** Prose cross-sell sentence; slugs must exist in `services`. */
  pairsWith?: { intro: string; links: { slug: ServiceSlug; anchor: string }[] };
}

decks: {
  // …
  pairsWith: {
    intro: "דק לבד הוא רק ההתחלה — רוב הפרויקטים שלנו משלבים",
    links: [
      { slug: "pergolas",        anchor: "פרגולת אלומיניום מעל הדק" },
      { slug: "outdoor-kitchen", anchor: "מטבח חוץ בצד החצר" },
    ],
  },
}
```

## 3. Emit BreadcrumbList schema on the nine templates that already render visible breadcrumbs
`high` · impact `high` · effort `S`

**Evidence:** Grep across out/ for 'BreadcrumbList' vs the visible crumb nav (aria-label="פירורי לחם", components/layout/PageHeader.tsx:23): services/index.html, gallery/index.html, about/index.html, contact/index.html, locations/index.html, privacy/index.html, terms/index.html, accessibility/index.html all render the visible breadcrumb but emit BreadcrumbList=0. Only service/[slug] and locations/[city] emit it (22 pages total, matching the orchestrator's count). The two that do emit it are correct — out/service/pergolas/index.html carries positions 1-3 with items https://skyshade.co.il/ , /services/ , /service/pergolas/ , exactly matching the rendered crumbs including the trailing slash.

**Recommendation:** Add `breadcrumbJsonLd(manifest, …)` + `jsonLdScript` to app/services/page.tsx, app/locations/page.tsx, app/gallery/page.tsx, app/about/page.tsx, app/contact/page.tsx, app/privacy/page.tsx, app/terms/page.tsx, app/accessibility/page.tsx (and the new gallery category pages). Better: stop hand-wiring it — extend `PageHeader` to accept the crumbs and emit the JSON-LD itself from the same array, so the visible trail and the schema can never drift. Keep the homepage without a BreadcrumbList (correct — it is the root). The paths passed to breadcrumbJsonLd must keep trailing slashes to match the canonicals.

```
// components/layout/PageHeader.tsx — single source for crumbs + schema
import { breadcrumbJsonLd, jsonLdScript } from "@ishub/site-kit/seo";
import { manifest } from "@/lib/site-config";

export interface Crumb { label: string; href?: string }

export function PageHeader({ title, subtitle, crumbs }: {…}) {
  const jsonLd =
    crumbs && crumbs.length > 1
      ? breadcrumbJsonLd(
          manifest,
          crumbs.map((c, i) => ({
            name: c.label,
            // last crumb has no href; derive its own path from the caller
            path: c.href ?? crumbs[i].href ?? "/",
          })),
        )
      : null;
  return (
    <div className="bg-primary text-white">
      {jsonLd && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      )}
      {/* …existing markup… */}
```

**Risk:** The last crumb currently has no `href`, so PageHeader needs a `selfPath` prop (or the caller must supply href on the final crumb and PageHeader must render it as text). Do not let the schema emit a wrong/missing `item` URL for the final position.

## 4. Stop dropping four cities from the footer — they have 2 internal links each vs 35 for the rest
`high` · impact `high` · effort `S`

**Evidence:** components/layout/Footer.tsx:64 — `{locations.slice(0, 12).map(...)}`. Measured sitewide inbound links across all 33 built HTML files: /locations/tel-aviv/ … /locations/rehovot/ = 35 each; /locations/herzliya/, /locations/kfar-saba/, /locations/raanana/, /locations/modiin/ = **2 each** (homepage ServiceAreas + the /locations/ index only). Confirmed in out/service/pergolas/index.html, whose href list contains twelve /locations/<city>/ entries and none of those four.

**Recommendation:** Delete the `.slice(0, 12)` in components/layout/Footer.tsx:64 and render all 16 `locations`. The column is already `grid-cols-2`; 16 rows is 8 per column and costs no layout change. This alone lifts each of the four pages from 2 to 35 sitewide inbound links and equalises the location tier. If the client later adds cities 17+, switch the footer to the top 12 by lead volume plus a 'לכל אזורי השירות' link rather than an arbitrary array prefix — but at 16 cities the whole set fits.

```
{/* components/layout/Footer.tsx — was locations.slice(0, 12) */}
<ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
  {locations.map((c) => (
    <li key={c.slug}>
      <Link href={`/locations/${c.slug}`} className="text-white/70 hover:text-white">
        {c.name}
      </Link>
    </li>
  ))}
</ul>
```

## 5. Expose the six service pages in the primary nav — utility pages currently outrank every money page
`high` · impact `high` · effort `M`

**Evidence:** lib/content.ts:355-361 `navItems` contains five entries, none of which is a service page. components/layout/Header.tsx renders that same list twice (desktop nav :46-59 and the always-in-DOM mobile panel :80-96), so every nav item gets 2 sitewide links while service pages get 1 (footer). Measured result: /about/ 99 and /contact/ 99 sitewide inbound links vs /service/pergolas/ 56 and /service/accordion-products/ 51. Also: the footer 'קישורים' column (Footer.tsx:75-114) links /about/, /gallery/, /locations/, /contact/ and three legal pages but **does not link /services/ at all** — /services/ gets 72 links, all from the nav (66) plus 6 service-page breadcrumbs.

**Recommendation:** Give `navItems` an optional `children` array and render a services dropdown on desktop (CSS group-hover or a small client disclosure) plus a nested, always-rendered <ul> inside the mobile panel. Keep the child <li>s in the DOM at all times (CSS-hidden, not conditionally rendered) so the static HTML carries them — that is what makes them count. This adds 12 sitewide links per service page (2 per page × 6), moving each service to ~68 and past /about/. Also add /services/ to the footer 'קישורים' column as 'השירותים שלנו', and move מדיניות פרטיות / הצהרת נגישות / תקנון out of that column into the bottom bar next to the copyright — they currently take 33 sitewide links each, the same count as a money page, for zero ranking value.

```
// lib/content.ts
import { services } from "@/lib/site-config";
export const navItems = [
  {
    label: "השירותים שלנו",
    href: "/services",
    children: services.map((s) => ({ label: s.name, href: `/service/${s.slug}` })),
  },
  { label: "אזורי שירות", href: "/locations" },
  { label: "גלריה", href: "/gallery" },
  { label: "אודות", href: "/about" },
  { label: "צור קשר", href: "/contact" },
] as const;

// components/layout/Header.tsx — desktop item (RTL-safe: use start/end, not left/right)
<li className="group relative">
  <Link href={item.href} className="…">{item.label}</Link>
  {"children" in item && (
    <ul className="invisible absolute top-full start-0 z-50 min-w-56 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      {item.children.map((c) => (
        <li key={c.href}>
          <Link href={c.href} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">{c.label}</Link>
        </li>
      ))}
    </ul>
  )}
</li>
```

**Risk:** Hover-only dropdowns are unusable on touch and by keyboard. `group-focus-within` (above) covers keyboard; on touch the parent 'השירותים שלנו' must remain a real link to /services/ so a tap never traps the user. Do not put all 16 cities in the nav — that is 32 more sitewide links of pure boilerplate; cities belong in the footer.

## 6. City pages are structural dead-ends: no link to another city, to the gallery, or to anything but six service cards
`high` · impact `high` · effort `M`

**Evidence:** app/locations/[city]/page.tsx renders exactly one link block — the six service cards at :73-85. Measured on out/locations/tel-aviv/index.html: body links are the breadcrumb 'בית' plus six /service/* cards; every /locations/<other-city>/ link on the page comes from the footer, and /gallery/ appears only 3× (nav×2 + footer). Heading outline is h1 + 'השירותים שלנו בתל אביב' + the FinalCta h2 — two h2s, one of which is sitewide boilerplate.

**Recommendation:** Add two modules to app/locations/[city]/page.tsx. (1) 'אזורי שירות נוספים' — 4 sibling cities from a hand-built region table in lib/site-config.ts, plus a link to /locations/. (2) A gallery cross-link: 'פרויקטים שביצענו' with three tiles linking to /gallery/pergolas/ etc. Separately, note the h1/body mismatch: the h1 is `פרגולות אלומיניום ב{city}` (page.tsx:47) but the body sells all six services — that mismatch is why service-qualified anchors into city pages are currently unsafe (see the anchor-text finding). Either broaden the h1 to 'פרגולות ופתרונות אלומיניום ב{city}' or build the service×city tier.

```
// lib/site-config.ts — service-region grouping, not literal adjacency
export const nearbyCities: Record<LocationSlug, LocationSlug[]> = {
  "tel-aviv":      ["ramat-gan", "bnei-brak", "holon", "herzliya"],
  "ramat-gan":     ["tel-aviv", "bnei-brak", "petah-tikva", "holon"],
  "bnei-brak":     ["ramat-gan", "petah-tikva", "tel-aviv", "holon"],
  "holon":         ["tel-aviv", "rishon-lezion", "ramat-gan", "bnei-brak"],
  "rishon-lezion": ["holon", "rehovot", "ashdod", "tel-aviv"],
  "rehovot":       ["rishon-lezion", "modiin", "ashdod", "holon"],
  "petah-tikva":   ["bnei-brak", "ramat-gan", "kfar-saba", "modiin"],
  "kfar-saba":     ["raanana", "herzliya", "petah-tikva", "netanya"],
  "raanana":       ["kfar-saba", "herzliya", "netanya", "petah-tikva"],
  "herzliya":      ["raanana", "kfar-saba", "tel-aviv", "netanya"],
  "netanya":       ["herzliya", "raanana", "kfar-saba", "haifa"],
  "haifa":         ["netanya", "herzliya", "tel-aviv", "raanana"],
  "jerusalem":     ["modiin", "beer-sheva", "rehovot", "tel-aviv"],
  "modiin":        ["jerusalem", "rehovot", "petah-tikva", "rishon-lezion"],
  "ashdod":        ["rishon-lezion", "rehovot", "beer-sheva", "holon"],
  "beer-sheva":    ["ashdod", "rehovot", "jerusalem", "rishon-lezion"],
};

// app/locations/[city]/page.tsx — after the services list
<h2 className="mt-12 font-heading text-xl font-bold text-primary">אזורי שירות נוספים באזור</h2>
<ul className="mt-4 flex flex-wrap gap-2.5">
  {nearbyCities[city.slug].map((s) => {
    const n = locations.find((l) => l.slug === s)!;
    return (
      <li key={s}>
        <Link href={`/locations/${s}/`} className="inline-flex rounded-full border border-gray-200 px-4 py-2 text-sm hover:border-secondary hover:text-secondary">
          פתרונות אלומיניום ב{n.name}
        </Link>
      </li>
    );
  })}
  <li><Link href="/locations/" className="…">לכל אזורי השירות ←</Link></li>
</ul>
```

**Risk:** The `nearbyCities` table above is a service-region grouping, not literal geographic adjacency (e.g. חיפה↔תל אביב). Label the module 'אזורי שירות נוספים באזור' rather than 'ערים סמוכות' so the copy stays truthful, and have the client sanity-check the groupings against how they actually route crews.

## 7. Link every service page out to the location tier and to its gallery category
`high` · impact `high` · effort `M`

**Evidence:** app/service/[slug]/page.tsx contains exactly two link blocks: 'שירותים נוספים' (:153-168) and nothing else. Measured on out/service/pergolas/index.html: every /locations/<city>/ href on the page (12 of them) is footer chrome, and /gallery/ appears 3× (nav×2 + footer) with zero body links. The 16 city pages send 16 links up to each service, but no service sends a single contextual link back down.

**Recommendation:** Add a 'היכן אנחנו מתקינים' block to app/service/[slug]/page.tsx listing 8 cities plus a link to /locations/, and — once the gallery category routes exist — a 'ראו פרויקטים' link to the matching /gallery/<slug>/. Until the city h1 is broadened or service×city pages exist, keep the anchor service-neutral ('פתרונות אלומיניום בתל אביב'), because /locations/tel-aviv/ currently carries an h1 about פרגולות specifically and a 'דקים בתל אביב' anchor would point at a page that does not deliver that promise.

```
// app/service/[slug]/page.tsx — after the 'שירותים נוספים' block
<div className="mt-12 border-t border-gray-100 pt-10">
  <h2 className="font-heading text-xl font-bold text-primary">
    {card.name} — היכן אנחנו מתקינים
  </h2>
  <ul className="mt-5 flex flex-wrap gap-2.5">
    {locations.slice(0, 8).map((c) => (
      <li key={c.slug}>
        <Link href={`/locations/${c.slug}/`} className="inline-flex rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-secondary hover:text-secondary">
          פתרונות אלומיניום ב{c.name}
        </Link>
      </li>
    ))}
    <li><Link href="/locations/" className="inline-flex px-4 py-2 text-sm font-semibold text-secondary hover:underline">לכל 16 אזורי השירות ←</Link></li>
  </ul>
  {galleryCategoryFor(card.slug) && (
    <p className="mt-6">
      <Link href={`/gallery/${card.slug}/`} className="font-semibold text-secondary hover:underline">
        לגלריית {card.name} — תמונות מפרויקטים שביצענו ←
      </Link>
    </p>
  )}
</div>
```

## 8. Fix the off-by-one that hides one sibling service from every service page
`medium` · impact `medium` · effort `S`

**Evidence:** app/service/[slug]/page.tsx:48 — `const others = serviceCards.filter((c) => c.slug !== card.slug).slice(0, 4);`. There are five siblings, so the last one in `services` order is always dropped. Measured consequence: /service/accordion-products/ has 51 sitewide inbound links (33 footer + 2 grids + 0 related + 16 city pages) while /service/pergolas/ has 56 (33 + 2 + 5 + 16), and /service/outdoor-kitchen/ has 55. The 'שירותים נוספים' grid on out/service/pergolas/index.html lists wall-cladding, outdoor-kitchen, fences-gates, decks — accordion-products is absent.

**Recommendation:** Remove the `.slice(0, 4)` so all five siblings render, and change the grid at :155 from `lg:grid-cols-4` to `sm:grid-cols-2 lg:grid-cols-3` so five cards wrap cleanly instead of leaving a 4+1 orphan row. This is a two-token change that adds one sitewide link to the weakest service page and removes an arbitrary, invisible ranking decision from the template.

```
// app/service/[slug]/page.tsx:48
const others = serviceCards.filter((c) => c.slug !== card.slug);
// :155
<ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
```

## 9. Qualify the anchor text on city links and stop wrapping whole service cards in one anchor
`medium` · impact `medium` · effort `M`

**Evidence:** Extracted anchor text from out/index.html: all 35 sitewide links to /locations/tel-aviv/ read exactly 'תל אביב' — a bare toponym with no topical qualifier — while the destination's h1 is 'פרגולות אלומיניום בתל אביב'. Conversely, components/marketing/ServicesGrid.tsx:31-49 wraps the entire card (h3 + tagline + 40-word description + 'למידע נוסף') in a single <Link>, so the measured anchor text for /service/pergolas/ from the homepage is 110+ characters of mixed copy: 'פרגולות, מחסות וגגות פרגולות ידניות וחשמליות פרגולות אלומיניום מעוצבות בהתאמה אישית, עם אפשרות חיפוי פוליקרבונ…'.

**Recommendation:** (1) Leave the footer city anchors as plain city names — 33 identical exact-match anchors would be over-optimisation. Instead vary the qualified anchors only in the new contextual modules and on the /locations/ hub: on app/locations/page.tsx add a second line inside each card, e.g. `<span className="block text-xs text-gray-500">פרגולות, גדרות ודקים ב{c.name}</span>`, which puts the keyword in the anchor without repeating one string 33 times. Rotate phrasings across modules: 'פרגולות אלומיניום בתל אביב', 'פתרונות אלומיניום בהרצליה', 'סקיי שייד בכפר סבא'. (2) In ServicesGrid, restrict the <Link> to the h3 and make the card clickable with a stretched-link pseudo-element, so the anchor text becomes the clean service name while the whole card stays tappable.

```
{/* components/marketing/ServicesGrid.tsx — stretched-link pattern */}
<Reveal key={card.slug} delay={(i % 3) * 0.05}>
  <article className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <span className="inline-flex h-12 w-12 …"><Icon className="h-6 w-6" aria-hidden /></span>
    <h3 className="mt-4 font-heading text-lg font-bold text-primary">
      <Link href={`/service/${card.slug}`} className="after:absolute after:inset-0">
        {card.name}
      </Link>
    </h3>
    <p className="mt-0.5 text-xs font-medium text-accent-600">{card.tagline}</p>
    <p className="mt-2 flex-1 text-sm text-gray-600">{card.description}</p>
    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:gap-2" aria-hidden>
      למידע נוסף <ChevronLeft className="h-4 w-4" />
    </span>
  </article>
</Reveal>
```

## 10. Make /services/ a real hub instead of a verbatim copy of a homepage section
`medium` · impact `medium` · effort `M`

**Evidence:** app/services/page.tsx renders PageHeader + `<ServicesGrid />` + `<FinalCta />` and nothing else — the exact same `ServicesGrid` component the homepage renders at app/page.tsx:45. The built heading outline of out/services/index.html is h1 'השירותים שלנו', h2 'פתרונות אלומיניום לכל מרחב חוץ' (the grid's own heading, identical to the homepage's), six h3s, then the boilerplate FinalCta h2. It emits no BreadcrumbList and no unique paragraph. It carries 72 sitewide inbound links and forwards six.

**Recommendation:** Add to app/services/page.tsx: (a) a unique 250-350 word intro that frames the six services as one system (הצללה, גידור, חיפוי, ריצוף חוץ, אירוח, סגירה עונתית) and links each keyword to its service page in prose; (b) a comparison block — 'איזה פתרון מתאים לכם?' — with rows like 'רוצים צל אבל גם שמש בחורף → <a href="/service/pergolas/">פרגולה חשמלית</a>' and 'רוצים להשתמש במרפסת גם בגשם → <a href="/service/accordion-products/">מוצרים אקורדיאוניים</a>'; (c) links to the four gallery category pages; (d) the BreadcrumbList from the schema finding. Give ServicesGrid an optional `heading` prop so the hub can carry a different h2 from the homepage's.

## 11. Ship an HTML sitemap page for users and turn the 404 into a navigation surface
`medium` · impact `medium` · effort `M`

**Evidence:** out/ contains sitemap.xml (31 URLs) but no human-readable index; `staticPaths` in app/sitemap.ts:19-29 lists nine paths and there is no /site-map/ route. app/not-found.tsx:9-14 offers a single link — 'חזרה לדף הבית' — although the built out/404.html does inherit the header nav and footer (measured: 6 /service/* links present, header nav present).

**Recommendation:** Add `app/site-map/page.tsx` titled 'מפת אתר' listing all 31+ URLs grouped as השירותים שלנו (6) / גלריית פרויקטים (4 category pages) / אזורי שירות (16) / החברה (אודות, גלריה, צור קשר) / מידע משפטי (3), each with descriptive Hebrew anchors. Add "site-map" to `staticPaths` in app/sitemap.ts and a 'מפת אתר' link in the footer 'קישורים' column. In app/not-found.tsx, replace the single home link with a six-item service list plus links to /gallery/, /locations/ and /contact/ — a 404 on a static export is where a mistyped or stale URL lands, and it currently offers users one route out of the dead end.

```
// app/site-map/page.tsx
export const metadata: Metadata = {
  alternates: { canonical: "/site-map/" },
  title: "מפת אתר",
  description: "כל העמודים באתר סקיי שייד — שירותי אלומיניום, גלריית פרויקטים ואזורי שירות בכל הארץ.",
};
// …
<PageHeader title="מפת אתר" crumbs={[{ label: "בית", href: "/" }, { label: "מפת אתר" }]} />
<Section tone="white">
  <h2 className="font-heading text-xl font-bold text-primary">השירותים שלנו</h2>
  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
    {services.map((s) => (
      <li key={s.slug}>
        <Link href={`/service/${s.slug}/`} className="text-secondary hover:underline">{s.name}</Link>
      </li>
    ))}
  </ul>
  {/* אזורי שירות — all 16, anchors as "פתרונות אלומיניום ב{city}" */}
</Section>
```

## 12. Harden the mobile menu: it has no aria-controls, no Escape, no outside-click close and no current-page state
`medium` · impact `medium` · effort `M`

**Evidence:** components/layout/Header.tsx:67-75 — the toggle sets `aria-expanded={open}` but has no `aria-controls`, and the panel it controls (:80) has no `id`. There is no Escape handler, no click-outside handler and no body scroll lock (contrast components/marketing/FilterableGallery.tsx:42-49, which does wire Escape for the lightbox). No link ever gets `aria-current="page"`, so on a 5-item nav rendered on 33 pages the user is never told where they are. The panel lives inside `sticky top-0` (:17); with 5 items at ~44px plus the 56px CTA it occupies roughly 320px of a small phone viewport.

**Recommendation:** In components/layout/Header.tsx: add `id="mobile-nav"` to the panel and `aria-controls="mobile-nav"` to the button; add a `useEffect` closing on Escape and on `pointerdown` outside the header; set `document.body.style.overflow` while open; and add `aria-current={pathname === item.href ? "page" : undefined}` (via `usePathname()`, remembering trailingSlash means the pathname is `/services/`). Keep both nav copies rendered in the DOM — that is what puts the links in the static HTML — and keep the mobile links CSS-hidden rather than unmounted when adding the services sub-list from the nav finding.

```
const pathname = usePathname(); // "/services/" — trailingSlash:true
const isCurrent = (href: string) => pathname === `${href.replace(/\/$/, "")}/`;

useEffect(() => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
  window.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";
  return () => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
  };
}, [open]);

<button aria-controls="mobile-nav" aria-expanded={open} …>
<div id="mobile-nav" className={cn("border-t border-gray-100 lg:hidden", open ? "block" : "hidden")}>
```

## 13. Build a restrained service×city tier — 8-12 pages, not the full 96-cell matrix
`medium` · impact `high` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** generateStaticParams in app/service/[slug]/page.tsx:26-28 and app/locations/[city]/page.tsx:12-14 produce 6 and 16 pages respectively with no crossing route. The city template's entire unique body is two templated paragraphs with `{city.name}` interpolated (page.tsx:58-68) — out/locations/tel-aviv/index.html and out/locations/haifa/index.html differ only by the city string. Building all 96 combinations from that same template would produce 96 near-identical pages, which is the textbook doorway pattern.

**Recommendation:** Build a first tier of at most 8-12 pages at /service/[slug]/[city]/ (or /locations/[city]/[service]/), restricted to the two services with real demand (pergolas, fences-gates) × the top 4-6 cities by actual lead volume. Each page ships ONLY if it carries genuinely unique material: real photos of a project in that city from the media catalog, the specific municipal permit situation (ועדה מקומית, תב\"ע, פטור עד 50 מ\"ר), and a named local reference. Internal-link wiring: /locations/[city]/ links down to each of its service×city pages with anchor 'פרגולות אלומיניום ב{city}'; /service/[slug]/ links down with anchor '{service} ב{city}'; each cross page breadcrumbs as בית / אזורי שירות / {city} / {service} and links laterally to its two siblings. Do not generate the tier from a template loop — generate it from a hand-authored content file, and if a cell has no unique content, do not build the cell.

**Risk:** This is the highest-risk item in the dimension. Templated service×city pages at scale are exactly what Google's spam policy on doorway pages targets. Gate the build on a per-cell content record existing; an empty record must produce no route and no sitemap entry. It also depends on the client supplying lead-volume data to pick the cities, and real per-city project facts.

## 14. Turn 55 gallery photos into per-project pages — the missing content tier the whole link graph is waiting for
`medium` · impact `high` · effort `XL` · **NEEDS CLIENT INPUT**

**Evidence:** site.config.json images.gallery.items holds 55 catalog entries with stable keys, dimensions and Hebrew alt text, split 9/15/18/13 across four categories. Every one of them renders only as a lightbox <button> in components/marketing/FilterableGallery.tsx:82-96 — there is not a single indexable URL per project anywhere in out/. The alt text is auto-generated and uniform ('פרויקט אלומיניום של סקיי שייד — דקים 1'), carrying no project-specific information.

**Recommendation:** Add a /projects/[slug]/ tier fed by a hand-authored `lib/projects.ts` — one record per real project with: city (must be one of the 16 location slugs), service slug, 150-250 words of Hebrew narrative (the brief, the constraint, the material chosen), and the catalog keys of its photos. Link wiring: /gallery/<category>/ tiles link into the project pages; each project page breadcrumbs בית / גלריה / <category> / <project> and links out to its service page ('כל מה שצריך לדעת על פרגולות אלומיניום') and its city page ('פתרונות אלומיניום ב{city}'); /service/<slug>/ gains a 'פרויקטים אחרונים' module linking 3 projects; /locations/<city>/ gains 'פרויקטים שביצענו ב{city}' when at least one project exists there. Start with 8-12 projects, not 55 — a project page with no story is worse than a gallery tile.

**Risk:** Every field is a business fact: which city each photo was taken in, what the client asked for, which material was used, what the constraint was. None of it can be inferred from the catalog, and inventing it would be fabricated content. Ship only the projects the client can actually describe.

## 15. Internal-linking blueprint: which template links to which, with Hebrew anchors
`medium` · impact `high` · effort `S`

**Evidence:** Current measured graph (33 built files): every non-chrome link comes from four templated components — ServicesGrid (6 links, on / and /services/), ServiceAreas (17 links, on / only), the city page service list (6 links) and the service page 'שירותים נוספים' list (4 links). No template links sideways within its own tier, and no template links across tiers except downward from home. Nine of eleven templates produce zero contextual body links.

**Recommendation:** Target graph, to be implemented by the findings above and then used as the acceptance checklist.

/ (home) → unchanged: 6 services, 16 cities, /gallery/. ADD: 4 gallery-category links, anchors 'גלריית פרגולות', 'גלריית גדרות ושערים', 'גלריית חיפוי קירות', 'גלריית דקים'.

/services/ → 6 services (prose + grid), 4 gallery categories, /locations/. Anchors in prose: 'פרגולת אלומיניום חשמלית', 'גדר אלומיניום דקורטיבית', 'חיפוי קירות בקומפוזיט', 'דק WPC', 'מטבח חוץ מאלומיניום', 'תריסי אקורדיון לסגירת מרפסת'.

/service/<slug>/ → 5 siblings (fix the slice), 2-3 prose cross-links ('פרגולת אלומיניום מעל הדק'), 8 cities ('פתרונות אלומיניום ב{city}'), /locations/ ('לכל 16 אזורי השירות'), its gallery category ('לגלריית {service} — תמונות מפרויקטים שביצענו'), 3 project pages when they exist.

/locations/ → 16 cities with qualified sub-anchor 'פרגולות, גדרות ודקים ב{city}', 6 services, /gallery/.

/locations/<city>/ → 6 services, 4 sibling cities ('פתרונות אלומיניום ב{city}'), /locations/ ('לכל אזורי השירות'), 3 gallery categories, projects in that city when they exist.

/gallery/ → 4 category pages ('לכל התמונות ←') + 4 matching service pages, one per category section.

/gallery/<category>/ → its service page ('כל מה שצריך לדעת על {service}'), the other 3 categories, /gallery/, projects in that category.

/about/ → 6 services in prose, /gallery/, /contact/. Currently links nothing (measured: body links = breadcrumb only).

/contact/ → /services/, /locations/, /gallery/. Currently links nothing.

Footer (all pages) → 6 services, all 16 cities, /services/ (missing today), /gallery/, /locations/, /about/, /contact/, /site-map/; legal links demoted to the bottom bar.

Header (all pages) → 5 top-level items + a 6-item services dropdown, both copies in the DOM.

Rule to enforce in review: no template ships with zero contextual body links, and no URL in sitemap.xml has fewer than 5 sitewide inbound links.


# Hebrew keyword and query landscape

**Current state:** The site is competently written Hebrew brochure copy, but it is written in the vocabulary of an aluminium fabricator rather than the vocabulary of an Israeli homeowner typing into Google. Across all 36 shipped pages in `out/`, the entire commercial-research vocabulary is missing: `מחירון` = 0 occurrences, `כמה עולה` = 0, `תיקון 101` = 0, `חוק הפרגולות` = 0, `ועדה מקומית` = 0, `סוכה`/`סכך` = 0, `ביוקלימטית` = 0, `דמוי עץ` = 0, `סינטטי` = 0 (the site spells it `סינתטי`, the market spells it `סינטטי`), `ציפוי אבקתי` = 0. What the site does say heavily — `אלומיניום` 1,307 times, `בהתאמה אישית` 317 times — is brand-voice filler, not query language. The category naming is actively working against it: the accordion service is called `מוצרים אקורדיאוניים` (126 occurrences), a manufacturer-internal term, while the consumer head term `סגירת מרפסת` appears only 18 times and every competitor ranking for it uses it in the URL. There is no route in `app/` capable of hosting informational content — no blog, no guides, no pricing page — so the three largest Hebrew query clusters in this vertical (price, permits, material comparison) have nowhere to live. The 16 city pages are 100% templated from `app/locations/[city]/page.tsx` lines 47–71 with the city name as the only variable (~85 words of unique copy each), which is a doorway-page pattern rather than a keyword asset. Retrieved SERPs show the `[שירות] ב[עיר]` queries are dominated by directories (midrag, b144, pro.co.il, t.co.il), not by manufacturers, which materially changes what local pages can realistically win.


## 1. Build a Hebrew price-intent layer (מחיר / כמה עולה / מחירון) — the highest-intent cluster is entirely absent
`critical` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** Shipped HTML across out/ contains `מחירון` 0 times and `כמה עולה` 0 times. On service/pergolas/index.html `מחיר` appears 9 times and `עלות` 6 — all of it CTA boilerplate ("קבלו הצעת מחיר חינם", "הצעת מחיר שקופה"), never an actual number. Retrieved SERP for `פרגולות אלומיניום מחיר למ"ר 2026`: every top result is a dedicated price URL — pergolass.co.il/pergola-price/, lidar.co.il/פרגולות-אלומיניום-מחיר/, catomltd.co.il/מחיר-של-פרגולות/, pergolas4u.co.il/מחירון-פרגולות. Retrieved market bands: aluminium pergola 600–1,500 ₪/m² (avg ~800); electric/louvred 1,600–3,000 ₪/m²; synthetic deck 280–650 ₪/m² supply, ~500–850 ₪/m² installed; aluminium fence 200–1,000 ₪/linear m; electric gate 1,500–5,000 ₪; HPL cladding 600–800 ₪/m² installed.

**Recommendation:** Add a new static route `app/pricing/page.tsx` → `/pricing/` titled `מחירון פרגולות ואלומיניום — כמה עולה פרגולת אלומיניום ב-2026`, and add a per-service price band to `lib/content.ts` rendered inside `app/service/[slug]/page.tsx` above the FAQ block. Publish ranges with the variables that move them (מ"ר, סוג פרופיל, חשמלי/ידני, מורכבות עיגון), never a single number, and keep the free-measurement CTA as the conversion path. Add the route to `staticPaths` in `app/sitemap.ts`. Target the three surface forms separately in headings: `מחיר`, `כמה עולה`, `עלות`.

```
// lib/content.ts — new export
export interface PriceBand { from: number; to: number; unit: string; note: string; }
export const priceBands: Record<ServiceSlug, PriceBand> = {
  pergolas: { from: 600, to: 1500, unit: "למ״ר",
    note: "פרגולת אלומיניום ידנית. פרגולה חשמלית עם להבים מתכווננים — 1,600–3,000 ₪ למ״ר." },
  decks: { from: 350, to: 850, unit: "למ״ר כולל התקנה",
    note: "דק סינטטי (WPC). דק מעץ טבעי משתנה לפי סוג העץ." },
  // ... fences-gates, wall-cladding, outdoor-kitchen, accordion-products
};

// app/pricing/page.tsx — H2 copy targeting all three intent forms
// <h2>כמה עולה פרגולת אלומיניום?</h2>
// <h2>מחירון דק סינטטי ודק עץ</h2>
// <h2>מה משפיע על עלות הפרויקט?</h2>
```

**Risk:** Do not publish bands the business cannot honour — a range that undercuts the real quote destroys trust at the site visit. Client must approve every number. Ranges also need an annual refresh or they become a liability.

## 2. Own the permit cluster (תיקון 101 / חוק הפרגולות) and fix the factually incomplete answer already shipping
`critical` · impact `transformational` · effort `L`

**Evidence:** `תיקון 101` = 0, `חוק הפרגולות` = 0, `רפורמת הפרגולות` = 0, `ועדה מקומית` = 0 across all shipped HTML. Meanwhile `lib/content.ts:112` and `lib/content.ts:346` both ship the single sentence "פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר". Retrieved sources (architecture.org.il, ipac.co.il, nayer.co.il, felaw.co.il) describe תקנות התכנון והבניה (עבודות ומבנים הפטורים מהיתר), תשע"ד-2014 as: exemption is 50 m² **or ¼ of the ground/roof area, whichever is greater**; light materials only; no external walls or windows; gaps must be evenly distributed and comprise **at least 40%** of the roof; permitted on ground or building roof, **not on balconies**; and even exempt work generally requires reporting to the licensing authority **within 45 days** of completion. The shipped one-liner omits every one of these conditions.

**Recommendation:** Two changes. (1) Correct `lib/content.ts:112` and `:346` so the FAQ answer states the real conditions rather than the 50 m² half-truth. (2) Add `app/guides/pergola-permit/page.tsx` → `/guides/pergola-permit/` as the cluster hub, titled `היתר בנייה לפרגולה — חוק הפרגולות (תיקון 101): מתי פטור ומתי חייבים`. Structure H2s around the actual queries: `פרגולה ללא היתר — מה מותר?`, `תנאי הפטור לפי תקנות התכנון והבניה`, `סגירת מרפסת — למה כאן כן צריך היתר`, `דיווח לוועדה המקומית תוך 45 יום`, `פרגולה בבית משותף`. This is the highest-volume Israeli informational intent in the vertical and it converts, because the person asking is mid-project.

```
// lib/content.ts:111-113 — replace
{
  q: "האם צריך היתר בנייה לפרגולה?",
  a: "לפי תקנות התכנון והבנייה (עבודות ומבנים הפטורים מהיתר) — \"חוק הפרגולות\" — פרגולה פטורה מהיתר בתנאים מצטברים: שטח של עד 50 מ״ר או עד רבע משטח הקרקע/הגג (הגדול מביניהם); ללא קירות חיצוניים וללא חלונות; מחומרים קלים בלבד; והמרווחים בגג מפוזרים באופן שווה ומהווים לפחות 40% משטח הגג. הפטור חל על הקרקע או על גג המבנה — לא על מרפסות. גם עבודה פטורה מחייבת בדרך כלל דיווח לרשות הרישוי תוך 45 יום מסיום הביצוע. אנחנו מלווים אתכם בבדיקה מול הוועדה המקומית.",
}
```

**Risk:** Planning law is amended periodically and local committees add their own conditions. Have the final wording checked by a licensing professional, add a dated "נכון ל-" line and a short disclaimer directing readers to their ועדה מקומית. Do not present the guide as legal advice.

## 3. Rename the accordion service to the term Israelis actually search: סגירת מרפסת
`critical` · impact `transformational` · effort `M`

**Evidence:** `מוצרים אקורדיאוניים` appears 126 times in shipped HTML (it is the service name in `lib/site-config.ts:65`, the H1 of out/service/accordion-products/index.html, and every nav/footer/card instance). `סגירת מרפסת` appears only 18 times, `מרפסת חורף` 0, `וילון זכוכית` 0, `זכוכית נאספת` 0, `זכוכית מתקפלת` 0. Retrieved SERP for the category returns exclusively `סגירת מרפסת` URLs — waissman.co.il/סגירת-מרפסת/, alumi.co.il/סגירת-מרפסת-זכוכית-אקורדיון, sorag.co.il/glass-curtain-balcony/, solaris-ltd.co.il, hzk.co.il, bigtips.co.il, midrag.co.il/Content/Price/10009. Retrieved price band 800–1,200 ₪/m², up to 2,500 ₪/m². `מוצרים אקורדיאוניים` is a fabricator's catalogue heading, not a query.

**Recommendation:** Keep the slug `accordion-products` (changing it costs the URL's history for no gain) but change the display name in `lib/site-config.ts:65` to `סגירת מרפסת` and rewrite `serviceMeta["accordion-products"]` and `serviceDetails["accordion-products"]` in `lib/content.ts:56-61` and `:224-248` around the real vocabulary: `סגירת מרפסת`, `מרפסת חורף`, `זכוכית נאספת`, `זכוכית מתקפלת`, `וילון זכוכית`, `תריס אקורדיון`. Keep `אקורדיון` as a secondary term, not the head term.

```
// lib/site-config.ts:65
{ slug: "accordion-products", name: "סגירת מרפסת" },

// lib/content.ts — serviceMeta
"accordion-products": {
  tagline: "זכוכית נאספת · אקורדיון · מרפסת חורף",
  description:
    "סגירת מרפסת בזכוכית נאספת או מתקפלת, תריסי אקורדיון ומחסומי רוח מאלומיניום — הופכים מרפסת פתוחה למרפסת חורף מוגנת מרוח, מגשם ומאבק, בלי לוותר על הנוף.",
  icon: "Blinds",
},
```

**Risk:** The service name appears in nav, footer, cards and breadcrumbs, so this is a visible brand change — confirm with the client that "סגירת מרפסת" describes what they actually sell (it does per the current copy: tריסי אקורדיון, קירות הזזה, מחסומי רוח).

## 4. Name the flagship product with its market term: פרגולה ביוקלימטית / מתקפלת / נאספת
`high` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** `ביוקלימטית` = 0, `ביו-אקלימית` = 0, `ביוקלמטיק` = 0, `מתקפלת` = 0, `נאספת` = 0 across all shipped HTML. The site describes the product only descriptively — `lib/content.ts:101` "אפשרות פרגולה חשמלית עם להבים מתכווננים" and `:116` "להבי אלומיניום מתכווננים שנפתחים ונסגרים בשלט". Retrieved SERP for the category is built entirely on the missing terms: silvergate.co.il/פרגולות-חשמליות-מתכווננות/bioclimatic-pergula/, solaris-ltd.co.il/electric-pergola/ ("מתקפלת / נאספת"), pergolass.co.il/electrical-pergola/ ("נאספת / מתקפלת"), lidar.co.il/פרגולה-חשמלית/. This is the highest-margin product in the range and the site is invisible for its own name.

**Recommendation:** Edit `lib/content.ts` `serviceDetails.pergolas` to name the product types explicitly, and add an H2 section on `app/service/[slug]/page.tsx` for pergolas covering `פרגולה ביוקלימטית`, `פרגולה חשמלית מתקפלת`, `פרגולה נאספת` as distinct sub-products. Also add `פרגולה תלויה` (0 occurrences; a real product type per aviv-pergola.co.il/hanging-pergolas/) and `אלומיניום דמוי עץ` (0 occurrences; retrieved as an 800–1,500 ₪/m² segment with its own midrag guide).

```
// lib/content.ts — serviceDetails.pergolas.benefits, replace the electric line
"פרגולה ביוקלימטית חשמלית — להבי אלומיניום מתכווננים בשלט או באפליקציה",
"פרגולה מתקפלת / נאספת לשליטה מלאה בצל, באוויר ובגשם",
"פרגולה תלויה ללא עמודים — מראה נקי ומרפסת פנויה",
"גימור אלומיניום דמוי עץ — מראה של עץ בלי התחזוקה של עץ",

// new FAQ pair
{
  q: "מה זו פרגולה ביוקלימטית?",
  a: "פרגולה ביוקלימטית (פרגולה חשמלית מתכווננת) היא פרגולת אלומיניום שהגג שלה בנוי מלהבים נעים. פותחים אותם לאוורור ולאור טבעי, סוגרים אותם לאטימה מלאה מפני גשם ושמש — הכל בשלט או באפליקציה.",
}
```

**Risk:** Only claim the product types Sky Shade actually manufactures. Confirm with the client whether they supply bioclimatic louvred systems, hanging/cantilevered pergolas and wood-effect finishes before publishing any of these terms.

## 5. Capture פרגולה כשרה לסוכה — the largest Israel-specific intent, and the site's product is the literal answer
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `סוכה` = 0, `סוכות` = 0, `סכך` = 0 across all shipped HTML. Retrieved SERP shows a fully developed competitor cluster with dedicated pages: pergolass.co.il/פרגולה-כשרה-לסוכה/, pergolas4u.co.il/פרגולה-לגינה/פרגולה-כשרה-לסוכה, aapergulot.co.il/פרגולה-כשרה-לסוכה/, stb.co.il/פרגולה-סוכה/, pergola-expert.co.il/פרגולה-לסוכה-כשרה/, plus halachic sources (toraland.org.il, olamot.net). The retrieved halachic requirement — an opening/retractable roof lets you remove the covering and lay s'chach under open sky — describes exactly the adjustable-louvre electric pergola the site already sells (`lib/content.ts:101,116`). The product-intent match is perfect and completely unexploited.

**Recommendation:** Add `app/guides/pergola-sukkah/page.tsx` → `/guides/pergola-sukkah/`, titled `פרגולה כשרה לסוכה — איך הופכים פרגולת אלומיניום לסוכה כשרה`. H2s: `מה הופך פרגולה לסוכה כשרה`, `פרגולה חשמלית עם גג נפתח — הפתרון הפשוט`, `שלוש דפנות ושטח מינימלי`, `מה עושים בפרגולה עם גג קבוע`. Cross-link to `/service/pergolas/`. Publish and re-promote in Elul (Aug–Sep) ahead of Tishrei. Cite the halachic requirements rather than ruling on them, and tell readers to confirm with their רב.

```
// app/guides/pergola-sukkah/page.tsx — metadata
export const metadata: Metadata = {
  alternates: { canonical: "/guides/pergola-sukkah/" },
  title: "פרגולה כשרה לסוכה — פרגולת אלומיניום עם גג נפתח | סקיי שייד",
  description:
    "איך הופכים פרגולת אלומיניום לסוכה כשרה? פרגולה חשמלית עם להבים נפתחים מאפשרת להניח סכך תחת כיפת השמיים. מה הדרישות, מה מותר ומה כדאי לבדוק לפני שמזמינים.",
};
```

**Risk:** Halachic claims are a reputational minefield. Do not state that a specific Sky Shade product "is kosher" — state the conditions, note that psak depends on the rav and the installation, and have the client confirm whether their louvre system genuinely opens to open sky. A wrong claim here is worse than no page.

## 6. Fix the דק סינטטי spelling and stop leading with the WPC trade term
`high` · impact `high` · effort `S`

**Evidence:** Shipped HTML contains `סינתטי` 2 times and `סינטטי` 0 times. `lib/content.ts:176` reads "דקים מ-WPC (עץ סינתטי)". Every retrieved competitor uses `סינטטי` with tet: neta-ginun.co.il/דק-סינטטי/, pergolass.co.il/synthetic-deck/, bull-deck.com/דק-סינטטי-מחיר/, superdeck.co.il/synthetic-decking-vs-natural-wood/, eyalyarokad.co.il/דק-סינטטי-vs-דק-עץ-טבעי. The site also leads with `WPC` — a trade acronym — while `דק סינטטי` is the consumer head term and `דק פולימרי` a common synonym (steeldeco.co.il). The decks service is named simply `דקים` (lib/site-config.ts:63), the broadest and least qualified form available.

**Recommendation:** In `lib/content.ts:44-49` and `:174-198`, switch the primary term to `דק סינטטי`, keep `WPC` as a parenthetical technical qualifier, and add `דק פולימרי` once as a synonym. Change the service name in `lib/site-config.ts:63` from `דקים` to `דקים — סינטטי ועץ` so the H1 and title carry a qualifier. Standardise on the tet spelling site-wide; a single site cannot afford to split its own signal across two orthographies of its own product name.

```
// lib/site-config.ts:63
{ slug: "decks", name: "דקים — סינטטי ועץ" },

// lib/content.ts — serviceMeta.decks
decks: {
  tagline: "דק סינטטי (WPC) ועץ טבעי",
  description:
    "דק סינטטי (WPC / דק פולימרי) ודק מעץ טבעי — משטח חוץ עמיד ונעים למרפסת, לחצר ולסביבת הבריכה, בהתאמה אישית למידות שלכם.",
  icon: "Layers",
},
```

## 7. The 16 city pages are a templated doorway pattern, not a keyword asset
`high` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** `app/locations/[city]/page.tsx` lines 47–71 generate every city page from one template with `city.name` as the only variable: the H1 (`פרגולות אלומיניום ב{city.name}`), the subtitle, two body paragraphs and one H2 are string-interpolated. Shipped confirmation — out/locations/tel-aviv/index.html has exactly two prose paragraphs (~85 Hebrew words) plus a link list, `פרגולה` singular appears 0 times, `היתר` 0 times, and the only H2s are "השירותים שלנו ב" and the site-wide CTA. Sixteen URLs differing only by a proper noun is the textbook definition of doorway pages under Google's spam policies, which the assignment explicitly rules out.

**Recommendation:** Either differentiate or consolidate — do not leave them as-is and do not multiply them into 96 service×city pages on this template. Differentiate by adding per-city facts to `lib/site-config.ts` `locations[]`: a `notes` field carrying genuinely local content (the specific ועדה מקומית handling permits there, typical building stock — מרפסות בבנייני רבי-קומות in Tel Aviv vs חצרות פרטיות in Modi'in, coastal salt-air corrosion in Netanya/Ashdod/Haifa affecting material choice), plus 2–3 real local project references from the 55-photo gallery. If the client cannot supply that for all 16, cut the list to the 6–8 cities where real projects exist and 301 the rest to `/locations/`.

```
// lib/site-config.ts — extend the locations tuple
export const locations = [
  { slug: "netanya", name: "נתניה",
    angle: "קרבה לים — אוויר מלוח מאיץ קורוזיה. בנתניה אנחנו ממליצים על ציפוי אבקתי בעובי מוגבר ועל אביזרי נירוסטה בלבד.",
    committee: "הוועדה המקומית לתכנון ובנייה נתניה" },
  { slug: "tel-aviv", name: "תל אביב",
    angle: "רוב הפרויקטים בתל אביב הם מרפסות בבנייני מגורים — סגירת מרפסת ופרגולה על גג, שם תנאי הפטור מהיתר שונים מפרגולה בחצר.",
    committee: "הוועדה המקומית לתכנון ובנייה תל אביב-יפו" },
  // ...
] as const;
```

**Risk:** Per-city angles must be true. Inventing local detail is worse than the current thin template. If the client has no projects in a city, that city should not have a page.

## 8. Realistic competition read: city SERPs are owned by directories, so nest service×city under the service and build only where you can win
`medium` · impact `medium` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** Retrieved SERP for `פרגולות תל אביב / פרגולות בתל אביב`: positions are dominated by aggregators — midrag.co.il, b144.co.il, pro.co.il ("13 מתקיני פרגולות שבדקנו"), t.co.il, shiplus.co.il, mylist.co.il. The only manufacturer ranking does so with a service-nested city URL: silvergate.co.il/פרגולות-אלומיניום/התקנת-פרגולות-אלומיניום-בתל-אביב/ — city under service, not city as a standalone hub. The current architecture inverts this: `/locations/[city]/` is a standalone hub with a generic multi-service H1. Note also that `siteConfig.social.googleBusiness` is `""` (lib/site-config.ts:50), so there is no GBP entity anchoring any local query.

**Recommendation:** Do not build all 96 combinations. Restructure to `/service/[slug]/[city]/` for the two services with real search demand and real project photos — pergolas and decks — across the 6–8 cities where the client has completed work, giving each a genuinely different page (local permit authority, local building stock, named local projects from the gallery). Accept that directory listings will hold the top of these SERPs and treat GBP + directory presence (midrag, b144, pro.co.il) as a parallel channel rather than something organic pages can displace. Update `app/sitemap.ts` to emit the new nested routes.

## 9. There is no route in app/ capable of hosting informational content — this blocks every cluster above
`critical` · impact `transformational` · effort `L`

**Evidence:** `find app -name "*.tsx"` returns 14 files: the 6 top-level pages, two dynamic routes, 404, layout and the three legal pages. There is no blog, guides or resources segment. Shipped HTML confirms: `מדריך` = 0, `בלוג` = 0 occurrences across all 36 pages. The price, permit, comparison, sukkah and maintenance clusters identified in this report have nowhere to be published. `app/sitemap.ts` hardcodes `staticPaths` as a nine-item array, so any new section must also be wired there.

**Recommendation:** Add a `app/guides/` segment with an index page and a `[slug]` route reading from a new `lib/guides.ts` (MDX is unnecessary — typed content objects match the existing `lib/content.ts` pattern and keep the static export simple). Seed it with the five highest-value guides in priority order: `pergola-permit` (היתר בנייה), `pergola-price` or fold into `/pricing/`, `aluminum-vs-wood` (אלומיניום מול עץ), `deck-synthetic-vs-wood` (דק סינטטי מול עץ), `pergola-sukkah`. Extend `staticPaths` in `app/sitemap.ts` and add a nav entry in `lib/content.ts` `navItems`. Everything stays a static export — no runtime needed.

```
// lib/guides.ts
export interface Guide {
  slug: string; title: string; h1: string; description: string;
  updated: string;          // ISO date — surface as "עודכן ב-" for freshness
  sections: { h2: string; body: string[] }[];
  relatedServices: ServiceSlug[];
}
export const guides: Guide[] = [ /* ... */ ];

// app/sitemap.ts — add after serviceEntries
const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
  url: url(`guides/${g.slug}`),
  lastModified: new Date(g.updated),
}));
```

## 10. Own the material-comparison cluster — the top-of-funnel entry point for every service
`high` · impact `high` · effort `L`

**Evidence:** The site answers the three biggest comparison queries in one FAQ line each and nowhere else: `lib/content.ts:186-188` ("מה עדיף — דק WPC או עץ טבעי?"), `:161-163` ("מה ההבדל בין קומפוזיט ל-HPL?"), `:136-138` (aluminium vs iron fence). There is no page for `פרגולה אלומיניום או עץ` at all. Retrieved SERPs show a dense, well-developed competitor field for each: c14.co.il/article/801177, silvergate.co.il/wooden-or-aluminum-pergola-pros-cons/, etzvapele.co.il, ofekmaakot.co.il, azgerbi.com for pergola material; superdeck.co.il, eyalyarokad.co.il, bull-deck.com/difference-between-the-deck-types/ for decking; innobld.com/לוחות-חיפוי-קירות-חוץ-בין-אלומיני for HPL vs aluminium. These queries carry the highest informational volume in the vertical and feed directly into a quote request.

**Recommendation:** Publish three comparison guides under `/guides/`: `אלומיניום או עץ — מה עדיף לפרגולה?`, `דק סינטטי או עץ טבעי — ההשוואה המלאה`, `חיפוי קירות: אלומיניום, קומפוזיט (אלוקובונד) או HPL`. Use a real comparison table (עלות, תחזוקה, אורך חיים, מראה, עמידות בים) — the retrieved data gives you honest inputs (wood 300–800 ₪/m² vs aluminium 800–1,500 ₪/m²). Be genuinely balanced: state where wood wins. Note `אלוקובונד`/`אלובונד` currently appears 0 times on the site despite being the brand-as-category term buyers use for ACP.

```
// Suggested H2 outline for /guides/aluminum-vs-wood/
// <h1>פרגולת אלומיניום או פרגולת עץ — מה עדיף?</h1>
// <h2>טבלת השוואה: עלות, תחזוקה ואורך חיים</h2>
// <h2>מתי דווקא עץ עדיף</h2>
// <h2>מתי אלומיניום הוא הבחירה הנכונה</h2>
// <h2>אלומיניום דמוי עץ — הפשרה שסוגרת את הפער</h2>
// <h2>מה עם פרגולה משולבת אלומיניום ועץ?</h2>
```

**Risk:** A comparison page that only says "aluminium wins" reads as a sales page and will not earn the informational SERP. The page must concede wood's advantages honestly to rank.

## 11. Hebrew prefix morphology: the site emits only the ב-prefixed city form and only the plural pergola form
`medium` · impact `medium` · effort `S`

**Evidence:** `app/locations/[city]/page.tsx:22,47,48,59,65,71` concatenate `ב${city.name}` throughout, producing only `בתל אביב`. The unprefixed adjacency `פרגולות תל אביב` never appears in any heading or paragraph — it survives only in the breadcrumb (`page.tsx:36` passes the bare `city.name`). Both forms are searched: retrieved SERP titles include both `פרגולות בתל אביב` (midrag, b144, pro.co.il) and `פרגולות אלומיניום תל אביב` (silvergate). Similarly for number/construct forms: shipped HTML has `פרגולות אלומיניום` 110 times but the construct singular `פרגולת אלומיניום` only 4 — yet competitor titles lean on the singular (`פרגולת אלומיניום דמוי עץ`, `פרגולה אלומיניום חשמלית מחיר`), and `דק אלומיניום` = 0, `גדר אלומיניום` = 4 vs `גדרות אלומיניום` = 15.

**Recommendation:** Do not keyword-stuff variants; instead make sure each surface form occurs naturally at least once per page. In `app/locations/[city]/page.tsx` add one sentence using the unprefixed form (e.g. `פרגולות אלומיניום {city.name} — הצוות שלנו מגיע אליכם...`) alongside the existing prefixed H1. In `lib/content.ts` `serviceDetails.pergolas.about`, ensure the singular construct `פרגולת אלומיניום` appears — it currently reads only as plural. Same for `גדר אלומיניום` singular on the fences page. This is deliberate coverage of both morphological realisations, not repetition.

```
// app/locations/[city]/page.tsx — add after the second <p>
<p className="mt-4 text-gray-700">
  מחפשים פרגולות אלומיניום {city.name}, גדר אלומיניום או דק סינטטי? נשמח להגיע
  אליכם למדידה ללא עלות ולתת הצעת מחיר שקופה לפרויקט ב{city.name} ובסביבה.
</p>
```

**Risk:** DOMAIN REASONING, NOT RETRIEVED DATA: I could not retrieve authoritative documentation of how Google Israel handles Hebrew prefix stripping (ב/ל/מ/ה/ש/ו) or construct-state (סמיכות) normalisation. The one retrieved source on Hebrew SEO (ranktracker) only states that Hebrew's morphology is materially harder to stem than English's, and my WebFetch of it failed. Treat this as a low-cost hedge — cover both forms because it is cheap — rather than as a measured effect. Do not over-invest on this basis.

## 12. Hebrew orthography variants: the site uses typographic gershayim where users type an ASCII quote
`low` · impact `low` · effort `S`

**Evidence:** out/service/pergolas/index.html contains `מ״ר` (U+05F4 GERSHAYIM) 1 time and the ASCII-quote form `מ"ר` 0 times — sourced from `lib/content.ts:112` and `:346`. Israeli users typing on a standard Hebrew keyboard produce the ASCII `"`, and every retrieved competitor title uses the ASCII form (`דק סינטטי מחיר למ"ר`, `פרגולה מחיר למטר`, `מחיר אלומיניום למטר 2026`). The same split applies to `ש"ח` vs `ש״ח`. This compounds the `סינטטי`/`סינתטי` split already noted separately.

**Recommendation:** Normalise all abbreviation punctuation in `lib/content.ts` to the ASCII form users actually type (`מ"ר`, `ש"ח`), or ensure both forms appear at least once on the pricing page. Also spell out `מטר רבוע` once per price page so the unabbreviated query form is covered. This is a find-and-replace in one file.

```
// lib/content.ts — normalise
// before: "פרגולות עד 50 מ״ר בדרך כלל פטורות מהיתר"
// after:  "פרגולות עד 50 מ\"ר (מטר רבוע) בדרך כלל פטורות מהיתר"
```

**Risk:** Google normalises punctuation reasonably well, so the ranking effect is probably small. Included because it costs minutes and because the same orthographic-split problem is genuinely material in the סינטטי/סינתטי case.

## 13. Add the technical spec vocabulary that both proves 'premium' and matches buyer-research queries
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `ציפוי אבקתי` = 0, `אבקתי` = 0, `סגסוגת` = 0, `עובי` = 0, `עיגון` = 0, `אנודייז` = 0, `עומס רוח` = 0 across all shipped HTML. `פרופיל` appears 7 times sitewide. Yet the site claims premium positioning 317 times via `בהתאמה אישית` and calls itself `אלומיניום פרימיום` in every title. Retrieved buyer-guidance sources (alumi.co.il/פרופיל-אלומיניום-לפרגולה, dgsaluminium.co.il, unikit.co.il/פרגולות-אלומיניום-ההמלצות) tell buyers to check exactly these things: profile thickness (20×20–40×40 mm light, 50×50–80×40 mm medium, 80×80 mm+ heavy), alloy grade, oven-baked powder coating vs hand painting, and anchoring method. A premium claim with zero verifiable specification is an unsupported adjective.

**Recommendation:** Add a `specs` block to `serviceDetails` in `lib/content.ts` rendered as an H2 on `app/service/[slug]/page.tsx` — `המפרט הטכני שלנו` — listing profile dimensions, alloy, coating type and warranty terms. This simultaneously (a) targets `פרופיל אלומיניום לפרגולה`, `ציפוי אבקתי`, `עובי פרופיל` queries, (b) substantiates the premium claim, and (c) gives the sales conversation a differentiator. Also add a guide `מה לבדוק לפני שמזמינים פרגולת אלומיניום` targeting the research query directly.

```
// lib/content.ts — add to ServiceDetail
specs?: { label: string; value: string }[];

// serviceDetails.pergolas.specs
specs: [
  { label: "פרופיל", value: "__ × __ מ\"מ — REQUIRES CLIENT INPUT" },
  { label: "סגסוגת", value: "__ — REQUIRES CLIENT INPUT" },
  { label: "גימור", value: "ציפוי אבקתי צרוב בתנור (לא צביעה ידנית)" },
  { label: "עיגון", value: "בסיסים מבוטנים ועוגנים כימיים" },
  { label: "אחריות", value: "__ שנים — REQUIRES CLIENT INPUT" },
],
```

**Risk:** Every number here is a factual claim about the product. Publishing a profile dimension or alloy grade the company does not actually use is a consumer-protection problem, not just an SEO one. Leave placeholders until the client confirms.

## 14. Cover the maintenance and repair cluster (תחזוקה, תיקון, חידוש) — currently zero
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `תיקון` = 0 and `חידוש` = 0 across all shipped HTML. Maintenance is addressed only in two FAQ lines (`lib/content.ts:194-196`, `:120`) and the copy actively closes the topic down — "אלומיניום איכותי... מחזיקה שנים רבות עם תחזוקה מינימלית". Retrieved sources show a developed cluster: etsim.co.il/תחזוקת-פרגולת-אלומיניום, sun-tech.co.il/תחזוקת-פרגולות/, my-aluminum.co.il/תיקון-פרגולות-אלומיניום, buyitcenter.co.il, with concrete guidance (rinse twice yearly at end of spring and end of winter, recoat roughly every four years, annual bolt-tightening and drainage-channel checks). The retrieved sources are explicit that "minimum maintenance is not zero maintenance" — the opposite of the site's framing.

**Recommendation:** Add `/guides/pergola-maintenance/` — `תחזוקת פרגולת אלומיניום — המדריך המלא` covering ניקוי, ציפוי, בדיקת ברגים ומנגנונים, ניקוז. This serves existing customers (retention, referrals) and captures research traffic from people who own a competitor's pergola and are now shopping for a replacement. Separately, decide whether to publish a `תיקון וחידוש פרגולות` service page — it is a distinct commercial query with its own SERP.

**Risk:** Do not publish a repair/renovation service page unless Sky Shade actually offers repairs. `lib/content.ts:140-142` currently says of gates "אנחנו מתמחים בתכנון והתקנה של שערים חדשים" — implying new-build only. Confirm the service scope first.

## 15. Adopt the year-stamped title convention that dominates this Hebrew vertical
`medium` · impact `medium` · effort `S`

**Evidence:** `2026` appears 66 times in shipped HTML but every instance is the footer copyright (`© 2026 סקיי שייד`) — verified by inspecting the surrounding markup in out/index.html. No title, H1 or H2 carries a year. Across every retrieved SERP in this vertical, the year is in the title: "פרגולות אלומיניום - דגמי 2026", "מחירון פרגולות ודקים 2026", "דק סינטטי מחיר 2026 – מדריך מלא", "מחירון שערים מעודכן 2026", "פרגולות אלומיניום ב-2026: המדריך המלא", "מחירון אלומיניום לבית 2026", "פרגולה לחצר: קטלוג 2026". It is the established convention for price and guide pages here.

**Recommendation:** Apply the year only to pages where it is truthful and maintainable — the pricing page and the guides — never to the service or city pages. Derive it from the guide's `updated` field in `lib/guides.ts` rather than hardcoding, so it cannot silently go stale, and surface a visible `עודכן ב-` line. Commit to an annual refresh; a page titled 2026 in 2028 is worse than an undated one.

```
// app/guides/[slug]/page.tsx
export function generateMetadata({ params }): Metadata {
  const g = guides.find((x) => x.slug === params.slug)!;
  const year = new Date(g.updated).getFullYear();
  return {
    alternates: { canonical: `/guides/${g.slug}/` },
    title: `${g.title} ${year} | סקיי שייד`,
    description: g.description,
  };
}
```

**Risk:** Creates a recurring maintenance obligation. If nobody will update these annually, omit the year rather than shipping a stale one.

## 16. Missing product-type long-tail: פוליקרבונט depth, סככה / מחסה לרכב, אלומיניום דמוי עץ
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `פוליקרבונט` appears 19 times but only ever as a list item in `lib/content.ts:29,102,334` — never with its own heading or explanation, despite being a distinct query with its own material considerations. `סככה` = 0, `סככות` = 0, `מחסה לרכב` = 0 and `רעפים` = 0, even though the pergolas service is literally named `פרגולות, מחסות וגגות` (lib/site-config.ts:60) — the site claims the category in its service name and then never uses the words people search for it. `דמוי עץ` = 0 despite the retrieved price data treating `פרגולת אלומיניום דמוי עץ` as its own 800–1,500 ₪/m² segment with dedicated competitor coverage (midrag.co.il/Content/Tip/12543).

**Recommendation:** Split the pergolas service page into sub-sections with real H2s per product type rather than one undifferentiated block: `פרגולת אלומיניום`, `פרגולה ביוקלימטית חשמלית`, `פרגולה עם גג פוליקרבונט`, `סככה ומחסה לרכב`, `אלומיניום דמוי עץ`. The current outline (out/service/pergolas/index.html: H1 + `למה לבחור בנו ל`, `איך אנחנו עובדים`, `שאלות נפוצות על`, `שירותים נוספים`, CTA) contains no product-type headings at all — every H2 is a marketing section, none is a thing a person searches for. If `מחסה לרכב` volume justifies it, give it its own service page rather than burying it in the pergolas name.

**Risk:** Confirm the client actually fabricates carports/canopies before building out `סככה`/`מחסה לרכב` — the service name implies it (`מחסות`) but no body copy anywhere describes it.

## 17. Seasonality strategy — I could not retrieve Israeli demand data; treat the following as domain reasoning only
`low` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** My WebSearch for Israeli pergola demand seasonality (`עונתיות ביקוש פרגולות ישראל אביב קיץ פסח`) returned no relevant results — the SERP was school-holiday calendars and unrelated content. I have no retrieved data on Israeli seasonal search patterns for this vertical. What I can evidence from the repository: `app/sitemap.ts` sets `lastModified: now` (build time) for every URL identically, so the sitemap carries no real freshness signal, and there is no content surface whose publication could be timed to a season anyway.

**Recommendation:** Before investing in seasonal content timing, get real data the client can supply for free: Google Search Console (currently likely unverified — `analytics.googleSiteVerification` is null per the manifest) and Google Business Profile insights (`siteConfig.social.googleBusiness` is `""` at lib/site-config.ts:50), both of which show 16 months of query seasonality for this exact business. Verify GSC first, then time content to observed peaks rather than assumed ones. My untested priors — publish the sukkah guide in Elul before Tishrei, the balcony-closing/מרפסת חורף content before the first rains, and pergola/shading content in late winter ahead of spring — are plausible for the Israeli calendar but are inference, not measurement, and should not drive budget until GSC confirms them.

**Risk:** Acting on assumed seasonality without GSC data risks publishing into the wrong month and concluding the content 'did not work'. Verify Search Console before treating any of this as actionable.


# Conversion rate optimisation, engagement and lead capture

**Current state:** The funnel is a single 4-field Web3Forms lead form (`components/forms/LeadForm.tsx`) that ships on exactly two of the 28 content pages — `out/index.html` and `out/contact/index.html` both contain one `<form`, while `out/service/pergolas/index.html`, `out/gallery/index.html` and `out/locations/tel-aviv/index.html` contain zero. Everywhere else the only conversion path is a `tel:` link and a WhatsApp deep link, all of which carry the identical hardcoded message "היי, אני מעוניין/ת בהצעת מחיר לפרויקט אלומיניום", so 16 city pages plus gallery/services/about produce leads with no page context and no attribution. The mobile sticky bar (`MobileCtaBar.tsx`) is the strongest thing here — two plain anchors, no JS dependency, always visible — but its WhatsApp half renders white text on `#25D366` at a computed 1.98:1 contrast ratio, failing WCAG AA on the single most-tapped element on the site, and WhatsApp gets 50% of that bar despite ~99% penetration in Israel. The form itself has two defects that destroy leads outright: a failed `fetch` sets `status="error"` but `error` is already `null` (line 52), so the UI shows literally nothing and the `window.open` fallback on line 91 runs after an `await` and has lost transient user activation, so popup blockers eat it; and the shipped `<form class="space-y-4" noValidate="">` has no `action`/`method`, so a submit before hydration does a GET reload and the lead is gone. Above the fold there is no product photography at all — `Hero.tsx` is two CSS radial gradients, the only `priority` image on the page is the 500×79 logo which consumes a high-priority `<link rel=preload as=image imagesrcset>` for a 36px-tall mark, and the 55-photo gallery that should be this business's strongest proof asset is a dead-end lightbox with no CTA, no next/prev, and a median source width of 624px.


## 1. Fix the silent lead loss when submission fails
`critical` · impact `transformational` · effort `S`

**Evidence:** components/forms/LeadForm.tsx:52 calls setError(null), then line 90 sets status="error" and line 91 calls window.open(). Because `error` is null and the `done` branch (line 95) is not taken, the component re-renders the plain form with NO message, NO error styling, and the button back to its idle label. The user taps 'שליחה', sees nothing change, and leaves. Worse, window.open() on line 91 runs after `await fetch(...)` — transient user activation has expired by then, so Safari, Firefox and Chrome all block the popup. Net result on any Web3Forms outage, DNS/corporate filter block of api.web3forms.com, or flaky mobile connection: the lead is destroyed with zero feedback to either party.

**Recommendation:** In components/forms/LeadForm.tsx, render a real error state instead of a popup. Set a Hebrew error message on failure, and render a tappable WhatsApp link built from the form values (a user-initiated tap keeps activation and is never blocked). Never call window.open() from a post-await code path. Also add a retry affordance so the user can resubmit without retyping.

```
// LeadForm.tsx — replace the catch block
const [waHref, setWaHref] = useState<string | null>(null);

} catch {
  setStatus("error");
  setWaHref(buildWhatsapp(form));        // build it, do NOT open it
  setError("השליחה נכשלה — ייתכן שיש תקלה זמנית. אפשר לשלוח לנו את אותם הפרטים בוואטסאפ, או לנסות שוב.");
  trackEvent("lead_submit_error", { form: "lead" });
}

// …in the JSX, above the submit button
{status === "error" && waHref && (
  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
    <p className="font-semibold text-red-700">{error}</p>
    <a href={waHref} target="_blank" rel="noopener" data-cta="leadform-error-whatsapp"
       className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 font-semibold text-[#0B141A]">
      <MessageCircle className="h-5 w-5" aria-hidden />
      שליחת הפרטים בוואטסאפ
    </a>
  </div>
)}
```

## 2. Give the form a native action so a pre-hydration submit still delivers
`critical` · impact `high` · effort `M`

**Evidence:** The shipped markup in out/index.html is `<form class="space-y-4" noValidate="">` — no `action`, no `method`. LeadForm is a client component; the site ships ~786KB of uncompressed JS across out/_next/static/chunks (fd9d1056 172KB, framework 140KB, 117-… 125KB, main 117KB, polyfills 113KB). On a mid-range Android on 4G, hydration lands seconds after first paint. Anyone who fills name+phone fast and hits submit before `onSubmit` is attached triggers a native GET to the current URL: the page reloads, the form is empty, the lead never existed. The same applies to any visitor with JS blocked or a failed chunk fetch.

**Recommendation:** Make the form work without JavaScript, then let JS enhance it. Point `action` at Web3Forms (their documented plain-HTML flow), add the hidden fields Web3Forms needs, and add a `redirect` to a new static `/thank-you/` page. Keep `handleSubmit` with `e.preventDefault()` for the hydrated path. The `/thank-you/` page is also a proper GA4/Google Ads conversion destination, which the current in-page success state does not provide. Remove `noValidate` or pair it with real JS validation (see the validation finding).

```
// LeadForm.tsx
<form
  onSubmit={handleSubmit}
  action={WEB3FORMS_ENDPOINT}
  method="POST"
  className={cn("space-y-4", className)}
>
  <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
  <input type="hidden" name="from_name" value={siteConfig.name} />
  <input type="hidden" name="subject" value={`פנייה חדשה מהאתר — ${siteConfig.name}`} />
  <input type="hidden" name="redirect" value={`${siteConfig.domain}/thank-you/`} />
  <input type="hidden" name="source_page" value={sourcePage} />  {/* new prop, see attribution finding */}
  …

// new file: app/thank-you/page.tsx  (noindex, phone + WhatsApp + link back to /gallery)
export const metadata = { robots: { index: false }, title: "תודה — קיבלנו את הפנייה" };
```

## 3. Put a lead form on the 26 pages that have none
`critical` · impact `transformational` · effort `M`

**Evidence:** grep of the built export: `out/index.html` → 1 `<form`, `out/contact/index.html` → 1, but `out/service/pergolas/index.html` → 0, `out/gallery/index.html` → 0, `out/locations/tel-aviv/index.html` → 0. `grep -rl LeadForm app/` returns only app/contact/page.tsx and components/marketing/Hero.tsx. The six service pages are the highest-intent pages on the site (a visitor on /service/pergolas/ has already self-selected a product) and their only conversion device is the sticky aside at app/service/[slug]/page.tsx:118-141 — two buttons, phone and WhatsApp, no form. The 16 city pages end with a generic FinalCta and nothing else.

**Recommendation:** Add `<LeadForm>` to the sticky aside in app/service/[slug]/page.tsx with the service pre-selected via a new `defaultService` prop, keeping the phone/WhatsApp buttons above it. Add a form band to app/gallery/page.tsx directly under the grid and to app/locations/[city]/page.tsx above the FinalCta. Give LeadForm a `sourcePage` prop that is written into the Web3Forms payload so the business can see which page produced each lead. This is the single highest-volume change in this list: it roughly triples the number of pages with a capture device.

```
// LeadForm.tsx — new props
export function LeadForm({ className, defaultService, sourcePage }:
  { className?: string; defaultService?: string; sourcePage?: string }) {
…
  <select id="lf-service" name="service" className={fieldClass} defaultValue={defaultService ?? ""}>

// app/service/[slug]/page.tsx — inside the sticky aside, after the two buttons
<div className="mt-6 border-t border-gray-200 pt-6">
  <p className="font-heading text-base font-bold text-primary">או השאירו פרטים ונחזור אליכם</p>
  <LeadForm className="mt-4" defaultService={card.name} sourcePage={`service/${card.slug}`} />
</div>
```

## 4. Fix the WhatsApp contrast failure on every WhatsApp control
`high` · impact `high` · effort `S`

**Evidence:** components/layout/MobileCtaBar.tsx:20 uses `bg-[#25D366]` with `text-white`. Computed relative luminance of #25D366 is 0.4805, giving a contrast ratio against white of 1.98:1 — WCAG AA requires 4.5:1 for 16px semibold text. The hover state `#1da851` (components/ui/Button.tsx:13) measures 3.10:1, also failing. The inline WhatsApp link in LeadForm.tsx:217 uses `text-[#1da851]` on white at 12px (`text-xs`), 3.10:1. This affects the most-tapped element on the site: on mobile the sticky bar is the only persistent CTA, and half of it is currently low-legibility. In bright outdoor daylight — the exact context in which someone photographs their balcony and looks up a pergola company — a 1.98:1 label is close to unreadable.

**Recommendation:** Keep the recognisable #25D366 fill (brand cue) and switch the label to WhatsApp's dark ink. `text-[#0B141A]` on #25D366 measures 9.4:1. Apply in MobileCtaBar.tsx:20, the `whatsapp` variant in components/ui/Button.tsx:13, and the inline link in LeadForm.tsx:217 (use #075E54, 7.7:1 on white, for text-on-white). Do not simply darken the fill to #128C7E — that measures 4.14:1 with white and still misses AA.

```
// components/ui/Button.tsx
whatsapp: "bg-[#25D366] text-[#0B141A] hover:bg-[#1FBF5B]",   // 9.4:1

// components/layout/MobileCtaBar.tsx:20
className="flex items-center justify-center gap-2 bg-[#25D366] py-3.5 font-semibold text-[#0B141A]"

// components/forms/LeadForm.tsx:217
className="inline-flex items-center gap-1 font-semibold text-[#075E54] hover:underline"   // 7.7:1
```

## 5. Validate the phone number and attach errors to the fields that caused them
`high` · impact `high` · effort `M`

**Evidence:** LeadForm.tsx:115 sets `noValidate`, disabling native constraint validation, and the only check is `if (!name || !phone)` at line 48 producing one generic string, 'נא למלא שם וטלפון', rendered at line 196-200 above the submit button — nowhere near the offending field, with no `aria-invalid`, no `aria-describedby`, and no focus move. There is no format check at all: '050' , '05' or a mistyped 9-digit number is accepted, POSTed to Web3Forms and arrives as an uncallable lead. For a business whose entire follow-up model is a phone callback (the message template literally ends 'טלפון לחזרה:'), an unvalidated phone field is a direct revenue leak, and the business only discovers it when the number does not connect.

**Recommendation:** Add an Israeli mobile check, per-field error state, `aria-invalid`/`aria-describedby` wiring, and focus the first invalid field. Normalise the number before sending so the inbox always receives a dialable E.164 string. Accept the formats Israelis actually type: 050-5063152, 0505063152, +972505063152, 972505063152.

```
const IL_MOBILE = /^(?:\+?972|0)5\d(?:[- ]?\d){7}$/;
const toE164 = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^972/, "").replace(/^0/, "");
  return `+972${d}`;
};

const [fieldErrors, setFieldErrors] = useState<{name?:string; phone?:string}>({});

const errs: typeof fieldErrors = {};
if (!name) errs.name = "נשמח לדעת איך לפנות אליכם";
if (!phone) errs.phone = "בלי טלפון לא נוכל לחזור אליכם";
else if (!IL_MOBILE.test(phone)) errs.phone = "מספר לא תקין — נסו שוב, לדוגמה 050-1234567";
if (Object.keys(errs).length) {
  setFieldErrors(errs);
  form.querySelector<HTMLInputElement>(errs.name ? "#lf-name" : "#lf-phone")?.focus();
  trackEvent("form_error", { form: "lead", fields: Object.keys(errs).join(",") });
  return;
}

// on the input
<input id="lf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel"
  aria-invalid={!!fieldErrors.phone}
  aria-describedby={fieldErrors.phone ? "lf-phone-err" : "lf-phone-hint"} … />
<p id="lf-phone-hint" className="mt-1 text-xs text-gray-500">נחזור אליכם בשיחה או בוואטסאפ — לא נשלח דיוור.</p>
{fieldErrors.phone && <p id="lf-phone-err" role="alert" className="mt-1 text-sm font-medium text-red-600">{fieldErrors.phone}</p>}
```

## 6. Make WhatsApp the primary channel and make every deep link carry page context
`high` · impact `transformational` · effort `M`

**Evidence:** WhatsApp reaches ~99% of the Israeli population with 99% daily usage (DataReportal Digital 2025: Israel / JPost, Aug 2025) — it is the default way Israelis contact a business, and the only channel through which a customer can send a photo of their balcony. Yet the string `whatsappHref("היי, אני מעוניין/ת בהצעת מחיר לפרויקט אלומיניום")` is hardcoded identically in Hero.tsx:51, FinalCta.tsx:25, MobileCtaBar.tsx:19, LeadForm.tsx:216 and app/contact/page.tsx:43. FinalCta takes no props (components/marketing/FinalCta.tsx:6) and is rendered on 7 route files including all 16 city pages, so every one of those pages emits the same context-free message. In the built export out/locations/tel-aviv/index.html there are 4 WhatsApp references and not one mentions תל אביב. Sky Shade therefore cannot tell a Tel Aviv pergola enquiry from a Be'er Sheva fence enquiry, and the salesperson opens every chat cold.

**Recommendation:** Give FinalCta a `context` prop and thread the service name / city name through it, so the deep-linked message names the page. Add an explicit photo invitation to the WhatsApp copy — this is the free substitute for the file upload the form cannot do (see the photo-upload finding). Add `data-cta` to every one of these links so GTM can weigh the channels against each other.

```
// components/marketing/FinalCta.tsx
export function FinalCta({ context, waPrompt }: { context?: string; waPrompt?: string } = {}) {
  const heading = context
    ? `רוצים ${context}? בואו נתחיל.`
    : "רוצים לשדרג את החוץ שלכם? בואו נתחיל.";
  const msg = waPrompt ?? `היי, אני מעוניין/ת בהצעת מחיר${context ? ` — ${context}` : ""}. מצרף/ת תמונה של המרחב.`;
…
// app/locations/[city]/page.tsx
<FinalCta context={`פרגולת אלומיניום ב${city.name}`} />
// app/service/[slug]/page.tsx
<FinalCta context={`${card.name} בהתאמה אישית`} />

// MobileCtaBar — invite the photo
whatsappHref("היי, אני מעוניין/ת בהצעת מחיר. אשלח תמונה של המרחב שלי.")
```

## 7. Put a real project photograph in the hero and move `priority` off the logo
`high` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** components/marketing/Hero.tsx:12-19 renders two CSS radial gradients and nothing else — the built out/index.html hero contains zero `<img>`. The only `priority` image on the homepage is the 500×79 logo (Header.tsx:23-30), and it costs a high-priority `<link rel="preload" as="image" imageSrcSet="…width=500…500w, …width=1000…">` in the head for an element painted at 36px tall. Because there is no hero image, the LCP element today is the `<h1>` text, so the site is sitting on real LCP headroom while showing a prospective buyer of a premium aluminium structure a flat navy rectangle. There is also no font preload (0 `woff2` references in out/index.html; the Heebo `@font-face` blocks live inside the 43KB CSS with `font-display:swap`), so the Hebrew headline paints in Arial and swaps.

**Recommendation:** Add an `images.hero` entry to site.config.json, render it in Hero.tsx behind the copy with `priority`, emit `preloadPropsFor(manifest.images, manifest.images.hero, sizes)` in the layout head (the kit already exports this helper at node_modules/@ishub/site-kit/src/media/url.ts:151), and drop `priority` from the Header logo. The `<link rel="preconnect" href="https://imgquarry.com">` is already in place (app/layout.tsx:47-49), which is what keeps this cheap. Budget: cap the mobile derivative at ~120KB (width=1080, quality=75) and keep LCP under 2.5s. Do not use video — an autoplaying hero video pushes LCP past 4s on 4G and burns mobile data, both of which cost more than the emotional lift. Test video on desktop only, later.

```
// site.config.json — images block
"hero": { "key": "skyshade/hero.jpg", "alt": "Sky Shade aluminium pergola over a terrace",
  "altHe": "פרגולת אלומיניום חשמלית מעל מרפסת — פרויקט של סקיי שייד",
  "width": 2400, "height": 1350, "kind": "raster", "focal": { "x": 0.5, "y": 0.4 } }

// app/layout.tsx <head>
{manifest.images?.hero && (
  <link {...preloadPropsFor(manifest.images, manifest.images.hero, "100vw", { fit: "cover" })} />
)}

// components/marketing/Hero.tsx — replace the gradient div
<SiteImage images={manifest.images} image={manifest.images.hero} priority fit="cover"
  sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
<div className="absolute inset-0 bg-primary/70" aria-hidden />

// components/layout/Header.tsx:23-30 — remove `priority`
```

**Risk:** The media catalog cannot supply this photo: across the 55 catalog items the median width is 624px, only 6 are ≥1200px and exactly one (project-6.webp, 1729×647) is ≥1600px. A 624px source stretched full-bleed will look worse than the gradient it replaces. The hero must come from new photography.

## 8. Turn the gallery from a dead-end lightbox into the site's best closing tool
`high` · impact `transformational` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** components/marketing/FilterableGallery.tsx renders 55 tiles into a lightbox whose only control is a close button (lines 111-136). There is no next/prev, no swipe, no counter, no caption, no CTA — a visitor must close and re-open the modal 55 times to browse. out/gallery/index.html contains 0 `<form`. The lightbox `<img>` uses `srcFor(siteImages, lightbox, { fit: "contain" })`, which per node_modules/@ishub/site-kit/src/media/url.ts:110-115 requests `width: ref.width` — the intrinsic width, median 624px across the catalog — then displays it at `max-w-[90vw]`, so on a 1440px desktop the 'premium finish' proof shot is a soft 624px upscale. The dialog also has `role="dialog" aria-modal="true"` with no `aria-label`, no focus trap and no focus restore.

**Recommendation:** Three changes to components/marketing/FilterableGallery.tsx: (1) add prev/next with ArrowLeft/ArrowRight keys and touch swipe, plus an 'N מתוך 55' counter — this is the single biggest lever on time-on-page and photos-per-session; (2) render a CTA inside the lightbox with a WhatsApp deep link that names the project being viewed, so the enquiry arrives already attached to a photo; (3) add a `<LeadForm sourcePage="gallery">` band under the grid in app/gallery/page.tsx. Fix the accessibility at the same time: `aria-label`, focus the dialog on open, restore focus to the originating tile on close. Separately, re-source the gallery originals at ≥2000px — the current median is not good enough to sell a premium product.

```
// FilterableGallery.tsx — lightbox footer
const idx = filtered.findIndex(i => i.key === lightbox.key);
const go = (d: number) => setLightbox(filtered[(idx + d + filtered.length) % filtered.length]);
// keydown: ArrowRight -> go(-1), ArrowLeft -> go(+1)   // RTL: left arrow advances

<div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-center" onClick={e=>e.stopPropagation()}>
  <p className="text-sm text-white/80">{lightbox.category} · {idx + 1} מתוך {filtered.length}</p>
  <p className="mt-1 font-heading text-lg font-bold text-white">רוצים משהו כזה אצלכם?</p>
  <a href={whatsappHref(`היי, ראיתי בגלריה את הפרויקט "${altOf(lightbox)}" ואשמח להצעת מחיר לפרויקט דומה. אשלח תמונה של המרחב שלי.`)}
     data-cta="gallery-lightbox-whatsapp" target="_blank" rel="noopener"
     className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-[#0B141A]">
    <MessageCircle className="h-5 w-5" aria-hidden />
    שלחו לנו תמונה ונחזור עם הערכה
  </a>
</div>
```

**Risk:** Re-shooting or re-exporting 55 originals at ≥2000px is client-dependent; the CTA and navigation work ship independently and should not wait for it.

## 9. Move social proof next to the decision, and fix the trust claims that cannot be checked
`high` · impact `high` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** `grep -rl Reviews app/` returns only app/page.tsx — the three testimonials in lib/content.ts:305-324 appear on the homepage and nowhere else, positioned sixth (after Hero, TrustBar, ServicesGrid, WhyUs, Process, Gallery), which on mobile is roughly 5-6 screens below the form they are supposed to support. The service pages, all 16 city pages, /gallery and /contact carry no social proof at all. Meanwhile lib/content.ts:302-304 flags the testimonials as needing confirmation, lib/content.ts:284-289 marks trustStats the same, and '15+ שנות ניסיון' is hardcoded against a `foundedYear` of 2009 — 17 years as of 2026 and drifting. The hero badge at Hero.tsx:23 reads 'מספר 1 בישראל', an unsubstantiated superlative that Israeli consumer-protection law treats as misleading advertising and that Google Ads disallows in copy pulled from a landing page.

**Recommendation:** Extract a compact `<ProofStrip>` (two testimonials + the warranty line) and render it directly above every LeadForm instance and inside the service-page aside. Derive the years figure from `manifest.foundedYear` instead of hardcoding it. Replace 'מספר 1 בישראל' with something verifiable — 'מאז 2009 · מאות פרויקטים בכל הארץ' — until the client can substantiate a ranking. Confirm the real project/customer counts and whether the three named testimonials are genuine, attributable reviews before they stay on the site.

```
// lib/content.ts
export const yearsInBusiness = new Date().getFullYear() - 2009;  // build-time; see the cron finding
export const trustStats = [
  { value: "500+", label: "פרויקטים" },            // 🔶 confirm
  { value: "200+", label: "לקוחות מרוצים" },       // 🔶 confirm
  { value: `${yearsInBusiness}+`, label: "שנות ניסיון" },
  { value: "100%", label: "אחריות מלאה" },
];

// components/marketing/Hero.tsx:23
<p className="…">מאז 2009 · מאות פרויקטים בכל הארץ</p>
```

**Risk:** If the testimonials are not genuine collected reviews, they must be replaced with real ones rather than moved around — and they must never be marked up as Review/AggregateRating schema.

## 10. Close the measurement gaps: 8 CTAs have no `data-cta` and form abandonment is invisible
`high` · impact `high` · effort `M`

**Evidence:** The kit's own comment (node_modules/@ishub/site-kit/src/analytics/index.ts) states that call and WhatsApp conversions are tracked in GTM off the `data-cta` attribute — but the attribute is missing from eight conversion links. Counted in the built export: out/service/pergolas/index.html has 6 `href="tel:` and only 5 `data-cta` (the aside buttons at app/service/[slug]/page.tsx:127 and :131 have none); out/contact/index.html has 5 `tel:` and 5 WhatsApp references but only 5 `data-cta`, none of them on the contact page's own phone/WhatsApp/email links (app/contact/page.tsx:34, 42, 53). The LeadForm WhatsApp fallback (LeadForm.tsx:215) and the gallery 'לכל הגלריה' link (FilterableGallery.tsx:101) also have none. Separately, `trackEvent` fires only on a confirmed send (LeadForm.tsx:87) — there is no `form_start`, so form abandonment rate cannot be computed at all, and no gallery interaction events, so the 55-photo asset produces no signal.

**Recommendation:** Add `data-cta` to all eight missing links using a `{page-type}-{slot}-{channel}` convention. Add three dataLayer pushes: `form_start` on first field focus (once per page), `form_error` on validation failure, `lead_submit` already exists. Add `gallery_open`, `gallery_next` and `gallery_filter` in FilterableGallery. In GA4 configure scroll milestones at 25/50/75/90 and mark `lead_submit`, `cta_click[channel=call]` and `cta_click[channel=whatsapp]` as conversions. The engagement metrics that actually predict revenue here are: form_start→lead_submit ratio (abandonment), photos viewed per gallery session, scroll depth to the reviews section, and time-to-first-CTA-interaction — none of which are currently instrumented.

```
// LeadForm.tsx
const started = useRef(false);
const onFirstFocus = () => {
  if (started.current) return;
  started.current = true;
  trackEvent("form_start", { form: "lead", source: sourcePage ?? "home" });
};
<form onFocusCapture={onFirstFocus} …>

// FilterableGallery.tsx
onClick={() => { setLightbox(item); trackEvent("gallery_open", { category: item.category, key: item.key }); }}
onClick={() => { setActive(tab); trackEvent("gallery_filter", { tab }); }}

// missing data-cta values to add
// app/contact/page.tsx:34  data-cta="contact-detail-call"
// app/contact/page.tsx:42  data-cta="contact-detail-whatsapp"
// app/contact/page.tsx:53  data-cta="contact-detail-email"
// app/service/[slug]/page.tsx:127  data-cta="service-aside-call"
// app/service/[slug]/page.tsx:131  data-cta="service-aside-whatsapp"
// components/forms/LeadForm.tsx:215  data-cta="leadform-whatsapp"
// components/layout/Footer.tsx:27  data-cta="footer-email"
// components/marketing/FilterableGallery.tsx:101  data-cta="home-gallery-more"
```

## 11. Rewrite the highest-impact Hebrew micro-copy
`high` · impact `high` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** The message field is labelled 'פרטים על הבעיה (אופציונלי)' (LeadForm.tsx:173) — 'details about the problem'. This is residue from a break/fix home-services template and it frames a discretionary premium design purchase as a fault report; nobody buying a designed pergola has a 'בעיה'. The submit button reads 'שליחה וקבלת הצעת מחיר' (line 210), which leads with the user's cost ('sending') before their benefit. The sending state 'שולח…' is masculine singular while the entire site addresses the visitor in the plural ('קבלו', 'חייגו', 'השאירו'). The success message 'צריכים מענה מיידי? התקשרו אלינו.' (line 105) is plain text with no `tel:` link. The service select's placeholder option is 'בחירת שירות…', a noun phrase rather than an instruction.

**Recommendation:** Apply the rewrites below to components/forms/LeadForm.tsx, components/marketing/Hero.tsx:63-68, components/layout/MobileCtaBar.tsx and components/marketing/FinalCta.tsx. Every string is plural-address, benefit-first, and RTL-safe. The only line requiring a business fact is the response-time promise — do not publish '24 שעות' or 'תוך שעה' until the client confirms what they can actually hold to; the fallback 'נחזור אליכם בהקדם' is safe but converts worse.

```
/* — Hero form card (Hero.tsx:63-68) — */
h2: "קבלו הצעת מחיר — בלי התחייבות"
p : "שם וטלפון זה כל מה שצריך. מגיעים אליכם למדידה ללא עלות ומחזירים הצעה מפורטת ושקופה."

/* — Fields — */
"שם מלא"                          →  "שם"
"טלפון"                           →  "טלפון נייד"
   hint (new): "נחזור אליכם בשיחה או בוואטסאפ. לא נשלח דיוור."
"השירות שמעניין אתכם (אופציונלי)" →  "מה מעניין אתכם?"
   option value=""                 →  "בחרו שירות (לא חובה)"
"פרטים על הבעיה (אופציונלי)"      →  "ספרו לנו על הפרויקט (לא חובה)"
   placeholder                     →  "לדוגמה: פרגולה חשמלית למרפסת 4×3 מ׳, קומה 3, יציאה מהסלון"

/* — Submit button (test A vs B) — */
A (control-plus): "קבלו הצעת מחיר חינם"
B (first person): "אני רוצה הצעת מחיר"
sending state:    "שולח…"  →  "רגע, שולחים…"

/* — Reassurance strip, directly under the submit button — */
"ייעוץ ומדידה ללא עלות · הצעה שקופה בלי אותיות קטנות · אחריות מלאה"

/* — Success state (LeadForm.tsx:101-106) — */
h : "תודה! הפנייה אצלנו"
p : "נחזור אליכם בשעות הפעילות (א׳–ה׳ 08:00–18:00). רוצים להאיץ? שלחו לנו תמונה של המרחב בוואטסאפ."
+ two real buttons: tel: (accent) and WhatsApp (green)

/* — Mobile sticky bar (3-up) — */
[ וואטסאפ ] [ חייגו ] [ הצעת מחיר ]

/* — FinalCta with context — */
service: "רוצים {שם השירות} בהתאמה אישית? קבלו הצעת מחיר."
city   : "רוצים פרגולת אלומיניום ב{עיר}? בואו נתחיל."
sub    : "ייעוץ, מדידה והצעת מחיר שקופה — ללא עלות וללא התחייבות."

/* — Gallery page, above the grid — */
"55 פרויקטים שביצענו. רוצים שהבא יהיה שלכם?"
```

## 12. Rebuild the mobile sticky bar as a three-channel bar and test the ordering
`medium` · impact `high` · effort `S`

**Evidence:** components/layout/MobileCtaBar.tsx is a two-column grid: gold 'חייגו עכשיו' first (which in RTL puts it on the right, the primary visual position) and green 'וואטסאפ' second. Given ~99% WhatsApp penetration in Israel, the phone is occupying the dominant slot for the channel with higher friction — a call demands the visitor be somewhere they can talk, during 08:00-18:00, whereas WhatsApp works at 23:00 from a sofa and lets them attach a photo. The bar also offers no route to the form: on the 26 pages that have no form, a visitor who wants a written quote has nowhere to go. Positively, both are plain `<a>` elements that work with no JS, and app/layout.tsx:68 adds a spacer so the footer is never covered — that part is correct and should be preserved.

**Recommendation:** Go three-up: WhatsApp | חייגו | הצעת מחיר, with the third linking to `/contact/#lead` (or scrolling to the in-page form when one exists). Keep every item a plain anchor. Give WhatsApp the visually dominant treatment and A/B test the right-most slot (WhatsApp vs phone) — this is one of the few tests on this site with a large enough effect to detect at realistic traffic. Increase the layout spacer from `h-16` to match the taller bar.

```
// components/layout/MobileCtaBar.tsx
<div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
  <a href={whatsappHref("היי, אני מעוניין/ת בהצעת מחיר. אשלח תמונה של המרחב שלי.")}
     data-cta="sticky-whatsapp"
     className="flex flex-col items-center justify-center gap-0.5 bg-[#25D366] py-3 text-sm font-bold text-[#0B141A]">
    <MessageCircle className="h-5 w-5" aria-hidden />וואטסאפ
  </a>
  <a href={telHref} data-cta="sticky-call"
     className="flex flex-col items-center justify-center gap-0.5 bg-accent py-3 text-sm font-bold text-accent-foreground">
    <Phone className="h-5 w-5" aria-hidden />חייגו
  </a>
  <Link href="/contact/#lead" data-cta="sticky-form"
     className="flex flex-col items-center justify-center gap-0.5 bg-primary py-3 text-sm font-bold text-white">
    <FileText className="h-5 w-5" aria-hidden />הצעת מחיר
  </Link>
</div>
// app/layout.tsx:68 — spacer
<div className="h-[68px] lg:hidden" aria-hidden />
```

## 13. Give customers a way to send a photo of their space
`medium` · impact `high` · effort `M`

**Evidence:** There is no file input anywhere in LeadForm.tsx, and Web3Forms' free plan does not support file attachments (attachments are a Pro feature at $12/month; the free tier is capped at 250 submissions per month and includes hCaptcha and custom redirects). For an outdoor-structures quote, a photo of the balcony or yard is the single most valuable field on the form — it lets Sky Shade give a meaningful number without a site visit and materially shortens the sales cycle. The 250/month cap is also a silent-failure risk: a spam flood against the public access key (4f939db2-…, necessarily exposed in the client bundle) could exhaust the quota and start dropping genuine leads with no alert.

**Recommendation:** Ship the zero-cost answer first: make 'שלחו לנו תמונה בוואטסאפ ונחזור עם הערכה' an explicit, repeated CTA (hero, gallery lightbox, service asides, form success state) — it exploits the channel 99% of the market already has open and requires no backend. If enquiry volume justifies it, add real upload via a Cloudflare Pages Function issuing a presigned R2 PUT (the site already sits behind Cloudflare and already uses imgquarry.com for media), with the object URL appended to the Web3Forms payload; a static export cannot do this without that runtime. Separately, harden the form against quota exhaustion: keep the existing honeypot (LeadForm.tsx:185-194), add Web3Forms' native `botcheck` hidden field and a submit-time trap that rejects anything faster than ~3 seconds. Do not add a visible CAPTCHA — hCaptcha on a two-field form costs more conversions than it saves leads at this volume.

```
// LeadForm.tsx — cheap spam hardening, no conversion cost
const mountedAt = useRef(Date.now());
if (Date.now() - mountedAt.current < 3000) return;      // time trap
<input type="checkbox" name="botcheck" className="hidden" style={{display:"none"}} tabIndex={-1} aria-hidden />

// Later, if uploads are wanted (needs a runtime):
// functions/api/upload.ts  — Cloudflare Pages Function
// POST -> returns { url, key } from an R2 presigned PUT; client PUTs the file,
// then sends `photo_url` in the Web3Forms JSON body.
```

**Risk:** Web3Forms' 250/month ceiling and its pricing should be re-verified before committing; and the R2 upload path adds a runtime dependency the rest of the site does not have.

## 14. Add a consent line at the form — legally required and a measurable trust lever
`medium` · impact `medium` · effort `S` · **NEEDS CLIENT INPUT**

**Evidence:** There is no privacy or consent micro-copy anywhere near the submit button in LeadForm.tsx — the button at line 202 is followed only by the WhatsApp alternative at line 213. Amendment 13 to the Israeli Privacy Protection Law took effect on 14 August 2025 and explicitly covers a brochure site that collects contact details through a form; the personal data here is additionally transmitted to a third-party US processor (Web3Forms) which app/privacy/page.tsx does not name. Separately, the form gives no indication of how the details will be used, which is exactly the uncertainty that produces abandonment at the final field.

**Recommendation:** Add one line of Hebrew micro-copy between the submit button and the WhatsApp link, linking to /privacy. Frame it as reassurance rather than legalese — 'we will not pass your details on' reliably lifts completion rather than depressing it. Then update app/privacy/page.tsx to name Web3Forms as the processor, state what is collected (name, phone, service, free-text) and for how long it is retained. Have a lawyer confirm the wording against Amendment 13 and the anti-spam provisions of the Communications Law before it goes live.

```
// LeadForm.tsx — between the submit button and the WhatsApp line
<p className="text-center text-xs leading-relaxed text-gray-500">
  בשליחת הטופס אתם מאשרים שניצור אתכם קשר בטלפון או בוואטסאפ בנוגע לפנייה בלבד.
  הפרטים לא מועברים לצד שלישי.{" "}
  <Link href="/privacy" className="underline hover:text-gray-700">מדיניות הפרטיות</Link>
</p>
```

## 15. Build a seasonality mechanism — the static export currently has none
`medium` · impact `medium` · effort `M` · **NEEDS CLIENT INPUT**

**Evidence:** No urgency, deadline or seasonal messaging exists anywhere in the copy — lib/content.ts, Hero.tsx and FinalCta.tsx are entirely evergreen. More fundamentally the site has no way to express it: .github/workflows/deploy.yml triggers only on `push` to main and `workflow_dispatch`, with no `schedule:` block, so any build-time date logic freezes at the last commit. The same staleness already shows in components/layout/Footer.tsx:7, `const year = 2026; // static export — keep build deterministic; update yearly`, and in the '15+ שנות ניסיון' stat. Israeli outdoor-construction demand is not evenly distributed across the year — shading and pergola enquiries cluster ahead of summer and ahead of the autumn holidays, and balcony-closing / wind-barrier products (the accordion range) cluster in late autumn — but none of that is reflected in the site.

**Recommendation:** Two parts. (1) Add a monthly cron to .github/workflows/deploy.yml so build-time date logic stays current — this simultaneously fixes the hardcoded footer year, the years-in-business stat, and the stale sitemap lastmod. (2) Add a small `<SeasonalBanner>` above the header that swaps message by build month, plus a seasonal reorder of the service grid (surface accordion products in Oct-Dec, pergolas in Feb-May). Reserve its height in CSS so it never causes CLS. The specific peaks and any production-lead-time deadline must come from the client's own enquiry data — do not publish 'the schedule is filling up' or a dated cutoff unless it is true.

```
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  schedule:
    - cron: "0 3 1 * *"     # 1st of each month, keeps date-derived copy fresh
  workflow_dispatch:

// components/marketing/SeasonalBanner.tsx  (server component, build-time month)
const month = new Date().getMonth() + 1;   // 1-12 at build
const copy =
  month >= 2 && month <= 5
    ? "מתכננים פרגולה לקיץ? הייצור וההתקנה לוקחים כמה שבועות — זה הזמן למדוד."   // 🔶 confirm lead time
  : month >= 10 && month <= 12
    ? "החורף בפתח: סגירת מרפסת ומחסומי רוח מאלומיניום וזכוכית — ייעוץ ומדידה ללא עלות."
    : null;
// render into app/layout.tsx above <Header />, with min-height reserved
```

**Risk:** Fabricated scarcity ('רק 3 מקומות נותרו') is both an Israeli consumer-protection exposure and a trust destroyer for a high-ticket considered purchase. Only ship urgency that is factually true.

## 16. Don't multi-step the lead form — build a spec picker on the service pages instead
`medium` · impact `high` · effort `L` · **NEEDS CLIENT INPUT**

**Evidence:** The current form has four fields, of which two are required (LeadForm.tsx:48). Splitting a two-required-field form into steps adds interaction cost without reducing perceived length and typically loses conversions — multi-step wins are found on forms of six or more fields. The genuine opportunity is elsewhere: the six service pages have no capture device at all, and the form's own placeholder already reveals what the business needs to quote — 'פרגולה חשמלית למרפסת בגודל 4×3 מ׳' (LeadForm.tsx:180) — i.e. product, dimensions and location, currently begged for in a free-text box that most visitors will leave empty.

**Recommendation:** Keep the homepage form single-step (it is correctly short). On service pages, ship a three-tap spec picker that ends in name+phone: step 1 pre-filled with the page's service, step 2 an approximate size band, step 3 material/finish, then contact details. Every tap is a commitment that raises completion, and the resulting lead arrives already qualified. Track it as a separate GA4 event stream (`configurator_step`) so it can be judged against the plain form. Do NOT display estimated prices unless the client supplies real per-square-metre ranges they will honour — a wrong number on screen costs more trust than the estimator gains.

```
// components/forms/QuoteWizard.tsx — steps, no prices
const SIZES = ["עד 12 מ״ר", "12–25 מ״ר", "25–50 מ״ר", "מעל 50 מ״ר", "עדיין לא יודע/ת"];
const FINISH = { pergolas: ["פרגולה ידנית", "פרגולה חשמלית", "חיפוי פוליקרבונט", "חיפוי זכוכית", "גג עץ"], … };
// step 3 -> name + phone, POSTs the same Web3Forms payload plus
//   { service, size_band, finish, source_page } so the inbox gets a briefed lead
// heading: "3 שאלות קצרות ונחזור אליכם עם הצעה מדויקת"
// step labels: "מה בונים?" · "איזה גודל בערך?" · "איזה סוג?" · "לאן נחזור אליכם?"
```

**Risk:** A price estimator that quotes low and is then corrected upward at the site visit converts leads into complaints. Ship the spec picker without prices first; add ranges only once the client signs off on them.

## 17. Add scroll-triggered re-engagement; keep exit intent to desktop only
`low` · impact `medium` · effort `M`

**Evidence:** There is no exit-intent, scroll-triggered or dwell-triggered re-engagement anywhere in the codebase — no `mouseleave`, no `IntersectionObserver` beyond the decorative `Reveal` component (components/ui/Reveal.tsx). A visitor who scrolls the full homepage passes the hero form at the top and then meets nothing until FinalCta at the very bottom; on the 26 form-less pages there is no capture device at all between the header and the footer.

**Recommendation:** Two mechanisms, deliberately different by device. Desktop: a single exit-intent panel on `document.documentElement` pointerleave from the top edge, gated by `sessionStorage`, offering a callback ('נחזור אליכם — השאירו טלפון ונתקשר'). Mobile: never an interstitial — instead reveal an inline CTA card at ~60% scroll depth, inserted into the flow so it pushes rather than overlays. Both should push `reengage_shown` / `reengage_convert` to the dataLayer so the lift is measurable rather than assumed.

```
// components/marketing/ExitIntent.tsx  ("use client")
useEffect(() => {
  if (!window.matchMedia("(pointer: fine)").matches) return;      // desktop only
  if (sessionStorage.getItem("ss-exit")) return;
  const onLeave = (e: PointerEvent) => {
    if (e.clientY > 0) return;
    sessionStorage.setItem("ss-exit", "1");
    setOpen(true);
    trackEvent("reengage_shown", { kind: "exit_intent" });
  };
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => document.documentElement.removeEventListener("pointerleave", onLeave);
}, []);
// Modal: focus trap, Esc to close, one field (phone) + submit.
```

**Risk:** Google treats mobile interstitials that obscure content as an intrusive-interstitial ranking signal; an exit-intent modal on mobile is also unreliable (there is no real 'exit' gesture) and often fires on scroll-up. Restrict strictly to `matchMedia('(pointer: fine)')`.

## 18. Run the A/B backlog in the right order — and accept that most of it should ship untested
`medium` · impact `medium` · effort `M`

**Evidence:** A local Israeli contractor site does not generate the traffic classic A/B testing needs. At a 3% form-conversion baseline, detecting a +20% relative lift at 80% power and 95% confidence requires roughly 14,000 sessions per arm — for this site that is many months per test, during which the losing arm is costing real leads. Meanwhile several of the items in this report are not hypotheses at all: a form that silently swallows failures, a WhatsApp button at 1.98:1 contrast, and 26 pages with no capture device are defects, and A/B testing a defect against its fix is a way of delaying the fix.

**Recommendation:** Ship tier 1 without testing, measure before/after with a 4-week window and guardrails (total leads, call clicks, WhatsApp clicks, bounce). Reserve true A/B for the small number of genuine coin-flips with large expected effects. Ranked backlog: (T1, ship now, expected combined lift on total leads +40-80%) — fix the silent submit failure; add the native form action; put a form on the service, city and gallery pages; fix WhatsApp contrast; add phone validation; make the success state actionable; add page context to every WhatsApp deep link; complete the data-cta coverage and add form_start. (T2, A/B worth running, ranked by expected lift × detectability) — 1. hero photograph vs the current gradient, primary metric CTA-click rate not form submits, because the effect should be large and CTA clicks are ~10x more frequent than submissions so the test resolves far sooner; 2. mobile sticky bar order, WhatsApp-first vs phone-first, two-up vs three-up, measured on sticky-bar click rate; 3. submit button copy, 'קבלו הצעת מחיר חינם' vs 'אני רוצה הצעת מחיר'; 4. gallery lightbox CTA present vs absent, measured on gallery_open → whatsapp_click; 5. service-page spec picker vs the plain LeadForm, measured on leads per service-page session; 6. reassurance strip under the submit button, present vs absent. (T3, only once volume supports it) — seasonal banner variants, exit-intent panel, testimonial placement above vs below the form. Instrument every test on high-frequency proxy metrics (CTA clicks, form_start, gallery_open) rather than on submissions alone, or nothing will ever reach significance.

**Risk:** Running more than one test at a time on this traffic level guarantees uninterpretable results. Sequence them, one at a time, four weeks minimum each, and hold total lead volume as the guardrail so a proxy-metric win that costs real leads gets caught.