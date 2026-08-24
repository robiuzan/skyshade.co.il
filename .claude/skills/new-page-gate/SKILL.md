---
name: new-page-gate
description: The end-to-end procedure for shipping a new URL on skyshade — the evidence gate that decides whether it may exist at all, then the full build checklist (route, metadata, schema, links, sitemap, tracking, log). Use whenever a new page, guide, project, city or service page is proposed or built. Triggers: "new page", "add a guide", "create a service page", "new city", "should we build", "project page", "landing page".
---

# Shipping a new URL

A new URL is a cost: crawl budget, dilution, maintenance, and doorway risk. Most requests for a new
page are better served by a section on an existing one. Run the gate before writing a line.

## Gate 1 — may this page exist?

All must be true:

- [ ] The keyword/intent has **no owner** in `docs/keyword-map.md`, or this URL is the listed
      planned owner.
- [ ] Its intent is genuinely different from every existing page (not just different words).
- [ ] **500+ words that exist nowhere else on this site** are available *now* — not "will be added".
- [ ] It contains at least **one fact no competitor could publish**: a real project, a real number, a
      real municipal detail, a real photo of our work.
- [ ] Every fact in it is ✅ in `docs/evidence-register.md`.
- [ ] It can earn ≥3 inbound internal links from pages with equity.
- [ ] **The token test:** delete the city/keyword token from the page. Does it still read as useful?

Page-type extras:
- **City page** → the three-of-five evidence gate in `local-seo-il`. Phase-2 hard cap: ~12 new or
  rewritten pages total, each individually gated.
- **Service spoke** (e.g. `/service/pergolas/electric-pergola/`) → 500+ unique words, own photos, own
  FAQs. Otherwise it is an H2 on the parent.
- **Service×city** → real delivered work in that city. Max ~18–24 of 96 combos, ever.
- **Guide** → an answer block per `aeo-answer-content`, and the money link to its service page.
- **Project page** → real photos, city, year, product, and the constraint solved.

If the gate fails, say so plainly and propose the section-on-an-existing-page alternative. Do not
build it "as a stub to fill in later" — a thin page live is worse than no page.

## Gate 2 — build checklist

1. **Route** — `app/…/page.tsx`, `trailingSlash` means the canonical ends in `/`.
2. **Metadata** — title ≤48 chars, description ≤160, `alternates.canonical`. (`seo-metadata`)
3. **Content** — H1 once, question-form H2s, answer blocks, no sentence a competitor could publish
   verbatim. Hebrew per `hebrew-rtl-copy`.
4. **Media** — from the Media Studio catalog via `srcFor()`; hero gets `priority`, everything else
   lazy; explicit dimensions. (`performance-web-vitals`)
5. **Schema** — the right types for the route, `@id`-linked, FAQ text matching the page verbatim.
   (`schema-structured-data`)
6. **Internal links** — hub link in, ≥2 sibling links in, breadcrumb, and the outbound set from
   `internal-linking-ia`.
7. **Conversion** — the CTA pattern for this page type (`conversion-cro`). Guides get a soft link,
   not a hard sell.
8. **Sitemap** — add to `staticPaths` if it is a static route; `npm run build` must pass the
   `postbuild` guard.
9. **Keyword map** — add the owning row to `docs/keyword-map.md`.
10. **Measurement** — a dated row in `docs/measurement-plan.md` naming the metric this page moves and
    its starting value (usually zero).
11. **Verify live** after deploy (`qa-deploy-gate`), then request indexing in GSC.

## Retiring a page

Same rigour. A page that fails the gate on review gets **301'd to its closest parent** in
`public/_redirects` — never left to rot, never blanket-redirected to home, never merely noindexed.
Remove it from the sitemap in the same commit or the build guard will catch you.
