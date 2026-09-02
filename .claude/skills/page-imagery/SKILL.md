---
name: page-imagery
description: Which picture belongs in which slot on סקיי שייד — resolving a slot's real aspect ratio and crop behaviour from the CSS before briefing anything, choosing between an existing catalog photo and a new one, writing Hebrew alt that describes what is visible without claiming a city or a job, the focal-point fix for the 27 badly-cropped tiles, and the performance and evidence gates a new image must clear. Use before writing an image prompt, adding a photo to a page, replacing a catalog image, or judging whether a picture fits. Triggers "what image goes here", "which aspect ratio", "add a photo", "the gallery", "image brief", "why is this image cropped", "alt text", "תמונה".
---

# Page imagery

Getting a picture to *fit* is a CSS question, and the answers are measured, not guessable.
[docs/image-inventory.md](../../../docs/image-inventory.md) holds the measurements — the four
slots, the 55-item catalog and the gaps. **Read it before briefing anything.** This file is the
method; that file is the state.

The one sentence to keep in mind: **the only photo slot on this site force-crops every picture to
4:3, and 27 of the 55 photos in it are the wrong shape for that box.**

---

## 1. Decide what kind of job this is

Four different jobs get asked for as "we need an image". They have different gates.

| Ask | What it actually is | Gate |
|---|---|---|
| "this tile looks wrong / cut off" | a **focal-point** fix | §5 — metadata, needs a hub sync + rebuild |
| "swap this photo for a better one" | a **byte replace** at the same key | §6 — aspect ratio ±0.01, never narrower |
| "the pergola page needs a picture" | a **new slot** in the markup | §4 — perf + LCP gate first, then a photo |
| "we need a picture that doesn't exist" | a **generated image** | §7 — a prompt file, approved by Yossi |

Never skip to the last one. Most imagery requests here are answered by a photo that is already in
the catalog, cropped properly.

## 2. Before you brief anything

1. **Resolve the slot.** Aspect ratio comes from `docs/image-inventory.md` §1, never from taste.
   If the slot is not in that table it does not exist yet — that is §4, not an image request.
2. **Read the page.** The section in `app/…/page.tsx` and its copy in `lib/content.ts`. The
   picture must agree with the Hebrew beside it: a page about תריסי אקורדיון does not get a
   pergola.
3. **Look at what already exists.** 55 photos, four categories:

   ```bash
   node -e "const it=require('./site.config.json').images.gallery.items; \
     it.forEach(i=>console.log(i.key.split('/').pop(), i.width+'x'+i.height, \
     (i.width/i.height).toFixed(2), i.category))"
   ```

   Nine of those are decks and only 13 are pergolas — the category the site sells hardest is the
   third-best covered. Say so if a brief is fighting that.

## 3. Composition, because the tile crops

`aspect-[4/3] object-cover` on every gallery tile. That is a **1.33 target**.

- Keep the structure and its junction with the building inside the middle 60% of the frame.
- A pergola shot at 0.56 portrait loses its roof or its posts, not both — pick which, with a focal
  point, and say which in the brief.
- Read the homepage tiles as a **set of 12**: vary framing, hold light and colour constant.
- The lightbox is `object-contain`, so it is the only view of the whole picture. A photo that only
  reads at full size is a lightbox photo, not a tile photo.

## 4. A new photo slot is a performance change first

Adding a picture to a service or city page is not a content edit. Before proposing one:

- **The first-load JS budget has 0.7 KB of headroom** (`docs/performance-budgets.md` §3). No
  carousel, no lightbox library, no masonry, no motion library. A static grid or a single
  `SiteImage`.
- **It creates an LCP candidate.** The site currently hands LCP to the header logo because the
  hero is a CSS gradient. Any above-the-fold photo must carry `priority`, be sized to its rendered
  slot, and stay under the 150 KB hero-transfer budget.
- **`width`/`height` or an aspect-ratio box is mandatory.** Images without dimensions are the
  number-one CLS source on this site.
- **`images: { unoptimized: true }`** — there is no Next optimizer. Sizing is entirely a code
  decision, made through `SiteImage`/`srcFor` against `manifest.images`.
- Route it through `SiteImage` from `@ishub/site-kit/components`, not a bare `<img>`, unless the
  box is viewport-sized (the lightbox is the one exception, and it is commented as such).

