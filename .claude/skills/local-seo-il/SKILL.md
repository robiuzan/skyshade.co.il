---
name: local-seo-il
description: Local SEO for skyshade in Israel — the evidence gate that decides whether a city page lives, is rewritten, or is 301'd; Google Business Profile setup and rules; NAP consistency; Israeli directories; and the hard ban on scaling templated geo pages. Use for anything involving cities, service areas, maps, or "near me" queries. Triggers: "city page", "location page", "local SEO", "GBP", "Google Business Profile", "near me", "עיר", "אזורי שירות", "map pack".
---

# Local SEO (Israel)

## The situation

16 `/locations/[city]/` pages exist. They are **byte-identical apart from the city token** — a
textbook doorway pattern, and the audit's clearest liability. The fix is differentiation or
deletion. It is **never** more pages.

## The evidence gate

A city page ships (or survives) only if it carries at least **three** of these, all real:

1. A delivered project in that city — photo, year, product, and the constraint solved.
2. A municipality-specific fact: the local ועדה's posture on מצללה exemptions, a known HOA/ועד
   pattern, a neighbourhood-typical balcony or roof structure.
3. A distinct FAQ that would not make sense in another city.
4. A named local reference or review (once the GBP exists).
5. A genuinely different service emphasis (e.g. balcony enclosures in dense Tel Aviv towers vs
   garden pergolas in Modi'in).

**The token test:** delete the city name from the page. If it still reads as a useful page, it fails
— it was never about the city.

Pages that cannot clear the gate within a quarter get **301'd to `/locations/`**, not parked, not
noindexed and left. Target: keep 6–8 cities, redirect the rest.

## Never

- Build any of the ~80 unbuilt service×city combinations. At most ~18–24 of the 96 combos ever
  exist, under `/locations/[city]/[service]/`, each gated on delivered work in that city.
- Bulk-generate "local" filler with AI.
- Create a per-city `LocalBusiness` schema node or a fake branch address.
- Keyword-stuff footer city anchors — plain city names only.
- Claim service in a city where nothing has been delivered, in copy or in `areaServed`.

## Google Business Profile — the highest-leverage local asset

Not built yet; blocked on the owner. When it happens:

- **Name exactly `סקיי שייד`.** Never `סקיי שייד - פרגולות אלומיניום`. Keyword-appended names are a
  suspension risk and the most common Israeli-SMB mistake.
- Service-area business (no storefront) — hide the address, define the service area by region, not
  by 40 individual cities.
- Primary category likely `קבלן פרגולות` / `Awning supplier`; secondaries for fences, decking.
- Products/Services entries mirroring the six service pages, each linking to its page URL.
- Photos from the Media Studio catalog, geotagged only if truly taken there.
- Reviews: ask **every** customer, never incentivize, never gate by sentiment. Respond to all.
- GBP posts monthly; they are also an entity signal for AI assistants (`geo-ai-visibility`).

## NAP consistency

One phone (`050-5063152` / `+972505063152`), one name (`סקיי שייד`), one URL (apex, https, trailing
slash), one email. Any variant spawns a second entity. The address is 🔶 blocked — until it is
confirmed, publish **no** address anywhere rather than two different ones.

## Israeli directories worth the effort

`b144`, `dapey zahav`, `zap`, `easy.co.il`, municipal business indexes, and manufacturer/supplier
"where to buy" pages. Rules: identical NAP, no paid "מגזין"/index link farms, sponsorships get
`rel="sponsored"`.

## Measuring it

GBP Insights (calls, direction requests, website clicks) + GSC queries containing a city name +
`generate_lead` by landing path. Log the baseline in `docs/measurement-plan.md` **before** the first
city page is rewritten, or the rewrite is unattributable.
