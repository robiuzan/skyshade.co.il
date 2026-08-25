# Evidence register — what may be claimed on this site

The gate: **a claim ships only if it has a ✅ row here.** No row = 🔶 = not publishable. This is the
file the `eeat-trust-evidence` skill and the `eeat-trust-auditor` agent enforce, and the reason the
site does not currently make claims its competitors make freely.

| Status | Meaning | You may |
|---|---|---|
| ✅ | owner-supplied or independently verifiable, with a source and a date | publish, mark up in schema |
| 🔶 | assumed, derived, or developer-written | **not publish** — leave the marker, ask the question |
| ⛔ | was live, found false, removed | never re-add without new evidence |

---

## ✅ Confirmed

| Claim | Value | Source | Date | Used in |
|---|---|---|---|---|
| Brand name | סקיי שייד / Sky Shade | hub roster | — | everywhere; GBP name must match exactly |
| Founded | 2009 | manifest `foundedYear` | — | `/about/`, schema `foundedDate` |
| Phone / WhatsApp | 050-5063152 · +972505063152 | manifest | — | all CTAs, schema `telephone` |
| Email | yossi@skyshade.co.il | manifest | — | contact, schema |
| Hours | א׳–ה׳ 08:00–18:00 · ו׳ 08:00–13:00 | manifest | — | schema `openingHoursSpecification` |
| Service area | שירות בכל הארץ | manifest | — | schema `areaServed` |
| Price range | ₪₪ | manifest | — | schema only — **not** a price claim in copy |
| Services offered | the 6 in `lib/site-config.ts` | live site | — | nav, hubs, schema `Service` |
| Project photos | the Media Studio catalog | own work | 2026-08 | gallery — ⚠️ no city/date/size attached yet |
| Permit position | conditional exemption, reviewed wording | legal review | 2026-08-17 | `lib/content.ts` FAQ + schema, verbatim |

---

## 🔶 Unverified — blocked on Yossi

Everything here is a question in the owner intake ([owner-intake-checklist.md](owner-intake-checklist.md)).
Until a row moves to ✅, the correct move is to **build the slot and leave the value empty** — never
to write a plausible number.

| Claim | Why it is blocked | What it unblocks |
|---|---|---|
| Physical address | none supplied. The GBP pin implies a locality, but whether the address may be published — and whether the profile is a service-area business with a deliberately hidden address — is the owner's decision, **not an inference from a maps link**. Do not lift the coordinates out of the share URL | schema `PostalAddress` + `geo`, footer, local trust |
| ח.פ. / legal entity | none supplied | footer, `/terms/`, legal credibility |
| Warranty terms (years, what is covered) | never stated | `/warranty/` page, the sitewide "אחריות מלאה" mentions |
| Licences, insurance, standards (ת״י) | no documents | `/about/`, trust bar, schema |
| Real review count and rating | a GBP now exists (2026-08-25) but its review volume is unread | GBP only — **never** on-site `AggregateRating`, regardless of how many reviews it accrues |
| Project count | `trustStats` in `lib/content.ts` is developer-written | trust bar, `/about/` |
| Price bands per product | never stated | the `/guides/…-cost/` cluster — the largest keyword gap |
| Named team + photos | none supplied | E-E-A-T, `Person` schema, `/about/` |
| Response time (e.g. "תוך 24 שעות") | never confirmed | form copy, CTA microcopy |
| Per-city delivered projects | unknown | which city pages survive the doorway cull |
| Lead time / installation duration | never confirmed — ⚠️ **but the pergola FAQ already asserts "1–3 ימי עבודה" live** (`lib/content.ts:227`, and it ships inside FAQPage markup). Pre-existing, not newly added. Confirm it or correct it at the intake; do not extend the pattern to other services meanwhile | service pages, guides, AI-citable facts |
| Materials / suppliers / finishes | partially known from copy | spec tables, comparison guides |
| ~~Social profiles (Facebook, Instagram)~~ | ✅ **UNBLOCKED 2026-08-25** — GBP, Facebook and Instagram supplied by the owner and verified live | Done: `schema.sameAs` + `hasMap` + footer links. Still to do — add them to the hub roster, and see the GBP note below |

`trustStats` and `testimonials` in `lib/content.ts` are 🔶 **and currently unrendered**. Leave them
that way. The testimonials additionally carry a source admission that the wording was altered —
they are never eligible for review schema, even if the quotes are later confirmed.

---

## ⛔ Retracted — never re-add without new evidence

| Claim | Why it was removed | Date |
|---|---|---|
| A "no third parties" privacy statement | false — Web3Forms, Google and Cloudflare all receive data | 2026-08-17 |
| The original building-permit wording | legally wrong, and it had shipped in copy **and** FAQ schema | 2026-08-17 |
| A "#1 / leading" positioning claim | unverifiable; misleading-advertising exposure | 2026-08-17 |
| Rendered testimonials + trust stats | developer-completed under real customers' names | 2026-08-17 |
| An accessibility-contrast conformance claim that was untrue | the footer failed the ratio it claimed | 2026-08-17 |
| "הפכנו למובילים בתחום" on `/about/` | unverifiable superlative; misleading-advertising exposure | 2026-08-24 |
| "מאות פרויקטים בכל רחבי הארץ" on `/about/` | project count nobody has confirmed — same class as the removed `trustStats` | 2026-08-24 |

---

## Adding a row

Record the **value, the source, and the date you were told**. "Yossi said so on a call" is a valid
source — write it down with the date. An undated claim decays: prices, lead times and warranty terms
all need re-confirmation annually.
