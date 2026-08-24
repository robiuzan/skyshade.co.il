---
description: Produce a gated content brief for a proposed page or section — gate verdict first, then keyword owner, outline, answer blocks, schema, links and metadata.
---

Produce a content brief for: **$ARGUMENTS**

Work in this order and stop at the first failure.

## 1. The gate (`new-page-gate` skill)

Answer explicitly: may this page exist at all?

- Does the keyword already have an owner in `docs/keyword-map.md`? If yes → the deliverable is
  "strengthen the owner", and the brief is for a **section**, not a page.
- 500+ genuinely unique words available now?
- At least one fact no competitor could publish?
- Every fact ✅ in `docs/evidence-register.md`?
- ≥3 realistic inbound internal links?
- **Token test:** delete the city/keyword token — does it still read as useful?

If the gate fails, say so plainly, name the alternative (a section on which page), and stop.

## 2. The brief

- **Owning URL and keyword cluster** — plus the proposed `docs/keyword-map.md` row
- **Intent and reader** — what they are trying to decide at that moment
- **Outline** — H1, then question-form H2s from `docs/aeo-question-bank.md`
- **Answer blocks** — for each H2, the exact Hebrew 40–60 word answer, paste-ready
- **The unique fact** — which one, and where it comes from
- **Media** — which catalog images, which is the LCP hero
- **Schema** — types, and the FAQ entries that must match the visible text verbatim
- **Internal links** — in (from where, with the sentence) and out
- **Metadata** — title ≤48 chars, description ≤160, canonical with trailing slash
- **CTA pattern** — per page type (guides get a soft service link, not a hard sell)
- **Measurement** — the metric this page moves and its starting value

## 3. Flag what is missing

List every `{🔶 …}` placeholder and add it to `docs/owner-intake-checklist.md` if it is not there.
**Never fill a blocked fact with a plausible value.**

Consult the `keyword-map-governance`, `aeo-answer-content`, `hebrew-rtl-copy` and
`eeat-trust-evidence` skills. Use the `hebrew-copywriter` agent for the Hebrew drafting.
