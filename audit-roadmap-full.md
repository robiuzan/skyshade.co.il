# skyshade.co.il — Growth Plan (Definitive)

**Prepared for:** the developer maintaining this repo, working with Yossi (owner)
**Date:** 2026-08-17 · **Basis:** 15-track adversarially-verified audit + completeness critique · **Site:** Next.js 14 static export → GitHub Pages, fronted by Cloudflare

---

## 1. Executive summary

skyshade.co.il is a technically clean, well-built brochure site that almost nobody — human or machine — can find, verify, or measure: Cloudflare serves HTTP 403 to every AI crawler, Search Console has never been verified, GA4 receives page views and nothing else, and the brand's own name search surfaces competitors. The single biggest constraint is not code, it is **corroborated substance**: the site has no Google Business Profile, no reviews, no prices, no named human, no address or ח.פ., 16 doorway-pattern city clones, and 55 project photos with zero facts attached — while the SERPs it must win are decided by exactly those things. A secondary but urgent constraint is **legal exposure already live on the site**: a wrong building-permit claim (shipped in copy *and* FAQ schema), a false "no third parties" privacy claim, developer-completed testimonials under real customers' names, and a false accessibility-contrast claim. This plan first ships the already-committed work and fixes the false claims, then turns on measurement and unblocks the machines (week 1), then builds the entity, trust and conversion infrastructure (weeks 2-6), then converts the photo library and the owner's knowledge into the only content in this market that competitors cannot template: real projects, real prices, and accurate regulation (weeks 4-16). Roughly a third of the highest-value work is blocked on a single structured intake session with Yossi — that session is the critical path and is scheduled in week 1. Expect head-term movement in 4-6 months and lead-flow evidence within 6-8 weeks of the measurement stack going live; directories will keep the top organic slots on head terms, which is why the plan wins on local-pack, long-tail, and evidence pages instead.

## 2. The strategic thesis

In Israeli home-improvement search, the buying decision happens in the Google local pack, in WhatsApp, and on price-led SERPs dominated by directories (מידרג, B144) that an SMB cannot outrank on head terms — so the winning move is not "more pages," it is **becoming a verifiable entity**: one Google Business Profile with real reviews, one consistent NAP across the citations Israelis actually use, and a site whose every claim (price band, permit rule, warranty year, project city) is true and checkable. Sky Shade's two unfair assets are 17 years of real projects (55 photos, currently mute) and the fact that no ranked Israeli installer publishes accurate מצללה (pergola/statutory shading structure) regulation or honest per-m² pricing — both are content only the owner can substantiate and no directory can copy. Because the market is Hebrew, mobile, and WhatsApp-first, conversion work (form on every money page, WhatsApp weighting, photo-based quoting) compounds every ranking gain immediately. The sequence is therefore: measure → unblock → verify entity → substantiate → expand; expansion before substantiation would simply scale the doorway pattern the domain already carries.

## 3. Scorecard

| # | Dimension | Rating | Justification |
|---|---|---|---|
| 1 | Technical SEO & indexation | **Good** | Clean SSR HTML, correct self-canonicals, real 404, sane URLs — but no GSC/Bing, www serves a 200 mirror, zero legacy-WP redirects, and the committed fixes sit undeployed on `media-pipeline`. |
| 2 | Structured data | **Fair** | Competent LocalBusiness/Service/FAQ base (a genuine edge — no inspected competitor has it), but the entity exists on one page, `sameAs`/address/geo are empty, areaServed is a slogan string, and 5 hub pages ship zero JSON-LD. |
| 3 | Content depth | **Weak** | ~866 visible words on home, ~250 unique per service page, 16 byte-identical city clones (~110 unique words each), zero informational content. |
| 4 | Keyword targeting & IA | **Weak** | 36 URLs chase ~8 concepts; the market's three biggest intents (מחיר/price, היתר/permit, comparisons) have no owning page; one service is named a phrase nobody searches. |
| 5 | GEO / AEO | **Critical** | Cloudflare 403s every AI crawler and user-triggered fetcher; Cloudflare's managed robots.txt silently disallows GPTBot/ClaudeBot/Google-Extended over the repo's Allow-all. The site cannot be cited or even opened by assistants. |
| 6 | E-E-A-T & trust | **Critical** | Developer-completed testimonials under real names, 🔶-unconfirmed stats, no legal entity/ח.פ., no address, no named human, "אחריות מלאה" ×19 pointing at nothing. |
| 7 | Local SEO | **Critical** | No GBP, no citations, empty `sameAs`; brand SERP lost to Skyroof/Skylite; city pages are the canonical doorway pattern. |
| 8 | CRO & lead capture | **Fair** | Excellent 2-field form with WhatsApp recovery — but on only 2 of 36 pages; gradient hero on a visual product; gallery is a dead end; zero funnel events. |
| 9 | Navigation & internal linking | **Good** | Complete flat lattice, no orphans, normalized anchors; missing contextual in-prose links, service→city edges, and gallery category URLs. |
| 10 | Performance / CWV | **Good** | Lean JS (~121KB gz first-party), solid CLS, no framer in bundle; delivery-layer leaks: no cache rules (HTML DYNAMIC), 1000px logo fetched first on every page, lazy LCP on /gallery/, GTM doubles page JS. |
| 11 | Security, privacy & legal | **Weak** | Small attack surface, but 5 security headers missing, spoofable email (no DMARC), false privacy-policy claim, no consent mechanism, accessibility statement short of תקנה 35ה. |
| 12 | Analytics & feedback loop | **Critical** | GTM container has one tag; `lead_submit` dies in the dataLayer; tel/WhatsApp clicks invisible; no GSC; every other recommendation is currently unfalsifiable. |
| 13 | Competitive position | **Weak** | Outgunned by directories, national brands, and price-led SMEs; zero prices, zero variant pages, zero reviews; sole edge is schema + un-templated honesty available to it. |
| 14 | Hebrew query coverage | **Weak** | Committed title rewrites (undeployed) fix the worst; still no money modifiers live, no ownership of מחיר/היתר clusters, morphology conventions undocumented. |
| 15 | Israeli regulatory compliance | **Critical** | Legally wrong permit answer live in copy + schema; privacy policy materially incomplete/false; no spam-law consent path; contrast claim in the accessibility statement is verifiably false. |

## 4. Phased roadmap

### Phase 0 — Foundations and quick wins (days 1-7)

**Goal:** ship the work that already exists, stop publishing false claims, turn on measurement, unblock the machines, and schedule the owner intake that gates everything else. Everything here is config, copy, or a one-file diff.

