# Phase 2 — the improvement plan

**Written:** 2026-08-24 · **Horizon:** 16 weeks · **Basis:** the completed 15-track audit
(`audit-roadmap-full.md`), the guardrails (`docs/seo-guardrails.md`), and the live state verified
2026-08-23.

This plan covers everything asked for — SEO, GEO, AEO, E-E-A-T and trust, rankings, performance,
content, structure, engagement, conversion, navigation and security — but **not in that order**,
because they are not independent. Several of them are currently blocked by two things, and doing the
rest first wastes the effort.

---

## 1. Where we actually are

**Fixed and live** (verified 2026-08-23): every audit code fix · www→apex 301 · security headers +
HSTS + report-only CSP · DMARC `p=none` · Search Console verified · AI crawlers unblocked (13/13
UAs → 200) · managed robots.txt off · corrected permit copy in text *and* schema · truthful privacy
policy · query-led titles · services in the primary nav · sitemap drift guard · media pipeline on
the imgquarry CDN.

**The two things blocking everything else:**

| Blocker | Consequence today |
|---|---|
| **No measurement.** GTM has one tag; every `trackEvent()` call dies in the dataLayer. GA4 has page views only. GSC has no history. | No conversion rate is known. No change can be attributed. Every CRO claim is currently a guess. |
| **No corroborated substance.** No Google Business Profile, no reviews, no prices, no address, no ח.פ., no named human, no project facts. | The brand's own name search surfaces competitors. AI assistants cannot identify the business. The 16 city pages are doorway clones. The largest keyword cluster (price) cannot be written. |

Neither is a code problem. That is why this plan front-loads a measurement week and an owner
session, and why weeks 1–2 look unglamorous.

**The strategic thesis:** this market is won on *corroborated specifics* — real projects, real
prices, accurate regulation, real reviews. Competitors publish templated copy; directories hold the
top organic slots. The only durable advantage available is substance competitors cannot template,
and the machinery to prove it moved the needle.

---

## 2. Sequencing rules (non-negotiable)

1. **Measurement before optimization.** Events + 4 clean weeks of baseline before any CRO change,
   or nothing that follows is attributable.
2. **One substantive conversion/measurement change per read window** (4 weeks or 200 sessions,
   whichever is later). Content additions are additive and exempt.
3. **Titles freeze for 90 days** from the Phase-1 final state (2026-08-23 → ~2026-11-21).
4. **Evidence gates content.** A page that needs a 🔶 fact is not written; its slot is built and the
   question goes to Yossi.
5. **Consent Mode's 20–40% measured-session drop is written down *before* it ships**, not explained
   afterwards.
6. **Hard cap: ~12 new or rewritten pages this phase**, each individually gated.

---

## 3. The workstreams

### W1 · Measurement — week 1 (unblocks everything)

| # | Action | Where | Gate |
|---|---|---|---|
| 1.1 | Build the seven GA4 event tags in GTM per the event table | GTM container `GTM-KWGGH438` | GTM Preview → GA4 DebugView, all seven verified firing |
| 1.2 | Mark `generate_lead`, `phone_call_click`, `whatsapp_click` as GA4 conversions | GA4 | visible in Conversions |
| 1.3 | Alarm on `lead_submit_failed > 0` | GA4 custom insight | test by forcing a failure |
| 1.4 | Submit the sitemap; import the property into Bing Webmaster | GSC / Bing | coverage report populated |
| 1.5 | Record every starting value | `docs/measurement-plan.md` | a dated baseline row per KPI |

Then **four weeks of nothing else measurement-related.** Skill: `tracking-analytics`.

**Metric:** events firing = 7/7 · leads/week by channel becomes knowable for the first time.

---

### W2 · The owner intake — week 1–2 (unblocks trust, content, local)

Run `docs/owner-intake-checklist.md` as one 60–90 minute session. It is the critical path: sections
4–7 (warranty, prices, projects, cities) each release a workstream below.

Immediately after: create the **Google Business Profile** (name exactly `סקיי שייד`, service-area
business, address hidden, categories and services mirroring the six service pages), and start the
review request process — ask every past customer, never incentivize, never gate by sentiment.

**Metric:** register rows moved 🔶 → ✅ · GBP live · first 5 reviews within 6 weeks.
Skills: `eeat-trust-evidence`, `local-seo-il`.

---

### W3 · Entity and AI visibility (GEO) — weeks 2–4, then monthly

The reason a brand search shows competitors is that the entity is unresolvable: `sameAs` is `[]`,
there is no GBP, no address, no third-party corroboration.