## 5. Alt text

`altHe` is what renders — `SiteImage` prefers it, because the site is `lang="he" dir="rtl"`.
Both fields are required at publish; Media Studio's publish route enforces Hebrew alt for
`dir='rtl'` sites.

**Describe what is visible: the product, the material, the colour, the setting.**

- Never `תמונה של`. The screen reader already announced it is an image.
- Never the filename, never an ordinal (`… חיפוי קירות 12` is the current state and it is a
  WCAG 1.1.1 defect, not a baseline).
- Never a fact the camera cannot see: no city, no year, no square metres, no customer, no price,
  no "the largest", no warranty. `docs/evidence-register.md` marks project photos as own work
  **with no city/date/size confirmed** — an unsourced claim is no more acceptable in an `alt`
  attribute than in an `<h2>`.
- Decorative images take `alt=""`; that is a legitimate value, not a missing one. Icons take
  `aria-hidden`.

Good: `פרגולת אלומיניום בגוון אנתרציט עם שלבים אופקיים מעל פינת ישיבה בגינה`
Bad: `פרויקט אלומיניום של סקיי שייד — פרגולות 7`

Alt lives in the **catalog**, not in this repo — it arrives through `site.config.json`, which is
hub-synced and must never be edited here (CLAUDE.md rule 4). Fixing alt text means fixing it in
Media Studio and re-syncing.

## 6. Replacing a photo

The object key is immutable and baked into deployed HTML. A replace is an **overwrite at the same
key**, and Media Studio refuses one that changes the aspect ratio by more than ±0.01 or narrows
the master — both would break live pages with no build to catch it. So the replacement must be
shot or cropped to the *existing* dimensions, which you look up first.

A byte swap reaches users in ~5 minutes with no rebuild. Anything that changes the catalog
*entry* — a new item, a new category, a focal point, new alt text — needs a hub sync, a rebuild
and a deploy.

## 7. Generating an image that does not exist

Prompt files live in `Media Studio/prompts/skyshade/<slot-name>.md`, copied from `_template.md`.
`approved: null` until Yossi signs off; `generate-image.mjs` refuses to run without it. The
approval unit is the **prompt**, not the render.

Write the body as plain physical prose — what is built, from what, in what light, seen from where.
Concrete beats adjectival: "anodised anthracite aluminium pergola with horizontal louvres over a
paved terrace, late-afternoon side light" beats "beautiful modern pergola".

**House style: real Israeli residential exteriors.** Jerusalem stone or white render, a private
garden or a penthouse terrace, natural daylight, no styling that reads as a catalog render. This
site's credibility is that the work is real; imagery that looks synthetic undoes the copy.

## 8. Hard rules — not style preferences

- **No text, lettering, signage, logos or badges anywhere in the frame.** Generated Hebrew renders
  as garbage, and invented branding asserts something untrue.
- **Never a certificate, licence, insurance document, standard mark (ת״י), rating, star badge or
  review.** A fabricated rating is a Google spam-policy violation. CLAUDE.md rule 2 already bans
  `Review`/`AggregateRating` schema on this site; putting a 5-star graphic inside a raster is the
  same violation where no text guard can see it.
- **Never a before/after presented as a specific job**, and never a named or identifiable
  customer.
- **Never invent a credential the business has not confirmed** — years, licences, project counts,
  team size. Same gate as copy: `docs/evidence-register.md`.
- **Never brief a photograph for an icon slot.**
- **Reference photographs never reach R2.** Every object in the bucket is publicly readable, so a
  person's face uploaded there is published at a permanent URL. Refs stay in
  `Media Studio/refs/skyshade/`, which is gitignored.
- **Never edit `site.config.json`.** Image metadata is hub-synced; a local edit is overwritten.

## 9. Related

`docs/image-inventory.md` (state) · `.claude/agents/image-art-director` (writes the briefs and
prompts) · `performance-web-vitals` + `docs/performance-budgets.md` (the LCP and weight gates) ·
`accessibility-wcag` + `docs/accessibility-and-i18n.md` (alt conformance) · `eeat-trust-evidence`
(what a caption may claim) · `Media Studio/.claude/skills/image-generation` (generation mechanics).