| Action | Files / Where | Effort | Impact | Owner |
|---|---|---|---|---|
| **Merge & deploy the `media-pipeline` branch** (title rewrites, sitemap lastmod fix, canonicals, image catalog). Half the audit's "already done" items live only on this branch. | Git: merge → `main` → Pages deploy | S | High | Dev |
| Commit the baseline before anything else changes: `baseline-seo-snapshot.json` (already in repo, untracked) + create `docs/measurement-plan.md` with a dated change log | repo root, `docs/` | S | High (enables all attribution) | Dev |
| Create `docs/keyword-map.md` (one keyword → one owning URL; see §5) and `docs/seo-guardrails.md` (the bright lines in §9) — **before any page is written** | `docs/` | S | High | Dev |
| **The single Cloudflare session** — execute the consolidated rules spec in §6.2 in one sitting: AI-crawler unblock + managed-robots.txt off; www→apex 301; `/project-*.webp` wildcard 301; security headers; HSTS; cache rules; X-Robots-Tag on `.txt`. Then verify: UA curl matrix (AI bots = 200), `robots.txt` shows only the repo's Allow, and **link previews unfurl** (curl as `facebookexternalhit/1.1` + WhatsApp UA; check og:image fetchable) | Cloudflare dashboard (zone skyshade.co.il) | M | Transformational | Dev (owner grants access) |
| Same session, own infra: fix **imgquarry.com robots.txt** (currently blocks GPTBot/ClaudeBot/Google-Extended — without this the 55 photos stay invisible to multimodal/Gemini retrieval) and raise origin `Cache-Control` from `max-age=300` to `public, max-age=86400, stale-while-revalidate=604800` | Media Studio / imgquarry worker | S | High | Dev |
| **Verify Search Console** (Domain property, DNS TXT in Cloudflare) → submit `https://skyshade.co.il/sitemap.xml`; Bing Webmaster via "Import from GSC". Same DNS session: **DMARC** `p=none` record + **CAA** records (§6.2) | Cloudflare DNS; GSC/Bing | S | High | Both (owner's Google account) |
| **GTM session:** add GA4 event tags per §6.3 (generate_lead, lead_submit_failed, phone_call_click, whatsapp_click), mark Key Events, audit container users + 2FA, enable publish notifications | GTM-KWGGH438, GA4 G-BRZ0S93NFS | S | Transformational | Dev |
| Move GTM bootstrap into `<head>`; add missing `data-cta` labels (`contact-call/whatsapp/email`, `service-aside-call/whatsapp`) | `app/layout.tsx:67`, `app/contact/page.tsx`, `app/service/[slug]/page.tsx` | S | Medium | Dev |
| **Fix the four live false claims (stop-ship items):** (1) rewrite both wrong permit FAQ answers (`lib/content.ts:124-126` and `:358-360` — add the 40%-openings rule, greater-of-50m²/¼-area, הנחיות מרחביות, 45-day report duty; copy in §6.4); (2) rewrite the privacy policy (`app/privacy/page.tsx` — delete/qualify "בלבד", disclose Web3Forms + GTM/GA, rights, retention, date); (3) darken footer contrast (`Footer.tsx`: `text-white/70`→`/85`, `/60`→`/75`) **before** amending the accessibility statement (date, WCAG 2.1 ref, complaint route to נציבות שוויון); (4) **pull the three named testimonials** — replace the section with process/warranty messaging until verbatim sources + consent arrive | `lib/content.ts`, `app/privacy/page.tsx`, `components/layout/Footer.tsx`, `app/accessibility/page.tsx`, testimonial component | M | High (removes live legal exposure) | Dev |
| LeadForm legal minimum, same release as the privacy rewrite: privacy-notice line under submit + separate **unchecked** marketing-consent checkbox passed in the Web3Forms payload; fix the "פרטים על הבעיה" label → "ספרו לנו על הפרויקט (אופציונלי)" | `components/forms/LeadForm.tsx` | S | High (unlocks lawful nurture) | Dev |
| `deploy.yml`: add monthly cron rebuild (`schedule: cron '0 4 1 * *'`) — the keystone for seasonal copy, build-time years, and any future rating display — plus Cloudflare cache-purge step and IndexNow ping step (key file in `public/`) | `.github/workflows/deploy.yml` | S | Medium | Dev |
| Repo hygiene: delete inert `public/.htaccess`; fix stale cPanel comment in `next.config.mjs`; README section "all redirects/headers live in Cloudflare Rules"; add `.github/dependabot.yml` (npm + actions, weekly); pin actions to SHAs; `npm uninstall framer-motion`; document the 8 npm-audit flags as static-export-inapplicable | repo root, `.github/` | S | Low-Med | Dev |
| `about` title fix: `title: "מי אנחנו"` (kills doubled brand) | `app/about/page.tsx:11` | S | Low | Dev |
| Create `docs/access-register.md` (private): who holds Cloudflare, GitHub, GTM/GA, Web3Forms, imgquarry, registrar, future GBP — 2FA on each; test lead deliverability end-to-end and add a second recipient/webhook in Web3Forms | docs + accounts | S | Medium (resilience) | Both |
| **Schedule the consolidated owner-intake session** (§7) and send Yossi the question list; owner starts **GBP creation** (verification takes days — begin now; check for a dormant WordPress-era profile first) | Calendar; business.google.com | S | Critical path | Business |

### Phase 1 — Structural and technical (weeks 2-6)

**Goal:** one coherent entity graph, real off-site corroboration, redirects and headers finished, conversion capture on every money page, accessibility defensible, and the city-page doorway resolved. Consent Mode ships at the *end* of this phase (wave 2), after four clean weeks of baseline.

| Action | Files / Where | Effort | Impact | Owner |
|---|---|---|---|---|
| **Entity graph v2** (full spec §6.1): business node site-wide via layout; `WebSite` node (no SearchAction); `@graph` wiring with stable `@id`s; areaServed = Country + 16 City nodes; PostalAddress (city-level, from intake); `hasMap`, `contactPoint`, `hasOfferCatalog`, `knowsAbout`, `slogan`; Service nodes get `@id`/images/`mainEntityOfPage`; typed WebPage on the 5 bare hubs; fix site-kit `serviceJsonLd` `/services/`→`/service/` bug **upstream** in the hub package | `app/layout.tsx`, `@ishub/site-kit` source → re-vendor, `site.config.json` (via hub roster), page files | M | High | Dev |
| Breadcrumb JSON-LD from `PageHeader` (single source; normalize crumb hrefs to trailing slash); delete duplicated per-template calls | `components/layout/PageHeader.tsx`, service/city templates | S | Medium | Dev |
| **Logo pair, one change:** catalog `skyshade/logo.webp` width→240 (header srcset, fixes the 64KB priority fetch on all pages) + new `skyshade/logo-square.png` 512×512 (schema ImageObject only) | Media Studio catalog + `site.config.json` sync; site-kit `url.ts` DPR srcset | S | Medium | Dev |
| **Profiles + citations week** (after intake): GBP buildout per the verified spec — name exactly "סקיי שייד" (never keyword-appended), category Carport and pergola builder + secondaries, hidden address SAB, 16+4 service areas, 20+ photos, UTM'd link; Facebook page named "סקיי שייד" (descriptor in the bio), Instagram; Tier-1 citations: מידרג, B144, דפי זהב, easy.co.il — identical NAP everywhere; then fill `schema.sameAs` + `siteConfig.social` and render footer social links + legal line (שם רשמי, ח.פ.) | business.google.com, directories, `site.config.json` (hub), `components/layout/Footer.tsx` | M | Transformational | Both |
| **Review loop live:** GBP short link; day-after-install WhatsApp ask to **every** customer (template in finding set), owner replies within 48h. Never incentivize, never gate | Owner process | S | Transformational | Business |
| **Legacy-URL recovery:** discover (Wayback CDX + GSC 404 report + free backlink export) → map old→closest new page (never blanket-to-home) → Cloudflare Bulk Redirects (free plan: 10k URLs / 15 rules — sufficient); include `?p=/page_id=` catch-all if discovery shows ugly permalinks; Hebrew slugs percent-encoded | Cloudflare Bulk Redirects | M | Medium-High | Dev |
| **Performance batch:** eager first gallery row (`eagerCount={3}` on /gallery/ only); verify/inject Heebo font preloads (postbuild script if Next 14 still omits); gallery `sizes` fix (350px cap); lightbox `maxWidth:1600, quality:75` + loading state; `defaultQuality` 80→75; CSS-visibility tab filtering; `cv-auto` utility on below-fold home sections | site-kit, `FilterableGallery.tsx`, `app/gallery/page.tsx`, `scripts/`, `site.config.json`, `globals.css` | M | Medium | Dev |
| **CRO batch 1:** LeadForm on all 6 service pages (service pre-selected) + compact form on city pages; `form_start` event; corrected IL phone validation `/^0(?:[23489]\d{7}|[57]\d{8})$/` after normalizing +972 (the audit's first regex rejected all 07X lines — use this one) + aria-invalid/describedby + E.164 in payload; success state (role=status, focus, real SLA from intake, WhatsApp continuation); WhatsApp header button + context-aware prefills (city/service) + the photo-ask line ("צלמו את המרפסת ושלחו בוואטסאפ"); sticky-bar iOS safe-area + `viewportFit:'cover'`; gallery lightbox prev/next + category-aware WhatsApp CTA + events | `LeadForm.tsx`, `Hero.tsx`, `Header.tsx`, `MobileCtaBar.tsx`, `FilterableGallery.tsx`, `app/layout.tsx`, page templates | M | High | Dev |
| **Hero photo** (owner picks one flagship electric pergola shot): art-directed per the LCP playbook — `fetchPriority="high"`, srcset 640/960/1440 via cdn-cgi, preload with imagesrcset, logo demoted from priority, ≤120KB AVIF budget, gradient fallback | `components/marketing/Hero.tsx`, `app/page.tsx` | M | High | Both |
| **Accessibility:** skip link ("דילוג לתוכן הראשי") + `id="main"`; lightbox focus trap + restore; documented WCAG 2.1 AA pass (axe + NVDA on `out/`) → date feeds the statement | `app/layout.tsx`, `FilterableGallery.tsx`, audit doc | M | Medium (litigation defense) | Dev |
| **City-page decision executed** (from intake data): keep the 6-8 cities with real project history for enrichment (Phase 2); **301 the rest to `/locations/`** via Cloudflare now; remove from sitemap/footer; re-add only when a city passes the evidence gate. "Leave as-is" is not an option the spam analysis permits | Cloudflare, `lib/site-config.ts`, `app/sitemap.ts`, `Footer.tsx` | M | High | Both |
| **Display-name edits (flow to H1/nav/schema in one edit each):** `services[0].name` → "פרגולות אלומיניום, מחסות וגגות"; `services[5].name` → **"סגירת מרפסות ותריסי אקורדיון"** (resolved from three competing specs — leads with the head term, plural matches query form); `services[3].name` → "דקים — סינטטי ועץ"; align `serviceMeta` copy; rewrite accordion `about` to open with סגירת מרפסת | `lib/site-config.ts:60-66`, `lib/content.ts` | S | High | Dev |
| **Home title/H1 final state, then 90-day freeze:** home goes brand + broad category ("סקיי שייד — פתרונות אלומיניום לחצר, לגינה ולמרפסת"); `/service/pergolas/` becomes sole owner of the head term (H1 "פרגולות אלומיניום — ידניות וחשמליות"). This deliberately reverses part of the shipped keyword-first home title — once, with the change-log entry | `app/layout.tsx`, `app/page.tsx`, `lib/content.ts` | S | Medium | Dev |
| `/warranty/` page from intake terms (per-component years, exclusions, service channel); convert the 19 "אחריות מלאה" mentions into links to it. Note: for motorized components a written 1-year certificate is already legally mandated (תקנות אחריות ושירות תשס"ו-2006); structure/workmanship terms are whatever the owner commits to in writing | new `app/warranty/page.tsx`, sitewide copy | M | High | Both |
| Nav polish: "בית" first mobile item + scrollable mobile menu; footer column headings linked to `/services/` and `/locations/` | `components/layout/Header.tsx`, `Footer.tsx` | S | Low | Dev |
| **Wave 2 (week 5-6): Consent Mode v2** default-denied before GTM + lightweight Hebrew RTL banner (localStorage) + GTM per-tag consent checks; record the expected 20-40% measured-session drop in the change log **before** shipping | `app/layout.tsx`, small client component, GTM | M | Medium (compliance) | Dev (owner signs off posture) |
| Expectation-setting decision: paid bridge while content matures — small exact-match Google Ads (₪1,500-3,000/מ׳ on פרגולה חשמלית, סגירת מרפסת + top-4 cities) and/or paid מידרג profile (a SERP placement in itself). Decide, don't drift | Owner budget decision | S | Medium | Business |

### Phase 2 — Content, authority and expansion (weeks 4-16, overlapping Phase 1)

**Goal:** substantiated depth — the pages only Sky Shade can write. Hard cap: **~12 new/rewritten pages in the first wave**, each individually evidence-gated. An unshipped page always beats a thin one.

| Action | Files / Where | Effort | Impact | Owner |
|---|---|---|---|---|
| Extend the service-page template: add a `sections` field to `ServiceDetail` (the current template's H2s are hardcoded — copy edits alone cannot add H2s) and render 900-1,200-word pages: intro → סוגי {שירות} → חומרים ופרופילים → מה משפיע על המחיר (factors) → definition block (40-60-word answer-first) → one real `<table>` comparison per page (אלומיניום/עץ/ברזל; WPC/עץ; ACP/HPL — raw material already in the FAQs) → projects strip → process → 6-8 FAQs. Add the "פרגולה חשמלית עם להבים מתכווננים" H2 + regulation blocks (רגולציה בקצרה, each traceable to a named תקנה) | `lib/content.ts` model + `app/service/[slug]/page.tsx` | L | High | Dev (facts: Both) |
| **`/guides/` hub** (`app/guides/page.tsx` + `[slug]/page.tsx` + `lib/guides.ts`; "מדריכים" in nav + sitemap; Article schema with real dates, no fake authors, business as publisher). **Guide #1: the permit guide** (`/guides/pergola-permit/`) — the statutory term מצללה, 40% rule with diagram, greater-of rule with worked examples, 45-day דיווח + gov.il link, roof/shared-building/full-permit cases, "אין באמור ייעוץ משפטי", reviewed once by the client's engineer/adrichal (credited only with consent). No HowTo schema; FAQPage optional | new routes, `lib/guides.ts` | L | Transformational | Dev (review: Business) |
| **Price content — single owner (conflict resolved):** `/guides/pergola-cost/` owns the entire pergola price cluster (title carries מחיר, H2 carries כמה עולה, body carries עלות); siblings `/guides/balcony-enclosure-cost/`, `/guides/deck-cost/`. **No separate `/pricing/` page.** Real owner-confirmed bands only, with כולל/לא כולל list and dated ranges; if the owner refuses bands (decision forced in intake), publish the factors-only variant ("ממה מורכב המחיר") — the plan survives either answer | `lib/guides.ts` | M | Transformational | Both |
| Comparison + seasonal guides (2/month after launch set): aluminum-vs-wood-pergola, synthetic-vs-wood-deck, retractable-vs-louvered, hpl-vs-acp (אלוקובונד handled editorially — "הקטגוריה המוכרת בשם המסחרי אלוקובונד" — unless the brand is actually supplied), balcony-enclosure-permit; **pergola-sukkah guide now** (Sukkot 2026 is late September — publish by mid-Elul; "מותאמת לסוכה" phrasing, refer specifics to the reader's rabbi), balcony-winter by mid-October | `lib/guides.ts` | L | High | Dev |
| **`/projects/` case studies** — the content engine: 10-15 best projects from the intake photo-mapping; each 300-500 words (האתגר/הפתרון/חומרים/משך/עיר), 3-6 photos, facts table, links to its service + city page; ImageObject + Breadcrumb schema; cadence 2/month after launch. Facts from the owner only — never invented | new `app/projects/[slug]/page.tsx`, `lib/projects.ts` | XL | Transformational | Both |
| Gallery upgrade: 4 static category routes (`/gallery/pergolas/` etc. — only categories with photos; kitchen/accordion have none yet) with unique intros + ItemList; `/gallery/` restructured as server-rendered category sections with anchor tabs; **alt-text rewrite for all 55 images via the Media Studio API** (`scripts/studio-api.ps1 -Action Publish … -AltHe '…'` → `ops/sync-media.ps1` — never edit `site.config.json` directly, it is hub-synced); fix the 3 items whose English `alt` holds Hebrew; CollectionPage+ImageGallery schema | new routes, Media Studio, `app/gallery/page.tsx` | M-L | Medium-High | Dev (cities: Business) |
| **City enrichment (the 6-8 keepers):** per-city record in `lib/locations-content.ts` — 150-250-word intro for that city's building stock/climate (coastal salt-air for נתניה/חיפה/אשדוד, ירושלים wind/stone, high-rise balcony angle for רמת גן/בני ברק), verified municipal הנחיות מרחביות paragraph + outbound link, 2-3 city FAQs (with FAQPage schema only once visible+unique), projects-in-city strip, nearby-cities module (corrected clusters; honest regional framing for haifa/beer-sheva). Title set WITHOUT brand (layout template appends it): `פרגולות אלומיניום, גדרות ודקים ב${city.name}`. Ship a city only when it would still be useful with the city name deleted | `lib/locations-content.ts`, `app/locations/[city]/page.tsx` | L | High | Both |
| Sub-service spokes when substance exists (500+ unique words, own FAQs, own photos, added to sitemap): `/service/pergolas/electric-pergola/` (cover נאספת/מתקפלת/לוברים and the four ביואקלימית spellings — one in the title, rest in body), then retractable-pergola, electric-gates, wood-look-pergola. **Never a 7th top-level service** (conflict resolved: H2 first, spoke later, nested under the hub) | new `app/service/[slug]/[sub]/page.tsx`, `lib/sub-services.ts` | L | High | Dev |
| Internal-linking modules shipped with the new page types: in-prose service links on city pages; "לפי עיר" chip block on service pages (`{shortName} ב{city}` anchors); service↔gallery-category cross-links; guides→owning-service transactional link; projects→service+city; "מדריכים" footer column (top 4). Footer city anchors stay plain names — never keyword-stuffed | templates, `Footer.tsx`, `lib/site-config.ts` (shortName field) | M | High | Dev |
| **About rebuild:** named founder (name/photo/consent from intake) + first-person paragraph, timeline since 2009, process steps (already in content.ts, currently rendered nowhere), legal-entity block, 4-6 best photos; Person + AboutPage nodes; soften "מובילים בתחום" → "מאות פרויקטים מאז 2009" (only if the number is confirmed); substantiate or delete the green claim (aluminium recyclability is the one true fact available) | `app/about/page.tsx` | L | High | Both |
| Off-site authority: supplier dealer-locator links (קליל/אקסטל/motor brand — from intake), pitch 3 best projects to בניין ודיור/בית ונוי with the before/after pairs, trade-association listing if member, helpful Facebook-group presence as the page. Avoid paid "מגזין" link farms entirely; sponsorship links `rel="sponsored"` | Owner relationships + outreach | XL | Medium-High | Both |
| **Lead handling after capture:** WhatsApp Business on the business number (quick replies, labels ליד חדש/נשלחה הצעה/נסגר, away message, catalog photos), speed-to-lead standard (call back ≤X min in hours — owner sets X), follow-up cadence on the specific request (day 3, day 14 — broader nurture only with the consent tick), Google Sheet as minimal CRM | Owner process + phone | M | Transformational (revenue) | Business |
| Video habit: 60-90s phone clips per install (before → work → walkthrough) → YouTube with keyword-mapped Hebrew titles, Reels, embed on project pages with VideoObject (schema only once real video exists). Institute the **"before" photo at every measurement visit** | Owner habit; later `lib/projects.ts` | M (ongoing) | High | Business |
| Wave 3 (after consent baseline): **defer GTM** to first interaction/idle via site-kit `gtmDeferredSnippet` (dataLayer stub immediate; accept early tel:-tap undercount) or evaluate Cloudflare Zaraz | site-kit analytics | S | Medium | Dev |
| Decisions to take (not default into): B2B page "פתרונות אלומיניום לעסקים ולפרויקטים" if commercial work exists in the photos; `/en/` subtree (4-6 pages for Anglo communities in רעננה/ירושלים/נתניה/מודיעין) — explicitly decide, both are cheap and unserved | New pages if approved | M each | Medium | Both |

### Phase 3 — Compounding and moat (ongoing)

**Goal:** a publishing and review cadence competitors won't sustain, evidence-gated expansion, and a defended brand.

| Action | Files / Where | Effort | Impact | Owner |
|---|---|---|---|---|
| Cadence: 2 project pages + 1-2 guides/month; quarterly service-page refresh (price factors, newest project cards); "עודכן לאחרונה" on guides only when genuinely changed; yearly legal/date review pass (same pass as the footer year) | content workflow | M ongoing | High | Both |
| **Service×city expansion, evidence-gated:** `/locations/[city]/pergolas/` only (conflict resolved — city-hub children, breadcrumb-coherent), only for cities with 2+ real local projects + a municipal-permit note, only after the enriched city pages earn impressions in GSC (60-90 days). Cap at 6-8. The other ~80 combinations are **never built** | new nested route | L | High | Both |
| Review velocity 2-4/month; on-site display: verbatim quotes captioned "מתוך ביקורות Google" + outbound link; live count/rating text only while monthly rebuilds hold (Places API freshness ToS) — otherwise link only | GBP + testimonial section | S ongoing | High | Business |
| A/B backlog, strictly one at a time, 4-8 weeks each, win metric = delivered leads: hero photo → form-on-service-pages → lightbox CTA → sticky-bar order (RTL thumb side) → H1 variants (category word must survive) → submit copy → trust row | GTM/GA4 + components | M ongoing | Medium-High | Dev |
| Seasonal calendar via the monthly rebuild: Feb-May pergolas/decks push, Aug-Sep sukkah, Oct-Dec closure; honest lead-time line ("ייצור והתקנה תוך X-Y שבועות" — real X-Y only, no countdowns/scarcity) | shared month-check helper | S | Medium | Dev |
| Brand defense: register @skyshade handles (IG/FB/YouTube) now; Google Alert on "סקיי שייד"; check trademark registration (competitors bidding the brand in Ads is legal in Israel unless trademarked) | accounts; REQUIRES-CLIENT-INPUT | S | Medium | Business |
| Long tail, in order, only after the above: glossary page (DefinedTerm-style), DIY-vs-pro guide, lead-magnet PDF ("צ'קליסט היתר לפרגולה") delivered via autoresponse + consent, `/quote/` 3-step configurator experiment (prices only if real bands exist), `llms.txt` (insurance, expect little) | `lib/guides.ts`, `/quote/`, build script | S-L | Low-Medium | Dev |
| Escalation paths (documented, not preemptive): hCaptcha via Web3Forms only on measured spam; website-only virtual tracking number (Voicenter) only with budget — **never** on GBP/citations; Next 15/16 migration the moment the project stops being a static export; sGTM/Zaraz only if ads launch or blocking >25% | docs | — | — | Both |

## 5. The keyword and page architecture

One keyword → one owning URL, recorded in `docs/keyword-map.md`. English slugs throughout (Hebrew slugs: marginal benefit, real migration risk). Titles ≤48 chars before the layout's `| סקיי שייד` suffix.

| URL | Status | Primary Hebrew keyword (gloss) | Intent | Notes / gate |
|---|---|---|---|---|
| `/` | Exists → retitle once | סקיי שייד + פתרונות אלומיניום (brand + broad category) | Brand/navigational | Head term released to pergolas page; 90-day freeze after |
| `/services/` | Exists → +intro | עבודות אלומיניום (aluminium works) | Hub | 100-150-word intro + per-category blurbs so it isn't a home duplicate |
| `/service/pergolas/` | Exists → deepen | **פרגולות אלומיניום** (aluminium pergolas) | Commercial head | Sole owner; H1 "פרגולות אלומיניום — ידניות וחשמליות" |
| `/service/pergolas/electric-pergola/` | **New** (Phase 2) | פרגולה חשמלית (electric pergola) | Commercial, high-ticket | H2 on parent first; page when own projects/FAQs exist; cover נאספת/ביואקלימית variants in body |
| `/service/pergolas/retractable-pergola/` | New | פרגולה נאספת (retractable pergola) | Commercial | 500+ unique words gate |
| `/service/pergolas/wood-look-pergola/` | New | פרגולה דמוי עץ (wood-look pergola) | Commercial | Lowest-difficulty variant SERP — build early |
| `/service/fences-gates/` | Exists → deepen | גדרות אלומיניום + שערים חשמליים (aluminium fences, electric gates) | Commercial | Title "גדרות אלומיניום ושערים חשמליים לבית"; ת"י 900 21.03 content only if practice confirmed |
| `/service/fences-gates/electric-gates/` | New | שער חשמלי (electric gate) | Commercial | Same substance gate |
| `/service/wall-cladding/` | Exists → deepen | חיפוי קירות חוץ (exterior cladding) | Commercial | + חיפוי דמוי עץ section; אלוקובונד editorially unless brand supplied |
| `/service/decks/` | Exists → rename/deepen | דק סינטטי + דקים (synthetic deck, decks) | Commercial | Name "דקים — סינטטי ועץ"; דק לבריכה promoted from FAQ |
| `/service/outdoor-kitchen/` | Exists → deepen | מטבח חוץ (outdoor kitchen) | Commercial | + מטבח גינה in meta/copy; cost question lives in the deck/cost guides |
| `/service/accordion-products/` | Exists → **retarget** | **סגירת מרפסת** (balcony enclosure) | Commercial head | Name → "סגירת מרפסות ותריסי אקורדיון" (slug unchanged); body names זכוכית אקורדיון, וילון זכוכית, קיר הזזה, מחסום רוח |
| `/gallery/` + `/gallery/{pergolas,decks,fences-gates,wall-cladding}/` | Exists + 4 new | גלריית פרויקטים / e.g. גלריית פרגולות (project gallery) | Proof/visual | Unique intro per category; no pages for photo-less categories |
| `/projects/[slug]/` ×10-15 | **New** | Long-tail: "פרגולה חשמלית ברעננה" etc. (project in city) | Proof/local long-tail | Owner-mapped facts only; the anti-doorway substance for cities |
| `/locations/` | Exists | אזורי שירות (service areas) | Hub | Descriptive anchors to children |
| `/locations/[city]/` ×6-8 kept | Exists → enrich or 301 | פרגולות אלומיניום ב{עיר} (pergolas in {city}) | Local commercial | **Gate:** useful with city name deleted (projects, municipal facts, local FAQs); the other 8-10 cities 301 → `/locations/` |
| `/locations/[city]/pergolas/` ×≤6-8 | New (Phase 3) | פרגולות אלומיניום ב{עיר} — מחיר והתקנה | Local commercial | Only after parent city earns impressions + 2 local projects; **all other service×city combos: never** |
| `/guides/` | **New hub** | מדריכים (guides) | Informational hub | In nav; Article schema, real dates |
| `/guides/pergola-permit/` | New — first guide | היתר בנייה לפרגולה / חוק הפרגולות (pergola permit law) | Informational, highest volume | Statutory מצללה content; engineer-reviewed; not-legal-advice line |
| `/guides/pergola-cost/` | New | פרגולת אלומיניום מחיר / כמה עולה (pergola price) | Commercial-informational | **Owns the whole price cluster — no separate /pricing/ page** (conflict resolved); real bands or factors-only |
| `/guides/balcony-enclosure-permit/` | New | סגירת מרפסת היתר (enclosure permit) | Informational | Shared-building consent angle |
| `/guides/balcony-enclosure-cost/`, `/guides/deck-cost/` | New | סגירת מרפסת מחיר; דק סינטטי מחיר | Commercial-informational | Bands gate |
| `/guides/aluminum-vs-wood-pergola/`, `/guides/synthetic-vs-wood-deck/`, `/guides/retractable-vs-louvered/`, `/guides/hpl-vs-acp/`, `/guides/aluminum-vs-iron-fence/` | New | פרגולה אלומיניום או עץ etc. (X vs Y comparisons) | Decision-stage | Comparison table + "למי מתאים"; guides link down with transactional anchors |
| `/guides/pergola-sukkah/`, `/guides/balcony-winter/` | New — seasonal | פרגולה לסוכה; הכנת מרפסת לחורף | Seasonal | Evergreen URLs, yearly refresh; מותאמת-not-כשרה phrasing |
| `/warranty/` | **New** | אחריות (warranty) | Trust | Owner terms only; target of 19 existing claims |
| `/standards/` | New (later) | תקנים ובטיחות (standards & safety) | Trust/informational | Every compliance claim owner-confirmed or omitted |
| `/about/`, `/contact/`, legal pages | Exist → rebuild/fix | brand-supporting | Trust | About = founder + E-E-A-T anchor |
| Deliberately **not built** | — | — | — | 7th top-level service; ~80 service×city combos; `/pricing/` duplicate; city #17+; Hebrew-slug migration; `/blog/` (guides hub is the one home) |

**The doorway line, stated once:** a geo or variant page ships only if it would still be useful with the city/keyword token deleted — real local projects, verifiable municipality-specific facts, or genuinely distinct FAQs. Pages that cannot meet that within a quarter get pruned (301), not parked.

## 6. Ready-to-implement specifics

### 6.1 Corrected JSON-LD entity graph

Target output (rendered by site-kit from the manifest; strings marked `⟵ REQUIRES-CLIENT-INPUT` ship only after intake). Business + WebSite nodes render on **every** page from `app/layout.tsx`; page-typed nodes per template. `jsonLdScript()` array form changes to wrap in `@graph` (site-kit `seo/index.ts:169-171`); all `@id`s use trailing-slash canonicals. Also fix upstream: `serviceJsonLd` default URL builds `/services/<slug>/` but the route is `/service/<slug>/`.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://skyshade.co.il/#business",
      "name": "סקיי שייד",
      "alternateName": ["Sky Shade", "skyshade"],
      "url": "https://skyshade.co.il/",
      "telephone": "+972505063152",
      "email": "yossi@skyshade.co.il",
      "foundingDate": "2009",
      "priceRange": "₪₪",
      "slogan": "סקיי שייד — פרגולות ופתרונות אלומיניום פרימיום",
      "currenciesAccepted": "ILS",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://skyshade.co.il/#logo",
        "url": "https://imgquarry.com/cdn-cgi/image/width=512,quality=90,format=auto/skyshade/logo-square.png",
        "width": 512, "height": 512
      },
      "image": [
        "https://imgquarry.com/cdn-cgi/image/width=1200,quality=85,format=auto/skyshade/og.jpg",
        "https://imgquarry.com/cdn-cgi/image/width=1600,quality=85,format=auto/skyshade/gallery/project-1.webp",
        "https://imgquarry.com/cdn-cgi/image/width=1600,quality=85,format=auto/skyshade/gallery/project-49.webp",
        "https://imgquarry.com/cdn-cgi/image/width=1600,quality=85,format=auto/skyshade/gallery/project-10.webp"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "⟵ REQUIRES-CLIENT-INPUT (base city — must match GBP verification city; street may stay private; never invent, never per-city)",
        "addressCountry": "IL"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+972505063152",
        "availableLanguage": ["he"],
        "areaServed": "IL"
      },
      "sameAs": [
        "⟵ REQUIRES-CLIENT-INPUT: real GBP maps URL, facebook.com/skyshade, instagram.com/skyshade, midrag/B144/דפי-זהב/easy profile URLs — only profiles that actually exist"
      ],
      "hasMap": "⟵ REQUIRES-CLIENT-INPUT: GBP share link",
      "knowsAbout": ["פרגולות אלומיניום", "סגירת מרפסות", "גדרות ושערים חשמליים", "דקים", "חיפוי קירות חוץ", "מטבחי חוץ"],
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"], "opens": "08:00", "closes": "18:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "08:00", "closes": "13:00" }
      ],
      "areaServed": [
        { "@type": "Country", "name": "ישראל" },
        { "@type": "City", "name": "תל אביב" }, { "@type": "City", "name": "ירושלים" },
        { "@type": "City", "name": "חיפה" }, { "@type": "City", "name": "ראשון לציון" },
        { "@type": "City", "name": "פתח תקווה" }, { "@type": "City", "name": "נתניה" },
        { "@type": "City", "name": "אשדוד" }, { "@type": "City", "name": "באר שבע" },
        { "@type": "City", "name": "חולון" }, { "@type": "City", "name": "בני ברק" },
        { "@type": "City", "name": "רמת גן" }, { "@type": "City", "name": "רחובות" },
        { "@type": "City", "name": "הרצליה" }, { "@type": "City", "name": "כפר סבא" },
        { "@type": "City", "name": "רעננה" }, { "@type": "City", "name": "מודיעין" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "שירותי אלומיניום",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/pergolas/#service" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/fences-gates/#service" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/wall-cladding/#service" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/decks/#service" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/outdoor-kitchen/#service" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://skyshade.co.il/service/accordion-products/#service" } }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://skyshade.co.il/#website",
      "url": "https://skyshade.co.il/",
      "name": "סקיי שייד",
      "alternateName": "Sky Shade",
      "inLanguage": "he-IL",
      "publisher": { "@id": "https://skyshade.co.il/#business" }
    }
  ]
}
```

Per-template additions (same `@graph` pattern):

- **Service page:** `Service` node with `"@id": "<url>#service"`, `provider → #business`, `mainEntityOfPage → <url>`, `image` = first 3-6 category-matched catalog photos, `areaServed` = the Country+City list, `category: "עבודות אלומיניום"`, **no `Offer.price` ever** (no published prices) — plus `WebPage` (`isPartOf → #website`), breadcrumb from PageHeader, existing FAQPage.
- **City page:** `WebPage` + `Service` named for the page target ("פרגולות אלומיניום בתל אביב"), `provider → #business`, `areaServed: {"@type":"City","name":"תל אביב","containedInPlace":{"@type":"Country","name":"ישראל"}}`. **Never a per-city LocalBusiness** (fabricated branches). FAQPage only once the visible city FAQs are unique.
- **Hubs:** `/about` → `AboutPage` (`about → #business`, later `Person` founder node — only with a real named, consenting founder); `/contact` → `ContactPage` (`mainEntity → #business`); `/services`, `/locations`, `/gallery` → `CollectionPage` + `ItemList` (gallery: ImageGallery with 55 `ImageObject`s — `contentUrl`, rewritten `altHe` captions, width/height, `creditText: "סקיי שייד"`).
- **Never emitted, anywhere:** `Review`/`AggregateRating` for on-site testimonials (self-serving — not even after verification), `SearchAction` (no search page; feature retired), `HowTo` (dead rich result), a separate `Organization` node (the business node *is* the Organization; a second entity fragments the graph), `GeneralContractor` type or `hasCredential` without a real רישיון קבלן, `VideoObject` without a real video.

### 6.2 The Cloudflare session spec (one sitting, in this order) + DNS

| # | Rule / setting | Where | Config |
|---|---|---|---|
| 1 | AI crawlers → allow | Security → Bots / AI Crawl Control | Allow at minimum OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User; also GPTBot, ClaudeBot, meta-externalagent, Amazonbot, Applebot-Extended (training visibility is the goal) |
| 2 | Managed robots.txt / Content Signals → **off** | Same area | It currently injects Disallow stanzas (incl. Google-Extended — silently removes Gemini grounding) over the repo's Allow-all. Re-fetch `/robots.txt` after: expect only the repo's wildcard Allow |
| 3 | www → apex 301 | Rules → Single Redirects | If `http.host eq "www.skyshade.co.il"` → 301 `concat("https://skyshade.co.il", http.request.uri.path)`, preserve query |
| 4 | Legacy images 301 | Single Redirects (wildcard) | `/project-*.webp` → `https://imgquarry.com/cdn-cgi/image/width=1600,quality=85,format=auto/skyshade/gallery/project-${1}.webp`; then delete the 55 files from `public/` (keep `CNAME`) |
| 5 | Legacy WP URLs | Bulk Redirects (Phase 1, after discovery) | Free plan: 10,000 URLs / 15 rules / 5 lists — ample; map old→closest page, Hebrew slugs percent-encoded; `?p=/page_id=` catch-all only if discovery warrants |
| 6 | Security headers | Rules → Transform → Modify Response Header | `X-Frame-Options: SAMEORIGIN` · `Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` · `Cross-Origin-Opener-Policy: same-origin` |
| 7 | CSP — **report-only first** (2-3 weeks, then enforce) | Same transform mechanism | See below |
| 8 | X-Robots-Tag | Transform rule | `X-Robots-Tag: noindex` on paths ending `.txt`, **excluding** `/robots.txt` (RSC payloads; do not delete them) |
| 9 | HSTS | SSL/TLS → Edge Certificates | `max-age=31536000; includeSubDomains`; preload only as a later deliberate step; verify SSL mode = Full (strict) |
| 10 | Cache rules | Caching → Cache Rules | (a) `/_next/static/*`: eligible, Edge TTL 1 month, Browser TTL 1 year (content-hashed); (b) everything else: eligible, Edge TTL 10 min → 1 day once the deploy purge step exists; Smart Tiered Caching on; **Rocket Loader stays OFF** |
| 11 | Verification | curl matrix | AI UAs → 200; `facebookexternalhit/1.1` + WhatsApp UA → 200 and og:image (on imgquarry) itself fetchable |

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://imgquarry.com https://www.googletagmanager.com https://*.google-analytics.com;
  font-src 'self';
  connect-src 'self' https://api.web3forms.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net;
  frame-src https://www.googletagmanager.com;
  frame-ancestors 'self';
  base-uri 'self'; object-src 'none';
  form-action 'self' https://api.web3forms.com;
  upgrade-insecure-requests;
  report-uri <report-uri.com endpoint>
```

README notes to add with it: `'unsafe-inline'` is a deliberate concession to the static export + GTM bootstrap (strict nonces would need a Worker); **whoever edits the GTM container owns the CSP allowlist** — any new tag (Ads, Meta pixel) is silently blocked once enforced.

DNS (same session): GSC TXT + Bing; `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:yossi@skyshade.co.il; fo=1` (monitor 4-6 weeks → `quarantine` → `reject`; before tightening, identify the actual outbound sender and add its SPF include + DKIM selector); CAA: add `letsencrypt.org`, let Cloudflare auto-add its Universal SSL set (`pki.goog`, `ssl.com`).

`deploy.yml` additions:

```yaml
on:
  push: { branches: [main] }
  workflow_dispatch:
  schedule:
    - cron: '0 4 1 * *'   # monthly rebuild: seasonal copy, build-time years, honest freshness

# after actions/deploy-pages@v4:
      - name: Purge Cloudflare cache
        run: |
          curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_PURGE_TOKEN }}" -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
      - name: IndexNow ping
        run: |
          node -e "const u=require('https');const urls=require('fs').readFileSync('out/sitemap.xml','utf8').match(/<loc>([^<]+)<\/loc>/g).map(m=>m.slice(5,-6));
          const body=JSON.stringify({host:'skyshade.co.il',key:'${{ secrets.INDEXNOW_KEY }}',urlList:urls});
          const r=u.request({host:'api.indexnow.org',path:'/indexnow',method:'POST',headers:{'Content-Type':'application/json'}});r.end(body);"
