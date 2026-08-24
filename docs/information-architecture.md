# Information architecture — the URL map

The target structure, what exists, and what is gated. Read with `docs/keyword-map.md` (which keyword
each URL owns) and `docs/seo-guardrails.md` (what may not be built at all).

## Live today

```
/                          brand + category            → 6 services, gallery, locations, contact
├── /services/             hub (⚠️ duplicates home copy — needs its own intro)
│   └── /service/{pergolas | fences-gates | wall-cladding | decks |
│                 outdoor-kitchen | accordion-products}/
├── /locations/            hub
│   └── /locations/{16 cities}/    ⚠️ byte-identical doorway pages
├── /guides/               ← live 2026-08-24, in the primary nav
│   ├── pergola-permit/
│   └── aluminum-vs-wood-pergola/
├── /gallery/
├── /about/  /contact/
└── /privacy/  /terms/  /accessibility/
```

Measured 2026-08-24 on the built output: **no orphans** (only `/404/`, correctly), every route at
click depth ≤2 from `/`, 31 routes at depth 1. Re-run with the `link-architect` agent after any
structural change.

English slugs only. `trailingSlash: true` — every URL ends in `/`, and canonicals must match.

## Target structure

```
/
├── /services/                       hub with its own scope-setting intro
│   └── /service/{6}/                the money pages, deepened
│       └── /service/pergolas/electric-pergola/     spoke — gated
├── /locations/
│   └── /locations/{6–8 keepers}/    differentiated; the rest 301 → /locations/
│       └── /locations/{city}/{service}/            ≤18–24 combos ever, gated on delivered work
├── /guides/                         the commercial + informational silo — currently ZERO coverage
│   ├── pergola-permit/              היתר · חוק הפרגולות · מצללה פטור
│   ├── pergola-cost/                the ENTIRE price cluster (there is no /pricing/ page)
│   ├── balcony-enclosure-permit/    + -cost/
│   ├── deck-cost/
│   ├── aluminum-vs-wood-pergola/    and the other X-או-Y comparisons
│   └── pergola-sukkah/              seasonal traffic, evergreen URL ("מותאמת", never "כשרה")
├── /projects/{slug}/                real projects — the anti-doorway substance
├── /warranty/                       target of every sitewide "אחריות מלאה" mention
└── /gallery/ (+4 category routes)
```

## Gates (nothing here ships without passing `new-page-gate`)

| URL type | Gate |
|---|---|
| Guide | 500+ unique words · an answer block per `aeo-answer-content` · every fact ✅ in the evidence register · the money link to its service page |
| Service spoke | 500+ unique words · own photos · own FAQs. Otherwise it stays an H2 on the parent |
| City page (keep) | 3 of the 5 evidence items in `local-seo-il` · passes the token test |
| Service×city | real delivered work in that city · max ~18–24 of 96, ever |
| Project page | real photos + city + year + product + the constraint solved |
| `/warranty/` | blocked — needs confirmed warranty terms from Yossi |

**Phase-2 hard cap: ~12 new or rewritten pages**, each individually evidence-gated. The ~80 unbuilt
service×city combinations are never built. Never a 7th top-level service.

## Link flow

| From | To |
|---|---|
| `/` | 6 services · gallery · locations hub · contact |
| `/services/` | 6 services, with its own framing text |
| `/service/{slug}/` | 2–3 siblings · its guides · gallery filtered to its category · 1–2 cities with real work · contact |
| `/guides/{slug}/` | **its service page, above the fold** · 1–2 related guides |
| `/locations/{city}/` | parent hub · the services actually delivered there · projects in that city |
| `/projects/{slug}/` | its service · its city · gallery |
| footer | services · cities (plain names, never keyword-stuffed) · legal |

Every page within **3 clicks** of `/`. No orphans. In-body contextual links beat footer links.
Breadcrumbs below the first level, matching `breadcrumbJsonLd` exactly.

## Retirement

A page that fails its gate on review is **301'd to its closest parent** in `public/_redirects` —
never left thin, never blanket-redirected to home, never merely noindexed. Remove it from
`app/sitemap.ts` in the same commit or the `postbuild` guard will fail the build.

⚠️ `public/_redirects` **cannot match on hostname**. Host-level redirects (www→apex) are zone
Redirect Rules in the Cloudflare dashboard.