| # | Action | Depends on |
|---|---|---|
| 3.1 | Populate `manifest.schema.sameAs` with the GBP + real social profiles | W2 |
| 3.2 | Ship the corrected `@id`-linked JSON-LD graph from `audit-roadmap-full.md` §6.1 | — |
| 3.3 | One canonical business description used verbatim everywhere (`docs/entity-profile.md`) | — |
| 3.4 | Israeli directories with identical NAP: b144, dapey zahav, zap, easy.co.il, municipal indexes, supplier "where to buy" pages | W2 (address/ח.פ.) |
| 3.5 | Monthly AI-assistant prompt set, answers recorded verbatim with cited sources | — |
| 3.6 | Re-verify the AI-crawler matrix monthly — it was 403 for a year and a dashboard setting can close it again | — |

**Metric:** brand search returns us first · knowledge panel exists · assistants name us correctly ·
AI-referral sessions in GA4. Skills: `geo-ai-visibility`, `schema-structured-data`.

---

### W4 · The guides silo — weeks 3–10 (the biggest ranking opportunity)

Commercial and informational demand is **entirely uncovered**, and it is where competitors are
weakest. This is the largest single source of new rankings available, and it is also what makes the
site citable by AI.

| Order | URL | Cluster | Gate |
|---|---|---|---|
| 1 | `/guides/pergola-permit/` | היתר · חוק הפרגולות · מצללה פטור | municipal sources cited; conditional-exemption wording; legal review |
| 2 | `/guides/pergola-cost/` | the **entire** price cluster | 🔶 blocked on W2 §5 — real bands |
| 3 | `/guides/aluminum-vs-wood-pergola/` | X-או-Y comparison | 4–6 criterion table |
| 4 | `/guides/balcony-enclosure-permit/` | סגירת מרפסת היתר | as #1 |
| 5 | `/guides/deck-cost/` | דק סינטטי מחיר | as #2 |
| 6 | `/guides/pergola-sukkah/` | seasonal, evergreen URL | `מותאמת`, never `כשרה` |

Every guide: question-form H2s from `docs/aeo-question-bank.md`, a self-contained 40–60 word answer
under each, one fact no competitor has, `Article` + `FAQPage` + breadcrumb schema, a visible and
true `עודכן` date, and **the money link to its service page above the fold** — a soft link, never a
hard sell, or the informational query is lost.

There is deliberately **no `/pricing/` page**; the price cluster lives here.

**Metric:** GSC impressions on the cost/permit query set (baseline: zero) · AI citations · assisted
leads. Skills: `new-page-gate`, `aeo-answer-content`, `hebrew-rtl-copy`.

---

### W5 · Proof layer: projects — weeks 4–12

The 55 catalog photos currently carry zero facts. Turning 8–12 of them into project pages with
city, year, product, size and the constraint solved produces the only content in this market that
cannot be templated — and it is simultaneously the fix for city pages, the gallery, E-E-A-T and AI
citability.

- `/projects/[slug]/` template + `ImageObject`/`CreativeWork` schema with real `contentLocation`
- Gallery category routes linking into them
- Each project linked from its service page and its city page

**Metric:** long-tail `{מוצר} ב{עיר}` impressions · gallery → lead rate. Depends on W2 §6.

---

### W6 · The city-page cull — weeks 5–8 (removes the largest liability)

16 byte-identical pages are a doorway pattern. Verdict per city, from the three-of-five evidence
gate in `local-seo-il`:

- **Keep 6–8** — differentiate with a real local project, the local ועדה's stance on מצללה
  exemptions, a distinct FAQ, and a genuinely different service emphasis.
- **301 the rest → `/locations/`** in `public/_redirects`, removed from the sitemap in the same
  commit.
- Prune the dense reciprocal cross-links between templated city pages — they amplify the signal.

**Never** build more city pages, and never any of the ~80 unbuilt service×city combos. At most
~18–24 combos ever exist, gated on delivered work.

**Metric:** indexed-page count (expected to *fall* — that is the goal) · city-query positions ·
map-pack presence. Depends on W2 §7.

---

### W7 · Deepen the money pages — weeks 6–12

The six service pages are the transactional layer and they are thin relative to what they must own.

- `/service/pergolas/` deepened until it genuinely owns **פרגולות אלומיניום** — spec block, materials
  and finishes, an installation-process section, real project references, its own FAQ set. Then the
  home page moves to a brand+category title (after the freeze lifts).
- `פרגולה חשמלית` stays an H2 until it clears the spoke gate (500+ unique words, own photos, own
  FAQs) → then `/service/pergolas/electric-pergola/`.
- `/services/` gets its own scope-setting intro instead of duplicating the home page.
- `/warranty/` built once terms are confirmed, and every sitewide "אחריות מלאה" mention linked to it.
- `accordion-products` display name → "סגירת מרפסות ותריסי אקורדיון" (slug unchanged) to match how
  people search.

**Metric:** GSC position on the six head terms · service-page → lead rate.

---

### W8 · Structure, navigation and engagement — weeks 6–10