```

(IndexNow key file `public/<key>.txt` committed; 36 URLs/deploy is far below any abuse threshold.)

### 6.3 GTM / GA4 event and dataLayer plan

Container GTM-KWGGH438 (fleet container; the hostname→GA4-ID lookup macro `{{GA4 ID by host}}` already maps skyshade.co.il → G-BRZ0S93NFS, so all tags below work fleet-wide).

| GA4 event | Trigger | Params (DLVs, Data Layer v2) | Key Event | Provisional value (ILS) |
|---|---|---|---|---|
| `generate_lead` | Custom Event `lead_submit` | `form`, `service`, `has_message`, `message_length`, `page` | ✔ | 100 |
| `lead_submit_failed` | Custom Event `lead_submit_failed` | `reason` | — (alarm: GA4 Custom Insight emails owner when daily count > 0) | — |
| `phone_call_click` | Just Links: Click URL starts with `tel:` | `cta` (Custom JS: `closest('[data-cta]')`), `link_url` | ✔ | 60 |
| `whatsapp_click` | Just Links: Click URL matches `wa\.me|api\.whatsapp\.com` | `cta`, `link_url` | ✔ | 40 |
| `form_start` | Custom Event `form_start` (first field focus, useRef gate) | `form`, `page` | — | — |
| `form_abandon` | Custom Event (typed but not submitted, blur >30s) | `fields_filled` | — | — |
| `gallery_filter` / `gallery_lightbox_open` / `gallery_lightbox_next` | Custom Events from `FilterableGallery.tsx` | `category`, `item` | — | — |
| `scroll_depth` | GTM Scroll Depth 25/50/75/90, all pages | `{{Scroll Depth Threshold}}` | — | — |

GA4 admin: custom dimensions `service`, `category`, `cta` (event scope); retention 14 months; internal-traffic filter; Google Signals off; timezone Asia/Jerusalem, currency ILS; link GSC. Real ₪ values = avg deal × close rate per channel — REQUIRES-CLIENT-INPUT, revisit quarterly. **Never push name/phone into GA4** (Google ToS + PPL exposure). AI-referral channel: rely on GA4's native "AI Assistant" channel; add one custom channel-group rule *above* Referral sweeping `chatgpt\.com|perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|claude\.ai|you\.com|meta\.ai` — a floor, not a census.

Repo side — `LeadForm.tsx` payload additions (with first-touch attribution; disclose in the privacy policy):

```tsx
// app/layout.tsx — small client component, first document load only:
if (!sessionStorage.getItem("ss_first_touch")) {
  sessionStorage.setItem("ss_first_touch", JSON.stringify({
    ref: document.referrer || "(direct)",
    landing: location.pathname + location.search, // keeps utm_* from AI/paid clicks
  }));
}

