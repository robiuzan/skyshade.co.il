# Performance budgets

**Written:** 2026-09-01 · Procedure: the `performance-web-vitals` skill.
Measured values below are from the local build of **2026-09-01** unless stated. They are
**build-artifact measurements, not field data** — see §6 for what actually counts.

---

## 1. What performance means on this site

Static HTML on Cloudflare's edge. **The network is not the problem and never will be.** The
budget is spent in exactly four places:

1. Images — the hero especially. Served from `imgquarry.com` through the Cloudflare resizer via
   `srcFor()`, with `images: { unoptimized: true }`. **There is no Next image optimizer**, so
   every sizing decision is a code decision.
2. JavaScript — React hydration plus the three client components.
3. GTM and whatever the container ends up loading.
4. Fonts — Heebo, two subsets.

## 2. The budgets

| Metric | Budget | Source of truth |
|---|---|---|
| LCP | **< 2.5s** (p75, mobile) | CrUX / GSC Core Web Vitals |
| CLS | **< 0.05** (stricter than Google's 0.1 — a sticky CTA bar makes shifts expensive) | CrUX |
| INP | **< 200ms** (p75) | CrUX |
| First-load JS, per page | **≤ 120 KB gzip**, excluding the legacy polyfill chunk | build artifact |
| CSS | ≤ 15 KB gzip | build artifact |
| HTML per page | ≤ 35 KB gzip | build artifact |
| Hero image transfer | ≤ 150 KB | network panel |
| Third-party requests before LCP | **0** other than the GTM bootstrap | network panel |

## 3. Measured, 2026-09-01

| Item | Measured | Budget | Verdict |
|---|---|---|---|
| Home first-load JS, gzip, excl. polyfills | **119.5 KB** | 120 KB | ⚠️ **~0.5 KB of headroom — effectively exhausted** |
| Legacy polyfill chunk, gzip | 39.4 KB | — | legacy browsers only; excluded by convention |
| CSS, gzip | 8.2 KB | 15 KB | ✅ |
| Home HTML, gzip | 26.4 KB | 35 KB | ✅ (187 KB raw) |
| `/service/pergolas/` HTML, gzip | 21.3 KB | 35 KB | ✅ |
| `out/` total | 24 MB across 38 HTML pages | — | dominated by the legacy `public/project-*.webp` fallback set |
| JSON-LD blocks on home | 4 | — | entity graph + page graph; inside the HTML budget |

Movement: 119.3 → 119.5 KB (+197 bytes) on 2026-09-01 from the `LeadForm` accessibility and
validation batch — two `useState`/`useRef` hooks, a `useEffect`, a digit check and four
attributes. That is what ~200 bytes buys, and it is most of what was left.

**The finding that matters: the JS budget is spent.** At 119.5 KB against a 120 KB budget, the
next client component — any animation library, any date picker, any carousel, any
IP-geolocation script — breaks it. This is the concrete, measured reason
[mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §4 forbids adding a script
to render one personalized line, and it is why `framer-motion` was removed rather than replaced.

`components/ui/Reveal.tsx` is the pattern for anything that needs motion: ~30 lines, an
`IntersectionObserver`, no dependency.

## 4. The LCP path

The hero image is the LCP element on nearly every template.

- **Explicit `width` matching the rendered slot.** A 2000px file in a 600px slot is the most
  common regression here, and the CDN will happily serve it.
- **`priority` / `fetchpriority="high"` on the hero, never `loading="lazy"`.** Below the fold:
  always `loading="lazy"`.
- **`preconnect` to the media host** — already in [app/layout.tsx](../app/layout.tsx), guarded on
  `manifest.images.mediaHost`. It saves the DNS + TLS round trip on the critical resource.
- Modern format via the resizer; the `public/project-*.webp` set is a **legacy fallback** and
  should not be the LCP source on any live template.

## 5. The CLS sources on this site

Ranked by how often each has actually bitten:

1. **Images without dimensions.** Every `<img>` needs `width`/`height` or an aspect-ratio box.
   This is the number-one CLS source here.
2. **The sticky CTA bar.** `MobileCtaBar` is `fixed`, and [app/layout.tsx](../app/layout.tsx) ships
   a `h-16 lg:hidden` spacer so it cannot overlap the footer. That spacer is load-bearing —
   removing it is both a CLS and an accessibility regression.
3. **Late-appearing content.** Anything rendered after hydration — a personalized line, a
   consent banner, a client-only widget — must reserve its height first. The consent banner
   scheduled for weeks 5–6 is the next real test of this rule.
4. **Font swap.** Heebo loads via `next/font/google` with `display: "swap"` and the `hebrew` +
   `latin` subsets. `next/font` self-hosts and emits size-adjust metrics, so the swap is close to
   metric-compatible — but a change to the font stack re-opens this.

## 6. Field data beats lab, and a single PSI run is noise

Judge this site on **CrUX / GSC Core Web Vitals**, not on one PageSpeed Insights score. A single
lab run on a static site varies more than most of the changes being evaluated. If lab is all you
have, label it as lab.

⚠️ CrUX needs traffic volume to report. At this site's current traffic there may be **no field
data at all** — in which case the honest answer is "unknown", not the lab number.

## 7. The GTM question — settled, do not re-open

GTM is in `<head>` **on purpose**. It was at the top of `<body>`, which delayed tag firing and
undercounted fast bounces. Moving it back to improve a lab score would corrupt the measurement
baseline that everything else in the plan depends on.

A defer experiment is scheduled for **week 7+** — after the event baseline exists
([measurement-plan.md](measurement-plan.md)). Proposing it earlier contradicts the plan, and
every new tag added to the container costs both bytes and a CSP allowlist entry
([public/_headers](../public/_headers)) that must be added **before** the tag is published.

## 8. Caching

From [public/_headers](../public/_headers):

- `/_next/static/*` → `public, max-age=31536000, immutable` (content-hashed, safe forever)
- HTML → short-lived, so a deploy is visible immediately
- `/*.txt` → `X-Robots-Tag: noindex` for RSC payloads, with `/robots.txt` explicitly excepted

Cloudflare's edge handles the rest. There is no other cache layer to tune.

## 9. The regression gate

Before shipping anything that adds weight:

```bash
npm run build
du -sh out

# First-load JS for the home page, gzip, excluding the legacy polyfill chunk.
# Compare against the 120 KB budget and the 119.3 KB measured on 2026-09-01.
for f in $(grep -o '/_next/static/chunks/[^"]*\.js' out/index.html | sort -u | grep -v polyfills); do
  cat "out$f"
done | gzip -9 | wc -c

# Any oversized individual chunk
find out/_next/static -name '*.js' -size +50k -exec ls -lh {} \;
```

Then: `"use client"` should still appear on **only** `LeadForm`, `FilterableGallery` and the
mobile menu. A fourth client component is a budget decision, not a styling one — and right now
there is no budget left to spend without removing something first.

**Log every measured change** in [measurement-plan.md](measurement-plan.md) with its before and
after value. A performance claim without a measured delta is not a result.
