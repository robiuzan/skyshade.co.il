# Sprint roadmap

**Written:** 2026-09-01 · **Horizon:** 16 weeks, eight 2-week sprints · **Start:** 2026-09-01

[phase-2-improvement-plan.md](phase-2-improvement-plan.md) holds **what** and **why** as ten
workstreams (W1–W10). This file holds **when** and **done-when**, and folds in the items that came
out of the 2026-09-01 documentation pass. Where they disagree about scope, the improvement plan
wins; where they disagree about ordering, this file wins.

Every sprint ships a row to [measurement-plan.md](measurement-plan.md). A sprint with no row did
not happen.

---

## The two constraints that set the whole order

1. **Nothing is measurable yet.** GTM holds one tag; `form_start`, `generate_lead` and
   `lead_submit_failed` die in the dataLayer. Until that is fixed, no CRO change is attributable —
   ever, retroactively. This is why Sprint 1 is unglamorous.
2. **A third of the work is blocked on one 90-minute conversation.** Prices, warranty, address,
   ח.פ., project facts, named team, per-city delivered work. `⛔ owner` below means exactly that.

**The single highest-leverage action in this roadmap is booking the owner session.** Do it before
reading further; everything in Sprints 4–7 is capped by it.

## Sprint cadence rules

- **One substantive conversion/measurement change per read window** — 4 weeks or 200 sessions,
  whichever is later. Content additions are additive and exempt.
- **Titles are frozen until ~2026-11-21** (Sprint 6/7 boundary).
- A page needing a 🔶 fact is **not written**; its slot is built and the question goes to the intake.
- Anything adding weight is checked against [performance-budgets.md](performance-budgets.md) —
  the JS budget has **0.7 KB of headroom**.
- Anything adding a claim is checked against [evidence-register.md](evidence-register.md).

---

## Sprint 1 · 2026-09-01 → 09-14 — Make it measurable

**Goal:** the site becomes attributable, and the form the baseline will be measured against is
already correct.

**Order within the sprint matters.** Ship the form fixes *first*, deploy, *then* build the GTM
tags, *then* start the four clean weeks. A form fix landing mid-baseline confounds the baseline;
landing it before the window opens costs nothing.

| # | Item | W | Blocker |
|---|---|---|---|
| 1.1 | ~~`autocomplete` on `LeadForm`~~ — ✅ **already present**, verified 2026-09-01. No work | — | — |
| 1.2 | ✅ **Done 2026-09-01** — success state `role="status"` + focus restore + `aria-busy` (SC 4.1.3) | new | — |
| 1.2b | ✅ **Done 2026-09-01** — the rest of the pre-baseline `LeadForm` batch: per-field validation with focus + `aria-invalid`, a 9-digit phone floor, placeholder contrast (SC 1.4.3), `data-cta` on the 4 unlabelled conversion links, phone field `text-end`, mirrored Send icon, Hebrew `ב` binding | audit | — |
| **1.2c** | 🔴 **P0, GA4 Admin, ~10 min** — redact URL query params `text, name, phone, message, service` on the skyshade data stream. Enhanced Measurement's Outbound clicks would otherwise write a real visitor's **name and phone** into GA4 from the WhatsApp recovery link. Not fixable retroactively | audit | ⛔ dashboard |
| **1.2d** | Check and decide the GA4 "Form interactions" toggle — its auto `form_start` would merge with the site's own under different scoping, sending ~half the rows to `(not set)` | audit | ⛔ dashboard |
| 1.3 | Deploy 1.2–1.2b in one commit and verify live · **1.2c before any tag fires** | — | — |
| 1.4 | Build the six GA4 event tags in GTM, **every trigger scoped `Page Hostname equals skyshade.co.il`** | W1 | — |
| 1.5 | GA4: mark `generate_lead`, `phone_call_click`, `whatsapp_click` as conversions; create the four custom dimensions | W1 | — |
| 1.6 | GA4 custom insight: alarm on `lead_submit_failed > 0` | W1 | — |
| 1.7 | Pull the 90-day **device-category split** from existing GA4 page views and record it | new | — |
| 1.8 | Submit the sitemap; import into Bing Webmaster Tools | W1 | — |
| 1.9 | **Book and run the owner intake** ([owner-intake-checklist.md](owner-intake-checklist.md)) | W2 | ⛔ owner |
| 1.10 | Create the Google Business Profile; begin review requests | W2 | ⛔ owner |

**Done when:** all six events verified firing in GA4 DebugView with parameters attached · none of
the `SS - …` tags fire on a second fleet domain (verified in Preview) · the `lead_submit_failed`
alarm test-fires · a dated baseline row per KPI exists in
[measurement-plan.md](measurement-plan.md) · the device split is written down.