// LeadForm submit payload (Web3Forms JSON), added fields:
// page: usePathname(), service: selectedServiceName,
// first_touch_ref / first_touch_landing: from sessionStorage,
// marketing_consent: checkbox boolean (unchecked by default),
// phone: normalized E.164
trackEvent("lead_submit", { form: "lead", service: serviceName,
  has_message: !!message, message_length: message.length });
```

Consent Mode v2 (wave 2, inline in `app/layout.tsx` **before** the GTM snippet):

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });
</script>
<!-- Hebrew RTL banner component: on accept →
     gtag('consent','update',{analytics_storage:'granted'}); localStorage flag.
     ad_* stay denied (no ads run). -->
```

### 6.4 Hebrew title/meta patterns and load-bearing copy

Layout template appends `| סקיי שייד`; page titles ≤48 chars **without** the brand. Most service titles shipped in commit `ade3f37` (deploys with Phase 0) — do not churn them.

| Template | Title pattern | Meta description pattern |
|---|---|---|
| Home | `פרגולות אלומיניום ופתרונות חוץ בהתאמה אישית \| סקיי שייד` (shipped) → after pergolas page claims the head term: `סקיי שייד — פתרונות אלומיניום לחצר, לגינה ולמרפסת`; then 90-day freeze | Current curated 158-char description stands |
| Service (per-slug `seoTitle` in `lib/content.ts`) | pergolas: `פרגולות אלומיניום — ידניות וחשמליות` · fences: `גדרות אלומיניום ושערים חשמליים לבית` · cladding: `חיפוי קירות חוץ — אלומיניום, קומפוזיט ו-HPL` · decks: `דקים — דק סינטטי (WPC) ודק עץ` · kitchen: `מטבח חוץ מאלומיניום ואבן — תכנון והתקנה` · accordion: `סגירת מרפסת ותריסי אקורדיון — אלומיניום וזכוכית` | Card description + `"ייעוץ ומדידה ללא עלות בכל הארץ."` |
| City | `פרגולות אלומיניום, גדרות ודקים ב${city.name}` (~≤55 chars worst case) | Local hook + offer + phone, e.g. `מתכננים פרגולה או דק בתל אביב? סקיי שייד מתכננת ומתקינה עבודות אלומיניום בהתאמה אישית — מדידה וייעוץ חינם, אחריות מלאה. חייגו 050-5063152.` (144 chars); derive from each city's unique angle once `cityDetails` exist |
| Guide | Query-form title, e.g. `היתר בנייה לפרגולה — מתי פטור ומתי חייבים` · `פרגולת אלומיניום — מחיר למ״ר: כמה עולה באמת?` (year in title only while the monthly rebuild guarantees freshness) | 40-60-word answer-first summary sits under the H1 on-page |
| Project | `{מוצר} ב{עיר} — פרויקט של סקיי שייד` | One-line scope + materials |
| About | `מי אנחנו` | — |
| Price-bearing titles | `החל מ-X ₪` **only** with owner-confirmed floors actually honored on the page | — |

