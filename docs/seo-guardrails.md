# SEO guardrails — the bright lines

Read before writing ANY page. Full reasoning: `audit-roadmap-full.md` §9.

## Google spam-policy lines

1. **Doorway/scaled content.** A geo or variant page ships only if it would still be
   useful with the city/keyword token deleted (real local projects, verifiable
   municipality-specific facts, distinct FAQs). Pages that can't meet that within a
   quarter get 301'd to `/locations/`, not parked. Phase-2 hard cap: ~12 new/rewritten
   pages, each individually evidence-gated. The ~80 unbuilt service×city combos are
   **never** built. No bulk AI generation of "local" filler.
2. **Self-serving review markup.** `Review`/`AggregateRating` for on-site testimonials
   is never added — not even after the quotes are verified. Review equity lives on the
   Google Business Profile.
3. **Review solicitation.** Ask everyone, never incentivize, never gate by sentiment.
4. **Fabricated E-E-A-T.** No invented Person nodes, per-city LocalBusiness branches,
   `hasCredential` without a real licence, fake authors, or guessed project cities.
5. **Link spam.** No paid Hebrew "מגזין"/אינדקס link farms; sponsorships get
   `rel="sponsored"`. Footer city anchors stay plain names — never keyword-stuffed.
6. **GBP name is exactly "סקיי שייד"** — never keyword-appended.

## Israeli-legal lines

- Publish only owner-confirmed: price floors/bands, warranty years, standards/insurance
  claims, project counts, star glyphs, installation-deadline promises, green claims.
- Permit/regulation copy: conditional-exemption wording only (see the reviewed FAQ text
  in `lib/content.ts`), always with the not-legal-advice line; changes re-reviewed.
- "כשרה לסוכה" is never claimed — say "מותאמת לסוכה" and refer to the reader's rabbi.
- Marketing consent (חוק הספאם): unbundled, unchecked, and required before any nurture
  beyond the specific request.
- No PII into GA4, ever.

## Architectural lines

- One keyword → one owning URL (`docs/keyword-map.md`). Cost/price cluster lives under
  `/guides/…-cost/` — no separate `/pricing/` page.
- English slugs only; no Hebrew-slug migration.
- Titles ≤48 chars before the layout's `| סקיי שייד` suffix.
- `site.config.json` is hub-synced — page-level overrides live in code, not there.
- Never a 7th top-level service: variants are H2s first, nested spokes when substance exists.