**Must not ship:** any other CTA, form or layout change after 1.3 lands.

---

## Sprint 2 · 2026-09-15 → 09-28 — Baseline window (content only)

**Goal:** four clean weeks of measurement accumulate, undisturbed. Sukkot falls in this window and
`/guides/pergola-sukkah/` is already live — this is its traffic peak, so it is the worst possible
fortnight for risky changes.

| # | Item | W | Blocker |
|---|---|---|---|
| 2.1 | Populate `manifest.schema.sameAs` fully; propagate the canonical description verbatim to GBP + directories | W3 | 1.10 |
| 2.2 | Israeli directories with identical NAP: b144, dapey zahav, zap, easy.co.il | W3 | ⛔ owner (address/ח.פ.) |
| 2.3 | Draft the next guide (`/guides/balcony-enclosure-permit/`) — content only, no CTA changes | W4 | — |
| 2.4 | **Verification-only WCAG 2.1 pass** — measure the twelve criteria in [accessibility-and-i18n.md](accessibility-and-i18n.md) §3, record status, change nothing | new | — |
| 2.5 | Baseline AI-assistant prompt set; record answers verbatim with cited sources | W3 | — |
| 2.6 | Re-verify the AI-crawler matrix (13 UAs → 200) | W3 | — |

**Done when:** the guide is drafted and gated but **not necessarily shipped** · the WCAG 2.1 status
table has a measured value in every row · the entity and crawler checks are logged.

**Must not ship:** anything touching a CTA, the form, layout, or the tag container. The window's
value is its cleanliness.

---

## Sprint 3 · 2026-09-29 → 10-12 — Consent, then the city cull

**Goal:** the two changes that deliberately *reduce* numbers, shipped with their expected drops
written down first.

⚠️ These two confound each other if shipped together. **Week 1: consent. Week 2: the 301s.** They
affect different metrics (measured sessions vs. indexed pages and city-query positions), which is
what makes sharing a sprint survivable — but not sharing a week.

| # | Item | W | Blocker |
|---|---|---|---|
| 3.1 | **Write the expected 20–40% measured-session drop into the change log**, then ship Consent Mode v2 + banner (height reserved — CLS) | W10 | 1.4 + 4 clean weeks |
| 3.2 | City verdicts: keep 6–8 against the three-of-five evidence gate, `301` the rest → `/locations/` in `public/_redirects`, removed from `app/sitemap.ts` **in the same commit** | W6 | ⛔ owner (per-city work) |
| 3.3 | Prune the dense reciprocal cross-links between templated city pages | W6 | 3.2 |
| 3.4 | Non-text-contrast fixes — borders, focus rings, icons (SC 1.4.11) | new | 2.4 |

**Done when:** the session drop is logged *before* the banner is live · indexed-page count is
falling (that is the goal, not a regression) · the `postbuild` sitemap guard passes · surviving
city pages each carry a real differentiator.

---

## Sprint 4 · 2026-10-13 → 10-26 — Substance: guides and projects

**Goal:** the anti-doorway content that nothing else can substitute for.

| # | Item | W | Blocker |
|---|---|---|---|
| 4.1 | Ship `/guides/balcony-enclosure-permit/` | W4 | — |
| 4.2 | `/projects/[slug]/` template + `ImageObject`/`CreativeWork` schema with real `contentLocation` | W5 | — |
| 4.3 | First 6 project pages — city, year, product, size, the constraint solved | W5 | ⛔ owner (project facts) |
| 4.4 | Link projects from their service page and their city page; gallery category routes | W5/W8 | 4.2 |
| 4.5 | Orphan + crawl-depth sweep; Hebrew anchor-text variation | W8 | — |
| 4.6 | GTM defer experiment (week 7+ — **now permitted**, the baseline exists) | W10 | 1.4 |

**Done when:** every new URL passed `new-page-gate` · no orphans, everything ≤3 clicks from `/` ·
long-tail `{מוצר} ב{עיר}` impressions have a baseline of zero recorded against them.

---

## Sprint 5 · 2026-10-27 → 11-09 — The money pages + CRO change #1

| # | Item | W | Blocker |
|---|---|---|---|
| 5.1 | Deepen `/service/pergolas/` until it genuinely owns **פרגולות אלומיניום** — spec block, materials and finishes, installation process, real project references, its own FAQ set | W7 | — |
| 5.2 | Ship `/guides/pergola-cost/` — **the entire price cluster** | W4 | ⛔ owner (price bands) |
| 5.3 | **CRO change #1**, alone: price-expectation content on service pages, linking to the cost guides | W9 | 5.2 |
| 5.4 | "What happens after you call" block adjacent to the CTAs — **no response-time promise** | W9 | — |