Corrected permit FAQ answer (replaces `lib/content.ts:124-126` and the sibling at `:358-360` — both also feed FAQPage schema):

```
ש: האם צריך היתר בנייה לפרגולה?
ת: לרוב הפרגולות (מצללות) יש פטור מהיתר לפי תקנות התכנון והבנייה (תשע"ד-2014),
בתנאים: שטח עד 50 מ"ר או עד רבע מהשטח הפנוי (הגדול מביניהם), בנייה מחומרים קלים,
מרווחים של 40% לפחות בין חלקי הקירוי, ועמידה בהנחיות המרחביות של הוועדה המקומית.
גם כשיש פטור, חובה לדווח לרשות הרישוי תוך 45 יום מסיום הביצוע. אנחנו מלווים אתכם
בכל התהליך מול הרשות המקומית. אין באמור ייעוץ משפטי — הבדיקה המחייבת נעשית מול
הוועדה המקומית. [קישור למדריך המלא כשיעלה]
```

Trust row under the LeadForm submit (verified facts only): `פועלים מאז 2009 · מדידה וייעוץ ללא עלות · ללא התחייבות · הפרטים משמשים אך ורק לחזרה אליכם` — **not** "⭐ מאות לקוחות מרוצים" (unverified rating implication) and **not** "הפרטים לא מועברים לאף גורם" (false while Web3Forms processes them). Years-in-business is computed, never hardcoded: `new Date().getFullYear() - manifest.foundedYear` (the monthly rebuild keeps it honest).

