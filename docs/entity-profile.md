# Entity profile — the canonical facts, everywhere

One business, one entity. Every surface — the site, the schema graph, the GBP, directories, social —
must state these **identically**. Any variant creates a second entity in Google's and the AI
assistants' knowledge graphs, which is the current root cause of the brand's own name search
surfacing competitors.

## Canonical values

| Field | Value | Notes |
|---|---|---|
| Name (he) | `סקיי שייד` | exactly this — **never** keyword-appended, not even on the GBP |
| Name (en) | `Sky Shade` | |
| Legal name | `סקיי שייד` | 🔶 pending ח.פ. and the registered entity name |
| URL | `https://skyshade.co.il/` | apex, https, trailing slash — the only form used anywhere |
| Phone | `050-5063152` / `+972505063152` | one format per context; E.164 in schema and `tel:` |
| WhatsApp | `+972505063152` | same number |
| Email | `yossi@skyshade.co.il` | |
| Founded | 2009 | |
| Schema type | `HomeAndConstructionBusiness` | from the manifest |
| Area served | `שירות בכל הארץ` | nationwide — **not** a list of 16 city branches |
| Hours | א׳–ה׳ 08:00–18:00 · ו׳ 08:00–13:00 · שבת סגור | |
| Price range | `₪₪` | schema only; not a price claim in copy |
| Address | 🔶 **none** | publish nothing rather than two different values |
| ח.פ. | 🔶 **none** | |
| `sameAs` | `[]` | ⚠️ **the single biggest entity gap** |

Source of truth is the hub roster → `site.config.json` → `lib/site-config.ts`. Never hardcode any of
these in a component.

## Why `sameAs: []` matters more than it looks

An assistant asked "מי זו סקיי שייד?" needs corroboration from sources that are not the business's
own website. With no GBP, no social profiles, no directory listings and no address, there is nothing
to corroborate — so the assistant answers with whichever competitor *is* resolvable. Populating
`sameAs` is downstream of creating those profiles; it is not a code task first.

Dependency order:

```
1. Google Business Profile          → the anchor everything else references
2. Facebook + Instagram (real)      → sameAs entries 2 and 3
3. Israeli directories (b144, dapey zahav, zap, easy.co.il), identical NAP
4. Supplier / manufacturer "where to buy" pages
5. → then populate manifest.schema.sameAs and the JSON-LD graph
```

## Google Business Profile spec (when the owner grants access)

- **Name:** `סקיי שייד`. Appending `פרגולות אלומיניום` is a suspension risk and the most common
  Israeli-SMB mistake.
- **Type:** service-area business, no storefront. Hide the address; define the service area by
  region, not by 40 individual cities.
- **Primary category:** קבלן פרגולות / Awning supplier. **Secondary:** fencing contractor, deck
  builder, aluminum supplier.
- **Services:** mirror the six service pages, each linking to its URL.
- **Photos:** from the Media Studio catalog. Geotag only where the photo was genuinely taken.
- **Reviews:** ask every customer, never incentivize, never gate by sentiment, respond to all.
- **Posts:** monthly — also an entity/freshness signal for AI assistants.

## The description, used verbatim everywhere

> סקיי שייד מתכננת, מייצרת ומתקינה פרגולות אלומיניום, מערכות הצללה, גדרות ושערים, חיפויי קירות,
> דקים ומטבחי חוץ — בהתאמה אישית, בשירות ארצי, מאז 2009.

Same text on the GBP, in directories, in the OG description and in `about`. Variants dilute the
entity. Any change is made here first, then propagated everywhere in one pass.

## Monitoring the entity

Monthly, record in `docs/measurement-plan.md`: does a brand search return the business first · does
a knowledge panel exist · what do ChatGPT / Perplexity / AI Overviews say to `מי זו סקיי שייד?` and
which source do they cite.