- Breadcrumbs everywhere below the first level, matching `breadcrumbJsonLd`.
- Orphan and depth sweep (`link-architect`): every page ≤3 clicks from `/`, no page with zero
  inbound links, in-body contextual links over footer-only links.
- Hebrew anchor text varied and descriptive; footer city anchors stay plain city names.
- Gallery filtering that survives a page load (currently client-only), category routes indexed.
- Guides ↔ services ↔ projects cross-linking so the three silos feed each other.

**Metric:** crawl depth distribution · pages/session · scroll depth on guides · internal-link click
rate. Skills: `internal-linking-ia`.

---

### W9 · Conversion — weeks 6–16, one change per read window

Only starts once W1 has four weeks of baseline. In priority order, each shipped alone:

1. Service pre-selected in the form on service pages → `form_start`→`generate_lead` rate
2. Price-expectation content on service pages (linking to the cost guides) → the largest known
   friction point
3. "What happens after you call" process block near each CTA → form-abandon rate
4. Trust surfaces populated with the now-✅ facts (warranty, licences, real reviews) → lead rate
5. WhatsApp prompt with a photo ask on the gallery → `whatsapp_click`
6. Mobile CTA-bar copy and hierarchy test

A/B testing is not viable at this traffic volume — changes ship sequentially and are read against
the change log. Guides keep soft CTAs. Skill: `conversion-cro`.

---

### W10 · Performance, accessibility and security — continuous

- Weeks 5–6: **Consent Mode v2 + banner** — with the expected 20–40% measured-session drop written
  into the change log *first*.
- Week 7+: the GTM defer experiment (not before — it would confound the event baseline).
- CSP: after 2–3 weeks of clean report-only data, rename to `Content-Security-Policy`. Whoever edits
  GTM owns the allowlist.
- DMARC: `p=none` → `quarantine` → `reject` after 4–6 weeks of clean reports, once the real outbound
  sender (likely Gmail send-as) is covered by SPF/DKIM.
- Image sizing pass: explicit widths per slot, hero `priority`, everything else lazy, dimensions on
  every image. LCP < 2.5s, CLS < 0.05, JS < 120KB gz.
- Re-verify the shipped accessibility fixes after every layout change — `/accessibility/` makes a
  public claim, and an untrue one is legal exposure.
- `npm audit` monthly; dependabot PRs reviewed.

Skills: `performance-web-vitals`, `web-security-headers`.

---

## 4. Schedule

| Week | Focus |
|---|---|
| 1 | W1 measurement · W2 intake booked and run · GBP created |
| 2 | W3 entity graph + `sameAs` · review requests start · guide #1 drafted |
| 3–4 | W4 guides #1–2 · **measurement baseline accumulating — no CRO changes** |
| 5–6 | W6 city verdicts + 301s · Consent Mode v2 · W5 project template |
| 7–8 | W4 guides #3–4 · W5 first 6 projects · GTM defer experiment · W8 structure sweep |
| 9–10 | W7 pergolas deepened · W4 guides #5–6 · W9 CRO change #1 |
| 11–12 | W5 projects 7–12 · W7 `/warranty/` + spoke decision · W9 CRO change #2 |
| 13–16 | W7 remaining service pages · W9 CRO changes #3–4 · CSP enforced · DMARC ramp · full re-audit |

**Title freeze lifts ~2026-11-21** (week 13) — the home-page title change waits for it.

---

## 5. What we are deliberately not doing

Recorded so nobody proposes them again next quarter:

- More city pages, or any of the ~80 service×city combos. Bulk AI-generated "local" content.
- `Review`/`AggregateRating` schema for on-site testimonials — ever.
- A separate `/pricing/` page. A 7th top-level service. A Hebrew-slug migration.
- Paid Hebrew "מגזין"/index link farms. Keyword-stuffed footer anchors. A keyword-appended GBP name.
- Invented authors, credentials, per-city LocalBusiness nodes, or a fabricated address.
- `llms.txt` treated as an AI-visibility fix. Enforcing the CSP before its report window closes.
- Any claim in the 🔶 list, however plausible.
- Multiple simultaneous conversion changes.

---

## 6. Definition of done, and what success looks like

Nothing is "done" until its metric is named and its baseline is written into
`docs/measurement-plan.md`, and every shipped change has a dated row there.

| Horizon | Expected |
|---|---|
| 6 weeks | Events firing · GBP live with first reviews · lead volume known for the first time · permit guide indexed |
| 3 months | Guides ranking for permit/cost queries · city count down and quality up · brand search resolves to us · assistants name us correctly |
| 6 months | Head-term movement on פרגולות אלומיניום · long-tail project queries landing · lead flow attributable by channel · directories still hold some top slots — that is expected, not a failure |

**The single highest-leverage action in this entire plan** is the 90-minute session with Yossi. Two
of the nine workstreams cannot start without it, and three more are capped by it.