## 7. Requires the business owner (Yossi)

Honesty clause: several of the highest-value workstreams — projects, prices, city pages, warranty, About, reviews — are **blocked** until these arrive. One structured session (~2 hours total), week 1.

**A. The photo-mapping exercise (~60-90 min, gates 8 workstreams):** for each of the 55 gallery photos — city, product type, materials/profile system, approx. size, install duration, anything notable. Also: which projects were multi-service (feeds the integrated-yard angle), and whether any commercial work (restaurants, ועדי בתים) appears.

**B. Facts call (~30 min):**
- [ ] Real numbers: total projects, clients — or approve the honest form "מאות פרויקטים מאז 2009"
- [ ] The three testimonials: verbatim source (screenshot/link) + consent per name, or they stay removed
- [ ] Warranty terms per component: structure/powder-coat years, motors, workmanship, exclusions
- [ ] **Price bands per service — or an explicit "no"** (forced decision: "no" switches the price cluster to factors-only pages; do not let this be discovered at writing time)
- [ ] Legal entity: registered name, ח.פ./ע.מ number, publishable base city (street may stay private; must match GBP verification city)
- [ ] Licences/standards actually held: רישיון קבלן? ת"י 900 21.03 practice for gates? named engineer? insurance + insurer (ביטוח צד ג׳/מקצועית)
- [ ] Supplier relationships (קליל/אקסטל? motor brand?) + permission to show logos + ask for dealer-locator listings; does Sky Shade actually supply Alucobond-brand panels?
- [ ] Founder: full name, photo, consent, 5-line bio
- [ ] **Workshop/showroom: does a visitable location exist?** (changes GBP config, schema address, and a "בקרו אותנו" path — three tracks depend on this one answer)
- [ ] Real city history: where has the business actually worked (decides the 6-8 keeper cities); carports confirmed as an offering?
- [ ] SLAs: callback window ("חוזרים תוך X בשעות הפעילות"), production lead time X-Y weeks; Sukkot demand spike real?
- [ ] Accessibility contact person name; employee headcount (≥25 triggers formal רכז נגישות)
- [ ] Lead-data retention period + who has inbox access (feeds the one-page מסמך הגדרות מאגר)

