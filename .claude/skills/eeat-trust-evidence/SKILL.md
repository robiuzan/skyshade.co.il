---
name: eeat-trust-evidence
description: The evidence gate for skyshade — what may be claimed on the site, how a claim gets promoted from unverified to publishable, the trust surfaces that actually move Israeli homeowners, and the fabrication lines that must never be crossed. Use before publishing any claim about the business, and when planning E-E-A-T or trust work. Triggers: "E-E-A-T", "trust", "credibility", "can we say", "testimonials", "reviews", "warranty", "years of experience", "certifications", "about page".
---

# E-E-A-T and the evidence gate

This site's binding constraint is not code — it is **corroborated substance**. No GBP, no reviews,
no prices, no named human, no address, no ח.פ., and 55 photos with zero facts attached. Every
trust improvement is either (a) surfacing something real that already exists, or (b) blocked on
Yossi. Nothing is ever solved by writing a more confident sentence.

## The gate

Before any claim ships, find its row in `docs/evidence-register.md`:

| Status | Meaning | You may |
|---|---|---|
| ✅ confirmed | owner-supplied, dated, with a source noted | publish, mark up in schema |
| 🔶 unverified | assumed, derived, or developer-written | **not publish** — leave the marker, add a register row |
| ⛔ retracted | was live, found false, removed | never re-add without new evidence |

If a claim has no row, it is 🔶 by default. Add the row rather than guessing.

## Currently 🔶 or blocked

`trustStats` and `testimonials` in `lib/content.ts` (unrendered — leave them that way) · years of
experience beyond the manifest's `foundedYear: 2009` · warranty terms · licences, insurance,
standards (ת״י) · project counts · price bands · named team members · physical address · ח.פ. ·
review counts and ratings.

## Never

1. **Fabricated review markup.** `Review`/`AggregateRating` for on-site testimonials — not even
   after the quotes are verified. Review equity lives on the GBP.
2. **Invented people.** No author bylines, no `Person` schema, no "the team" photos that are stock.
3. **Invented credentials.** No `hasCredential`, no ת״י numbers, no "מבוטח ומורשה" without a
   document.
4. **Superlatives as fact.** `#1`, `הטוב ביותר`, `המובילה בישראל` — unverifiable, and in Israel
   arguably misleading advertising.
5. **Borrowed proof.** Manufacturer logos, association badges or client logos without permission.
6. **Incentivized or sentiment-gated review solicitation.** Ask everyone, never filter.

## What actually moves an Israeli homeowner (in order)

1. **Google reviews on a real GBP** — the single highest-leverage trust asset, and it is not on-site.
2. **Real projects with facts**: city, year, size, material, the constraint solved, before/after.
   This is also the anti-doorway substance for city pages and the most citable content for AI.
3. **A named, photographed human** who is accountable — with a phone number that reaches him.
4. **Written warranty terms**, stated plainly, on a `/warranty/` page that the sitewide
   "אחריות מלאה" mentions link to.
5. **Legal identity**: ח.פ., address, insurance — footer and `/about/`.
6. **Process transparency**: what happens after the call, timelines, who comes, what it costs to
   find out.
7. **Honest limits**: what they don't do, lead times, when a permit *is* required. Stating a limit
   raises credibility more than another superlative.

## The intake session

Roughly a third of the highest-value work is blocked on one structured session with Yossi. The
checklist is `audit-roadmap-full.md` §7. Everything on the "blocked" list above is a question in it.
Until it happens, the correct move is to **prepare the slots** — build the `/warranty/` page shell,
the project-page template, the About structure — and leave the values 🔶, not to fill them with
plausible text.

## Legal lines (Israel)

- Permit copy: conditional-exemption wording only, with the not-legal-advice line. Reviewed text is
  in `lib/content.ts`; changes get re-reviewed.
- `מותאמת לסוכה`, never `כשרה לסוכה`.
- Marketing consent (חוק הספאם): unbundled, unchecked, required before any nurture beyond the
  specific request. The consent checkbox is already in `LeadForm` — do not pre-check it.
- The privacy policy must stay truthful about third parties (Web3Forms, Google, Cloudflare).