**Done when:** `/service/pergolas/` clears the head-term substance bar · CRO #1 has a named metric
and a pre-recorded baseline · nothing else conversion-related shipped in the same window.

If 5.2 is still blocked, **5.3 does not ship** and 5.4 takes its read window instead. Do not
substitute a guessed price band.

---

## Sprint 6 · 2026-11-10 → 11-23 — Trust surfaces + CRO change #2

| # | Item | W | Blocker |
|---|---|---|---|
| 6.1 | Project pages 7–12 | W5 | ⛔ owner |
| 6.2 | `/warranty/`, and every sitewide "אחריות מלאה" mention linked to it | W7 | ⛔ owner (warranty terms) |
| 6.3 | **CRO change #2**, alone: trust surfaces populated with the now-✅ facts | W9 | intake |
| 6.4 | `פרגולה חשמלית` spoke decision — 500+ unique words, own photos, own FAQs, or it stays an H2 | W7 | — |
| 6.5 | Tier-1 personalization: the **open / closed right now** indicator near the CTAs, from `manifest.openingHours`, height reserved, zero new requests | new | — |

**Done when:** no 🔶 claim shipped · 6.5 renders correctly with JS disabled (default state complete
and true) and contributes 0 CLS.

⚠️ 6.3 and 6.5 are both conversion changes. **One per read window** — if both are ready, 6.5 goes
first (it is smaller and reversible) and 6.3 moves to Sprint 7.

---

## Sprint 7 · 2026-11-24 → 12-07 — Titles unfreeze, CSP enforced

**The 90-day title freeze lifts ~2026-11-21.**

| # | Item | W | Blocker |
|---|---|---|---|
| 7.1 | Home page → brand+category title, now that `/service/pergolas/` owns the head term | W7 | 5.1 + freeze lifted |
| 7.2 | `/service/accordion-products/` title → keyword-first (`סגירת מרפסת`) | W7 | freeze lifted |
| 7.3 | Remaining service pages deepened | W7 | — |
| 7.4 | CSP: rename `Content-Security-Policy-Report-Only` → `Content-Security-Policy` after 2–3 clean weeks | W10 | consent + tag set final |
| 7.5 | **CRO change #3**, alone | W9 | — |

**Done when:** each retitled page starts its own fresh 90-day clock, logged · the CSP is enforced
with **no** console violations from the real tag set · the `_headers` allowlist covers every host
the container actually loads.

⚠️ 7.4 is the change most likely to break something silently. Verify against the live tag set, not
against the spec.

---

## Sprint 8 · 2026-12-08 → 12-21 — Ramp, re-audit, decide

| # | Item | W | Blocker |
|---|---|---|---|
| 8.1 | DMARC `p=none` → `quarantine`, once the real outbound sender is covered by SPF/DKIM | W10 | 4–6 clean weeks of reports |
| 8.2 | **CRO change #4**, alone | W9 | — |
| 8.3 | Full re-audit: `/seo-check`, plus a manual accessibility pass | — | — |
| 8.4 | Decide whether `/accessibility/` may be updated from WCAG 2.0 AA to 2.1 AA | new | every §3 row verified |
| 8.5 | `/growth-review`: what moved, what did not, and the single next change | — | — |
| 8.6 | Re-assess `npm audit` and the server-side-tagging decision against measured data | — | — |

**Done when:** the change log accounts for every shipped change with a dated row · 8.4 is decided
on evidence, not optimism — **if any 2.1 criterion is unverified, the statement does not change**.

---

## Not scheduled, on purpose

- **English / multilingual.** Gated on measured English demand + a human translator + a fresh legal
  review. See [accessibility-and-i18n.md](accessibility-and-i18n.md) §6. The correct answer today
  is no.
- **Geolocation-based content swapping.** Tier 3 in
  [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4 — cloaking risk, doorway
  risk, and the Geolocation API is disabled in `public/_headers`. The open/closed indicator (6.5)
  delivers most of the intended value with none of the exposure.
- **Server-side GTM / a Cloudflare Worker proxy.** Revisit only if the measured gap between GA4
  `generate_lead` and the actual inbox count is material.
- **A CRM script, chat widget, or Ads/Meta pixel on the page.** CRM integrates at the webhook layer;
  the JS budget has 0.7 KB of headroom.
- More city pages, the ~80 service×city combos, `Review`/`AggregateRating` schema, a `/pricing/`
  page, a 7th top-level service, a Hebrew-slug migration. See
  [phase-2-improvement-plan.md](phase-2-improvement-plan.md) §5.

## Slip rule

If a sprint slips, **the measurement and cadence rules do not slip with it.** A CRO change moves to
the next window; it never doubles up. Two conversion changes in one window is the failure mode this
entire roadmap is shaped to avoid — it makes both of them permanently unreadable.