**C. Accounts & access:**
- [ ] Google account for GSC/GBP/GA4; check for a dormant WordPress-era GBP (claim, don't duplicate)
- [ ] Web3Forms login (enable domain restriction — may need Pro), Cloudflare, registrar, GTM — into the access register, 2FA everywhere
- [ ] Budget decisions: Google Ads bridge (₪1,500-3,000/מ׳)? paid מידרג profile? rank tracker (₪60-200/מ׳)? later: virtual tracking number?
- [ ] Lawyer engagement: privacy policy + terms review (governing law, proportionate liability clause — not drafted in-house)

**D. Ongoing habits (the moat):**
- [ ] Day-after-install WhatsApp review ask, to every customer, no incentives
- [ ] "Before" photo at every measurement visit; 60-90s phone clip per install
- [ ] WhatsApp Business set up; speed-to-lead standard; reply to every Google review within 48h

## 8. Measurement

**Baseline — captured BEFORE anything ships (Phase 0, day 1):** commit `baseline-seo-snapshot.json`; export current GA4 state (page views only — that emptiness is itself the baseline); manual SERP snapshot of the fixed ~30-keyword set (6 service heads + פרגולות ב{עיר} for the 6 biggest cities + brand query); Cloudflare analytics snapshot; UA curl matrix results (the 403s). GSC accrues from verification (it backfills ~16 months of property data, but verify first anyway).

**The rule (from `docs/measurement-plan.md`, a merge requirement):** no recommendation is "done" until its metric is named and its baseline value written down; every shipped change gets a dated change-log entry. This is the defense against the audit's biggest identified failure mode — simultaneous change making everything unattributable.

**Waves (non-negotiable order):** (1) week 1: GA4 events + GSC → **4 clean weeks** of lead/traffic baseline; (2) weeks 5-6: Consent Mode + banner, with the expected 20-40% measured-session drop written down first; (3) week 7+: GTM defer. Title changes freeze for 90 days after the Phase-1 final state so GSC CTR deltas mean something.

| Phase | Proves itself by | Metric & source |
|---|---|---|
| 0 | Measurement live; machines unblocked | generate_lead/phone/whatsapp events flowing (GA4 DebugView); AI UAs return 200; robots.txt clean; deploy shipped; GSC property verified + sitemap accepted |
| 1 | Entity + capture working | GSC: 31→ indexed count clean, no www duplicates; rich-result validity (Breadcrumb/FAQ); leads/week by channel (the number Row 1 of the dashboard exists for); form_start→submit rate per template; TTFB edge-HIT ~30-80ms; security headers observable; GBP live + first reviews |
| 2 | Content earns demand | GSC impressions/clicks on guide queries (כמה עולה פרגולה, היתר בנייה לפרגולה) and city queries (regex filter: תל אביב\|ירושלים\|חיפה\|ראשון\|פתח תקווה\|נתניה\|אשדוד\|באר שבע); leads with landing page ∈ /guides/ or /projects/; image-search clicks; review count/velocity; CWV field data on /gallery/ |
| 3 | Compounding | Leads MoM (generate_lead + phone_call_click + whatsapp_click — a proxy that overcounts intent; say so); local-pack presence via geo-grid tool (Local Falcon/ProRankTracker) once GBP matures; service×city expansion gated on 60-90-day GSC impressions; AI-assistant channel sessions (if >2% of sessions, content-hub priority rises) |

**Tooling:** GSC (primary, free) + Bing WMT; GA4 + the Looker Studio one-pager emailed monthly to yossi@ — Row 1: total leads split by form/call/WhatsApp with MoM delta; Row 2: leads by service and landing-page group; Row 3: GSC clicks + avg position for the fixed set, indexed count; Row 4: `lead_submit_failed` (red if >0) + AI sessions. No vanity rows. Paid rank tracker (ProRankTracker/SE Ranking, Hebrew + google.co.il) optional Phase 2+.

**Cadence:** weekly 15-min check during Phases 0-1 (form-health alarm, indexation); monthly dashboard review with Yossi; quarterly strategy review (stats refresh, A/B result, expansion gate decisions); yearly legal/date pass.

## 9. Risks and what NOT to do

**Google spam-policy lines (each traced to a live temptation in this plan):**

1. **Doorway/scaled content** — the domain already carries 16 doorway-pattern pages; the plan sums to 60-90 potential new pages against a content supply chain of one owner's WhatsApp. The predictable failure is delivery-by-template to hit counts. Mitigations are structural: the Phase-2 hard cap (~12 pages, each evidence-gated), the "useful with the city name deleted" ship-blocker, prune-don't-park (301 to `/locations/`), never 96 service×city, never spun "local" filler, guides written one at a time with human review (bulk AI generation is the scaled-content-abuse pattern — and LLM dedup discards it anyway).
2. **Self-serving review markup** — `Review`/`AggregateRating` for on-site testimonials is **never** added, not even after the quotes are verified (ignored by Google since 2019; manual-action downside). Comment to that effect stays above `testimonials` in `lib/content.ts`. Review equity is built on GBP, where it actually ranks.
3. **Review solicitation** — ask everyone, never incentivize, never gate by sentiment; violations risk GBP suspension. No purchased directory "review packages."
4. **Fabricated E-E-A-T** — no invented founder/Person nodes, no per-city LocalBusiness branches or addresses, no `GeneralContractor`/`hasCredential` without a real licence, no fake authors on guides, no guessed project cities.
5. **Link spam** — no paid Hebrew "מגזין"/אינדקס link farms, no scaled reciprocal schemes; paid placements and paid-consideration sponsorships carry `rel="sponsored"`; "ספקים מומלצים" only with real working partners.
6. **Keyword-stuffed GBP name / exact-match anchor footers** — GBP and every external profile is exactly "סקיי שייד"; the footer keeps plain city-name anchors, never a sitewide keyword-anchored geo block.

**Israeli-legal lines (distinct from Google policy; the four live violations are fixed in Phase 0 before anything new ships):**

- *Legally required now:* accurate privacy disclosure incl. processors and rights (PPL §11 + Amendment 13, fines in force since 8/2025); accessibility statement contents per תקנה 35ה with a truthful conformance claim (the current contrast claim is false — fix code or disclose before re-dating the statement); unbundled, unchecked marketing consent before any nurture beyond the specific request (חוק הספאם, סע' 30א); written warranty certificate for motorized goods (already mandated — publish what exists); correct permit information (the current answer is wrong and schema-amplified).
- *Misleading-representation exposure (חוק הגנת הצרכן) — publish only owner-confirmed:* price floors/bands, warranty years, standards/engineer/insurance claims, "מאות לקוחות"-type stats, star glyphs implying ratings, seasonal installation promises (the monthly rebuild is what keeps "לפני הקיץ" copy from going stale — no deadline promises the business won't stand behind year-round), green claims (substantiate with aluminium recyclability or delete), Alucobond brand implication without supplying the brand (passing-off), "כשרה לסוכה" (say מותאמת, refer to a rabbi).
- *Privacy hygiene:* no PII into GA4; referrer/first-touch capture disclosed in the policy; the one-page מסמך הגדרות מאגר exists; tracking number (if ever) stays website-only, never on GBP/citations.

**Operational risks:**

- **Simultaneous change destroys the feedback loop** — enforced by the wave plan and the change log; if a wave slips, the next one waits.
- **Owner bandwidth is the real constraint** — if intake stalls, the plan degrades gracefully: everything in Phase 0/1 except sameAs/address/warranty ships anyway; content Phase 2 shrinks to the permit guide + comparisons (no client facts needed) rather than shipping unverified substance.
- **Ranking expectations** — head terms are directory-owned; the honest 6-12-month bet is local-pack + long-tail + evidence pages, with the optional Ads/מידרג bridge for immediate lead flow.

**Explicit do-not-build list:** HowTo schema; SearchAction; a separate Organization node; `/pricing/` alongside the cost guides; a 7th top-level service; city #17+; Hebrew-slug migration; per-city map iframes; exit-intent modals; preemptive CAPTCHA (honeypot + monitoring first; Web3Forms' `botcheck` is just a second honeypot, not protection against direct API posts); server-side tagging now; `priority`/`changefreq` in the sitemap; build-time `lastmod` (stays omitted until real per-page dates exist); third-party review-widget embeds; framer-motion re-introduction; `.htaccess` anything.

---
*Sources: 15-track adversarially-verified audit (corrections preserved throughout), completeness critique (all 8 misses and 8 conflict resolutions incorporated), and direct verification of `site.config.json`, `app/layout.tsx`, `lib/site-config.ts`, `lib/content.ts`, and `.github/workflows/deploy.yml` in this repo. Where a claim could not be verified it is marked REQUIRES-CLIENT-INPUT rather than asserted.*