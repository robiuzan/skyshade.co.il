---
name: internal-linking-ia
description: Information architecture and internal linking for skyshade — the hub-and-spoke model, link budgets per page type, Hebrew anchor-text rules, breadcrumbs, orphan detection, navigation structure, and how equity should flow from the home page to money pages. Use when adding a page, restructuring navigation, or auditing crawl depth and link equity. Triggers: "internal links", "navigation", "menu", "breadcrumbs", "orphan page", "site structure", "crawl depth", "anchor text", "silo".
---

# Information architecture and internal linking

## The model

```
/                     brand + category, links to all 6 services, the gallery, and /locations/
├── /services/        hub — must have its own intro; today it duplicates home copy
│   └── /service/[slug]/ ×6      the money pages
│       └── (spokes, gated)      /service/pergolas/electric-pergola/
├── /locations/       hub → 6–8 surviving cities (see local-seo-il)
│   └── /locations/[city]/
├── /gallery/         → /projects/[slug]/ (planned) — the proof layer
├── /guides/[slug]/   (planned) — the commercial/informational silo
├── /warranty/        (planned) — target of every sitewide "אחריות מלאה" mention
└── /about/ /contact/ /privacy/ /terms/ /accessibility/
```

Every page must be reachable within **3 clicks** of `/`. Crawl depth 4+ is where this site's city
pages were before the nav fix.

## Link budget by page type

| Page | Outbound internal links |
|---|---|
| Home | all 6 services, gallery, locations hub, contact — no more |
| Service page | 2–3 sibling services, the relevant guides, gallery filtered to its category, 1–2 city pages where real work exists, contact |
| City page | its parent hub, the 2–3 services actually delivered there, the projects in that city |
| Guide | the service page it supports (**the money link**, above the fold), 1–2 related guides, contact |
| Project page | its service, its city, the gallery |
| Gallery | the service page for each category |

Rules: no page with **zero** inbound internal links (orphan). No money page more than one click from
a hub. Contextual in-body links outrank footer links — a link only in the footer is a weak link.

## Anchor text (Hebrew)

- Descriptive and varied: `פרגולות אלומיניום`, `מערכות ההצללה שלנו`, `איך בוחרים פרגולה` — never
  `כאן`, `לחצו כאן`, `קרא עוד` as the only anchor.
- Do not repeat the exact-match anchor on every page; vary naturally.
- Footer city anchors are **plain city names**. Keyword-stuffed geo anchors are a doorway signal.
- One link per target per page is enough; the first one is what counts.

## Navigation

- Services live in the primary nav (a dropdown), not buried — this was an audit fix; do not regress
  it. `navItems` is in `lib/content.ts`.
- The mobile menu must stay keyboard-operable and announce state (`aria-expanded`, focus trap,
  Escape) — also an audit fix.
- `MobileCtaBar` is sticky and must never overlap footer content (the `h-16` spacer in
  `app/layout.tsx` exists for that).
- Breadcrumbs on every page below the first level, matching `breadcrumbJsonLd` exactly.

## Orphan and depth audit

```bash
# every internal href in the codebase
grep -rhoP 'href="/[^"]*"' app components | sort | uniq -c | sort -rn

# routes that exist
find app -name 'page.tsx' | sed 's|app||;s|/page.tsx|/|'
```

Diff the two: routes with no inbound href are orphans. Cross-check against `out/sitemap.xml` after a
build. Report findings as `page → missing inbound links from [x, y]`, with the specific sentence
where each link should go.

## When you add a page

Adding a URL without planning its inbound links is how orphans happen. In the same change: the hub
link, at least two sibling links, and the breadcrumb. Write which pages you edited into the commit
message.
