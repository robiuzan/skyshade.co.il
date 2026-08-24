---
name: seo-metadata
description: Title, description, canonical, OG, robots and sitemap rules for skyshade.co.il — the ≤48-char Hebrew title budget, the query-led title patterns, trailing-slash canonicals, the sitemap drift guard, and the 90-day title freeze. Use when creating a page, retitling, fixing a SERP snippet, or auditing metadata. Triggers: "title", "meta description", "canonical", "sitemap", "robots.txt", "SERP snippet", "CTR", "noindex".
---

# Metadata

## The budget

| Field | Rule |
|---|---|
| `title` | **≤48 Hebrew chars** before the layout suffix `| סקיי שייד`. Hebrew renders wide — 60 chars truncates. |
| `description` | ≤160 chars, must contain the primary keyword and one concrete differentiator + an action verb |
| `alternates.canonical` | **always ends in `/`** (`trailingSlash: true`) — mismatch creates a redirect loop signal |
| `openGraph` | inherit from layout unless the page has its own image; never leave a page with the home OG title |

The site-wide default title and description are curated in `app/layout.tsx` — **not** taken from
`manifest.shortPitch`, which runs 163 chars. The manifest is hub-synced, so the trim cannot live
there. Keep that comment.

## Title patterns that already won the argument

Query-led, not brand-led. The pattern set (roadmap §6.4):

```
service page   {מוצר} {חומר} — {תועלת קונקרטית}        פרגולות אלומיניום — תכנון והתקנה
city page      {מוצר} ב{עיר} — {ראיה מקומית}            פרגולות אלומיניום בהרצליה — פרויקטים
guide          {שאלה כפי שנשאלת}                          כמה עולה פרגולת אלומיניום?
hub            {קטגוריה רחבה} — {היקף}                    עבודות אלומיניום לבית ולגינה
```

Never: `דף הבית`, `שירותים`, the brand name first on a non-brand page, `#1`/`הטוב ביותר`, or
keyword stuffing with `|` chains.

## Rules that bite

1. **One keyword, one owning URL.** Check `docs/keyword-map.md` before writing a title. If the
   keyword has an owner, strengthen the owner.
2. **90-day title freeze** after the Phase-1 final state. GSC CTR deltas need a stable baseline; a
   retitle mid-window destroys attribution. If a title must change inside the window, say so and log
   why in `docs/measurement-plan.md`.
3. **Every exported page must appear in `app/sitemap.ts`.** `staticPaths` for static routes;
   `services` / `locations` drive the rest. `postbuild` fails the build on drift — that guard is the
   feature, not an obstacle.
4. **No `lastModified` in the sitemap** unless the page carries a real date. Stamping build time
   marked every URL modified on every deploy — a freshness signal Google learns to distrust.
5. **`/*.txt` is `X-Robots-Tag: noindex`** in `public/_headers` (RSC payloads), with `robots.txt`
   explicitly excluded. Do not "simplify" that pair.
6. **`robots.txt` comes from `app/robots.ts`** — but Cloudflare can prepend a managed version that
   no repo change overrides. Verify the live file, never the source, before claiming crawler policy.

## New page checklist

```tsx
export const metadata: Metadata = {
  title: "…",                                  // ≤48 chars, keyword-first
  description: "…",                            // ≤160, keyword + differentiator + verb
  alternates: { canonical: "/guides/pergola-cost/" },   // trailing slash
};
```

- [ ] keyword checked against `docs/keyword-map.md`, table row added if it is a new owner
- [ ] route added to `app/sitemap.ts` `staticPaths` (static routes only)
- [ ] internal links in from the relevant hub + at least two siblings (`internal-linking-ia`)
- [ ] JSON-LD added (`schema-structured-data`)
- [ ] `npm run build` green (sitemap guard passes)
- [ ] dated row in `docs/measurement-plan.md` naming the metric this page moves

## Auditing live snippets

```bash
curl -sS https://skyshade.co.il/service/pergolas/ | grep -oP '<title>.*?</title>|name="description" content="[^"]*"'
```

Compare against `baseline-seo-snapshot.json` (per-page titles, descriptions, word counts captured
2026-08-17) to prove what changed.
