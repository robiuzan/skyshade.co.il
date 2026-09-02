# Image inventory

**Written:** 2026-09-01 · Procedure: the `page-imagery` skill · Agent: `image-art-director`.
Measured from `site.config.json` (hub-synced from the Media Studio catalog) and from the
components that render it, on **2026-09-01**. Every number here decays — re-measure before
trusting it.

This file owns **the slots, the catalog and the imagery gaps**. It does not own the LCP budget
([performance-budgets.md](performance-budgets.md)), the alt-text conformance rule
([accessibility-and-i18n.md](accessibility-and-i18n.md)), or whether a claim may be made at all
([evidence-register.md](evidence-register.md)).

---

## 1. The slot inventory

Every photograph on this site lands in one of four positions. There are no others — the number is
small because **this site has almost no photography in it**, which is §3.

| Slot | Intrinsic | Rendered by | Fit | What it does to the picture |
|---|---|---|---|---|
| **Header logo** | 500×79 · 6.3:1 | [Header.tsx:76](../components/layout/Header.tsx#L76) — `SiteImage … fixed priority fit="contain"`, `h-9 w-auto` | `contain` | Fixed 36px-tall box, so the ladder is 1x/2x only (`widthsFor(intrinsic, fixed)`). **Above the fold on every page and marked `priority`** — with the hero being a CSS gradient this is the site's only nominated LCP candidate. Not a photo slot. |
| **Gallery tile** | varies wildly — see §2 | [FilterableGallery.tsx:89](../components/marketing/FilterableGallery.tsx#L89) — `aspect-[4/3] object-cover`, `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"` | `cover` | **Every tile is force-cropped to 4:3 regardless of its real shape.** The only photo slot on the site. Grid is 3-up ≥1024px, 2-up ≥640px, 1-up below. |
| **Lightbox** | the full original | [FilterableGallery.tsx:129](../components/marketing/FilterableGallery.tsx#L129) — plain `<img>`, `max-h-[90vh] max-w-[90vw] object-contain` | `contain` | The only place a photo is seen uncropped. A deliberate plain `<img>`: the intrinsic `width`/`height` that `SiteImage` always emits would fight the viewport constraints. |
| **OG card** | 1200×630 · 1.91:1 | `manifest.images.og` → `ogImageMeta()` in [layout.tsx:33](../app/layout.tsx#L33), and `primaryImage` in the home JSON-LD | `cover` | One card for the whole site. Nothing enforces 1200×630; every social platform expects it. |

**Not photo slots.** The `lucide-react` icons throughout, the `TrustBar` marks, the process-step
numerals. Never brief a photograph for one.

### Two mechanics that decide whether a picture survives

- **`focal` is the crop insurance.** The per-image `focal {x,y}` in `site.config.json` becomes
  `gravity=XxY` on the `/cdn-cgi/image/` URL and the CSS `object-position`
  (`@ishub/site-kit/src/media/url.ts:66`). It rescues an off-centre subject. **It is `null` on all
  55 catalog items today**, so every tile is centre-cropped.
- **The srcset ladder is capped at the intrinsic width** (`widthsFor()`, `url.ts:24`). The CDN
  never upscales, so a 263px-wide master serves 263px into a tile that is 100vw on a phone. The
  ladder is `[320…2560]` filtered below the cap, plus the true intrinsic width.

---

## 2. The catalog, measured

`manifest.images.gallery` — 55 items, key prefix `skyshade/gallery/project-N.webp`, catalog URL
`https://imgquarry.com/catalog/skyshade.co.il/gallery.json`.

| Category | Items |
|---|---|
| גדרות ושערים | 18 |
| חיפוי קירות | 15 |
| פרגולות, מחסות וגגות | 13 |
| דקים | 9 |

**⚠️ `mode: "fetched"` describes how the hub built the block, not runtime behaviour.** Nothing in
this repo fetches `catalogUrl` — the 55 entries are baked into the HTML at build time
(`lib/gallery.ts`). So: **replacing the bytes at an existing key goes live in ~5 minutes with no
rebuild; adding, removing or recategorising an item requires a hub sync, a rebuild and a deploy.**

### Shape — the finding that matters

| Measure | Value |
|---|---|
| Landscape (>1.05) | 34 |
| Portrait (<0.95) | 20 |
| Square | 1 |
| Ultra-wide (>2:1) | 7 |
| Ratio range | **0.56 → 2.67** |
| **Ratio <1.0 or >1.9 — heavily mangled by the 4:3 tile** | **27 of 55** |
| Items with a `focal` point | **0** |

Half the gallery is centre-cropped from a shape the box cannot hold. A 0.56 portrait in a 4:3
landscape box loses roughly half its height; a 2.67 panorama loses roughly half its width. Focal
points are the cheap fix — but the value lives in `site.config.json`, so picking one up needs a
hub sync + rebuild, unlike a byte swap.

### Weight

| Measure | Value |
|---|---|
| Catalog total | 17.4 MB |
| Items over 300 KB | 27 |
| Heaviest | `project-6.webp` 1729×647, **1.14 MB** |
| Narrowest | `project-50.webp` 263×468 |

Masters are served whole only in the lightbox — the tiles go through the resizer — so weight here
is a lightbox cost, not a grid cost. The narrow ones are the real defect: they cannot fill a
phone-width tile at any density.

### Alt text

All 55 carry the same two generated templates:

```
alt   : "Sky Shade aluminium project - wall cladding 12"
altHe : "פרויקט אלומיניום של סקיי שייד — חיפוי קירות 12"
```

Neither describes what is visible. `altHe` is what renders (`SiteImage` prefers it on an RTL
site), so a screen-reader user hears an ordinal, not a picture. This is a WCAG 1.1.1 finding, not
a nice-to-have — [accessibility-and-i18n.md](accessibility-and-i18n.md) already requires "the
product, the setting, the material. Never the filename."

**What the alt may not say:** [evidence-register.md](evidence-register.md) records project photos
as own work but with "⚠️ no city/date/size attached yet". Until Yossi supplies them, alt text
describes materials, colour, form and setting — never a city, a year, a square-metre figure, a
customer or a job.

---

## 3. What is missing — the actual gap

| Route | Photographs today |
|---|---|
| `/` | 12 gallery tiles, below the fold. The hero is a **CSS gradient** ([Hero.tsx](../components/marketing/Hero.tsx)) |
| `/service/[slug]/` ×6 | **none** |
| `/locations/[city]/` ×16 | **none** |
| `/guides/[topic]/` | **none** |
| `/about/`, `/services/`, `/locations/` | **none** |
| `/gallery/` | all 55 |
| `/contact/`, legal pages | none, correctly |

`PageHeader` is a flat `bg-primary` band on every inner page. **The six money pages sell a visual
product with no picture of it.** That is the largest imagery finding on the site, and it is the one
`image-art-director` exists to close.

Two constraints on closing it:

1. **The JS budget is spent** — 119.3 KB of a 120 KB first-load budget
   ([performance-budgets.md](performance-budgets.md) §3). Any imagery work that ships a carousel,
   a lightbox library or a masonry layout breaks it. Static grids and `<img>`/`SiteImage` only.
2. **A picture on a service page adds an LCP candidate where there is none.** Today the logo is
   the LCP element by default. A hero photo on `/service/pergolas/` must be sized to its slot,
   `priority`, and inside the 150 KB hero-transfer budget — or it regresses the one CWV number
   this site currently passes on architecture alone.

---

## 4. Where imagery is produced

| Piece | Path |
|---|---|
| Prompt files (the approval unit, committed) | `Media Studio/prompts/skyshade/*.md` |
| Reference photographs (**gitignored, never uploaded**) | `Media Studio/refs/skyshade/` |
| Generator | `Media Studio/scripts/generate-image.mjs` — refuses to run while `approved: null` |
| Upload / publish | `Media Studio/scripts/studio-api.ps1` — `-DryRun` first, always |
| Delivery | `https://imgquarry.com/cdn-cgi/image/width=W,quality=80,format=auto,fit=cover/<key>` |

The object key is **immutable** — `skyshade/gallery/project-12.webp` is baked into deployed HTML.
Replacing a photo is an overwrite at the same key. Media Studio's upload route refuses a
replacement that changes the aspect ratio by more than ±0.01 or narrows the master, because the
`width`/`height` in this repo's HTML are already deployed.
