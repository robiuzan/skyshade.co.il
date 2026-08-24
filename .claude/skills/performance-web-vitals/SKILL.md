---
name: performance-web-vitals
description: Core Web Vitals and front-end performance for skyshade's static export — the LCP path through the imgquarry CDN, image sizing and priority, Heebo font loading, JS and GTM cost, CLS traps, caching headers, and how to measure field data rather than guess. Use when the site feels slow, PSI/CrUX regresses, or before shipping anything that adds weight. Triggers: "performance", "Core Web Vitals", "LCP", "CLS", "INP", "PageSpeed", "slow", "images", "bundle size", "font".
---

# Performance

Static export on Cloudflare's edge — the network is not the problem. The costs on this site are
**images, fonts, and GTM**, in that order.

## Budgets

| Metric | Budget | Notes |
|---|---|---|
| LCP (mobile, field) | < 2.5s | almost always the hero image |
| CLS | < 0.05 | images without dimensions; the sticky CTA bar; font swap |
| INP | < 200ms | little JS here — regressions come from added third-party tags |
| JS transferred | < 120KB gzip | `framer-motion` was removed once; do not reintroduce an animation lib |
| Hero image | < 150KB | via the CDN resizer at the right width |

## Images — the LCP path

Photos come from `imgquarry.com` through the Cloudflare image resizer, via `srcFor()`
(`@ishub/site-kit/media`). `next/image` optimization is **off** (`unoptimized: true`) — there is no
optimizer on static hosting, so sizing is entirely your responsibility.

- Always request an explicit `width` matching the rendered slot; never ship a 2400px file into a
  600px card.
- `format=auto` (AVIF/WebP negotiation) and `quality=85` are the defaults in the existing calls —
  match them.
- **The hero image gets `priority` / `fetchpriority="high"` and is never lazy-loaded.** Everything
  below the fold is `loading="lazy"`.
- Every `<img>` carries `width` and `height` (or an aspect-ratio box). Missing dimensions is the #1
  CLS cause here.
- `<link rel="preconnect">` to the media host is already in `app/layout.tsx` — keep it.
- Origin cache on the image host should be `public, max-age=86400, stale-while-revalidate=604800`.

## Fonts

Heebo via `next/font/google`, subsets `hebrew` + `latin`, `display: swap`, exposed as a CSS
variable. Adding a weight or a second family is a measurable cost — justify it. Never load a font
from a `<link>` to a third-party host (it also breaks the CSP).

## JS and third parties

- GTM lives in `<head>` deliberately (it was at the top of `<body>`, which delayed tag firing and
  undercounted fast bounces). Do not move it back "for performance" without reading
  `docs/measurement-plan.md` — a defer experiment is scheduled for week 7+, *after* the event
  baseline exists.
- Every new tag in GTM is a performance change **and** a CSP change (`public/_headers`).
- `"use client"` only where interactivity demands it. `LeadForm`, `FilterableGallery` and the mobile
  menu are the legitimate ones.

## Caching (`public/_headers`)

`/_next/static/*` is `max-age=31536000, immutable` — correct, because those filenames are
content-hashed. HTML stays short-lived. Do not add long max-age to HTML.

## Measuring

Field data first (CrUX / GSC Core Web Vitals report), lab second. PSI on a single run is noise:

```bash
npm run build && du -sh out && find out/_next/static -name '*.js' -size +50k -exec ls -lh {} \;
```

Record before/after in `docs/measurement-plan.md`. A performance claim without a field-data
reference is an opinion — say so if that is all you have.

## Accessibility rides along

Contrast (the footer `/85` and `/80` fixes, the WhatsApp `#0E7A34` token), focus visibility, the
keyboard-operable mobile menu, and `aria-*` on the sticky bar are all shipped audit fixes. Re-check
them after any layout change — regressions here are also legal exposure under the Israeli
accessibility regulations, and `/accessibility/` makes a public claim about the site.
