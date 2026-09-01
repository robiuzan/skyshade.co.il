# CLAUDE.md — סקיי שייד (skyshade.co.il) project rulebook

> The operating manual for any AI agent (and human) working in this repo. Project rules here
> **override** global defaults. When this file and the code disagree, fix the code. When this file
> and `Israeli services sites/roster/sites/skyshade.json` disagree about a business fact, **the
> roster wins**. When this file and `docs/seo-guardrails.md` disagree about what may be published,
> **the guardrails win**.

---

## 1. Business context

- **Business:** סקיי שייד (Sky Shade) — premium **aluminum outdoor structures**: pergolas, shading,
  fences and gates, wall cladding, decks, outdoor kitchens, accordion/balcony enclosures.
- **Founded:** 2009. **Service area:** nationwide (`שירות בכל הארץ`) — no confirmed physical address.
- **Phone / WhatsApp:** `050-5063152` (`+972505063152`) · **Email:** `yossi@skyshade.co.il`
- **Hours:** א׳–ה׳ 08:00–18:00 · ו׳ 08:00–13:00 · שבת סגור.
- **Owner:** Yossi. He is the **critical path** for E-E-A-T: address, ח.פ., licences, real reviews,
  named team, warranty terms and project facts are all blocked on him (`audit-roadmap-full.md` §7).
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) lead form. Every page keeps a
  call/WhatsApp action within reach; `MobileCtaBar` is sticky on mobile.
- **Audience:** private homeowners (villa/penthouse/garden), ועדי בתים, architects and contractors.

**Where things stand:** [audit-roadmap-full.md](audit-roadmap-full.md) is the definitive strategy
(15-track adversarially-verified audit, 222 findings). [docs/phase-2-improvement-plan.md](docs/phase-2-improvement-plan.md)
is the current execution plan. [docs/measurement-plan.md](docs/measurement-plan.md) holds the
baseline and the dated change log — **every shipped change gets a row there**.

---

## 2. Golden rules

1. **Never fabricate or inflate a business fact.** Years, prices, warranty terms, licences,
   insurance, ratings, review counts, project counts, customer names, certifications. If it is not
   confirmed in [docs/evidence-register.md](docs/evidence-register.md), it does not ship — mark it
   `// 🔶 confirm` and add a register row instead.
2. **Never add `Review` or `AggregateRating` schema** for on-site testimonials. The `lib/content.ts`
   testimonials were developer-completed; the quotes were altered. Review equity lives on the Google
   Business Profile, nowhere else. This is a Google spam-policy line, not a style preference.
3. **Never build another templated city page.** The 16 `/locations/[city]/` pages are byte-identical
   doorway pages — the fix is *differentiation or deletion*, never duplication. The ~80 unbuilt
   service×city combinations are **never** built. See [docs/seo-guardrails.md](docs/seo-guardrails.md) §1.
4. **Never edit `site.config.json` directly.** It is synced from the hub roster
   (`Israeli services sites/roster/sites/skyshade.json`); local edits to synced fields are
   overwritten on the next sync. Page-level overrides live in code (see the curated meta description
   in [app/layout.tsx](app/layout.tsx#L28)).
5. **One keyword → one owning URL.** Check [docs/keyword-map.md](docs/keyword-map.md) *before*
   writing or retitling any page. Strengthen the owner; never open a second front.
6. **Business facts come from `lib/site-config.ts`, never hardcoded in components.** Import
   `siteConfig`, `manifest`, `services`, `locations`, `telHref`, `whatsappHref()`.
7. **Pushing to `main` deploys to production.** `.github/workflows/deploy.yml` builds and pushes
   `out/` to the Cloudflare Pages project `skyshade` via wrangler. There is no staging. Verify a
   deploy by checking the **live HTML**, never by a green Actions run — see §8.
8. **Never delete `public/google2bc4e3517c114dd1.html`.** It is the Search Console verification file
   for the URL-prefix property.
9. **Every page in the export must be in the sitemap.** `postbuild` runs
   `scripts/check-sitemap.mjs`, which fails the build on drift. Add new static routes to
   `staticPaths` in [app/sitemap.ts](app/sitemap.ts).
10. **Never edit generated or vendored output** — `node_modules/`, `vendor/`, `.next/`, `out/`.
11. **No PII into GA4, ever.** Names, phones, emails and free-text messages stay out of the
    dataLayer. Lead events carry categorical parameters only.
12. **Titles ≤48 characters** before the layout's `| סקיי שייד` suffix. Descriptions ≤160.

---

## 3. Stack

Next.js **14.2** App Router · React **18** · TypeScript strict · Tailwind **v4** (CSS-first `@theme`
in `app/globals.css` — there is no `tailwind.config.ts`) · `lucide-react` · `clsx` + `tailwind-merge`
via `cn()` · `@ishub/site-kit` (vendored tarball, `vendor/ishub-site-kit-0.0.0.tgz`).
Flat layout (no `src/`), path alias `@/* -> ./*`. Hebrew, `dir="rtl"`, Heebo via `next/font`.

**`next.config.mjs` — the constraints that shape everything:**

```js
output: "export",          // static HTML into out/ — no server, no API routes, no middleware
trailingSlash: true,       // every URL ends in / — canonicals and sitemap must match
images: { unoptimized: true },
transpilePackages: ["@ishub/site-kit"],
```

Consequences: no runtime redirects or headers from Next (they ship from `public/_headers` and
`public/_redirects`), no ISR, no server actions, no `next/image` optimizer. The lead form posts
directly to **Web3Forms** from the browser.

**`@ishub/site-kit` subpaths in use:** `/seo` (`localBusinessJsonLd`, `serviceJsonLd`,
`breadcrumbJsonLd`, `faqJsonLd`, `jsonLdScript`), `/analytics` (`gtmHeadSnippet`, `trackEvent`),
`/media` (`srcFor`), `/contact`, `/components`.

---

## 4. Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | LocalBusiness + FAQ JSON-LD |
| `/services/` | `app/services/page.tsx` | hub — needs its own intro, must not duplicate home |
| `/service/[slug]/` ×6 | `app/service/[slug]/page.tsx` | Service + Breadcrumb + FAQ JSON-LD |
| `/locations/` | `app/locations/page.tsx` | hub |
| `/locations/[city]/` ×16 | `app/locations/[city]/page.tsx` | ⚠️ doorway pattern — see rule 3 |
| `/guides/` + `/guides/[topic]/` | `app/guides/…` | the commercial/informational silo; Article + FAQ + breadcrumb |
| `/gallery/` `/about/` `/contact/` | | |
| `/privacy/` `/terms/` `/accessibility/` | | legal — copy is reviewed, changes re-reviewed |
| `/robots.txt` `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | |

Service slugs: `pergolas`, `fences-gates`, `wall-cladding`, `decks`, `outdoor-kitchen`,
`accordion-products`. **English slugs only** — no Hebrew-slug migration.

Planned (gated, see `docs/information-architecture.md`): `/guides/[slug]/`, `/projects/[slug]/`,
`/warranty/`, `/locations/[city]/[service]/`.

---

## 5. Content data model

- `lib/site-config.ts` — NAP, services, locations, link helpers. Derived from the manifest.
- `lib/content.ts` — page copy: `serviceDetails` (per-service intro, bullets, FAQs),
  `differentiators`, `processSteps`, `trustStats` 🔶, `testimonials` 🔶, `faqs`, `navItems`,
  gallery lists (legacy fallback).
- `site.config.json` — hub-synced manifest. Read-only from this repo's perspective.
- **Images come from the Media Studio catalog** (`manifest.images`, host `imgquarry.com` via the
  Cloudflare resizer). Replacing a photo in the Studio updates the live site in ~5 minutes with no
  rebuild. `public/project-*.webp` and the `lib/content.ts` gallery arrays are a legacy fallback.

🔶 `trustStats` and `testimonials` are **unverified** and currently unrendered. Do not publish or
expand them until Yossi confirms real numbers.

---

## 6. Working style

- Match the surrounding code: Hebrew UI strings inline, English identifiers, comments that explain
  *why* (this codebase's comments are scar tissue from real defects — do not "clean them up").
- Before any content or SEO change, read [docs/seo-guardrails.md](docs/seo-guardrails.md) and
  [docs/keyword-map.md](docs/keyword-map.md). They are short on purpose.
- Prefer strengthening an existing page over creating a new one. New URLs are a cost.
- Run `npm run typecheck && npm run lint && npm run build` before claiming anything works.
- After shipping, add a dated row to [docs/measurement-plan.md](docs/measurement-plan.md).

---

## 7. Skills and agents

Invoke the project skill that owns the task rather than improvising — `.claude/skills/`:

| Skill | Owns |
|---|---|
| `skyshade-architecture` | orientation: stack, routes, data model, where things live |
| `seo-metadata` | titles, descriptions, canonicals, sitemap, robots |
| `schema-structured-data` | the JSON-LD entity graph |
| `aeo-answer-content` | answer-first blocks, FAQ design, AI-Overview citability |
| `geo-ai-visibility` | AI-crawler reachability, entity consistency, assistant monitoring |
| `eeat-trust-evidence` | claim gating, the evidence register, trust surfaces |
| `hebrew-rtl-copy` | Hebrew voice, RTL mechanics, title/H1 patterns |
| `keyword-map-governance` | adding a keyword, cannibalization checks |
| `local-seo-il` | city pages, GBP, NAP, the doorway rules |
| `internal-linking-ia` | site architecture, nav, breadcrumbs, orphan detection |
| `conversion-cro` | forms, CTAs, friction, trust placement |
| `accessibility-wcag` | WCAG 2.1 AA, ARIA, keyboard, contrast, the `/accessibility/` claim |
| `performance-web-vitals` | LCP/CLS/INP budgets, images, fonts, JS |
| `web-security-headers` | `_headers`, CSP, form and dependency posture |
| `tracking-analytics` | GTM/GA4 event spec, dataLayer, consent |
| `new-page-gate` | the evidence gate + full checklist for shipping a new URL |
| `qa-deploy-gate` | pre-flight, deploy, and live verification |

Subagents in `.claude/agents/` (read-only auditors unless stated): `seo-auditor`,
`aeo-geo-strategist`, `eeat-trust-auditor`, `local-seo-strategist`, `keyword-strategist`,
`schema-auditor`, `cro-analyst`, `perf-a11y-auditor`, `security-auditor`, `link-architect`,
`hebrew-copywriter` (drafts copy), `content-engineer` (writes code).

Commands in `.claude/commands/`: `/seo-check` (parallel full audit) · `/content-brief <topic>`
(gated brief for a proposed page) · `/ship` (pre-flight, deploy, live verify) · `/growth-review`
(monthly).

Reference docs in `docs/` — the **state** the skills read from, versus the skills' **procedure**.
[docs/README.md](docs/README.md) is the map: what each file owns, and which file already owns a
topic somebody is about to create a second file for.

| Doc | Holds |
|---|---|
| `README.md` | the documentation map + the single-owner rule |
| `seo-guardrails.md` | the bright lines — read before writing any page |
| `keyword-map.md` | one keyword → one owning URL |
| `evidence-register.md` | which claims may be published (✅ / 🔶 / ⛔) |
| `information-architecture.md` | the URL map, gates, and link flow |
| `entity-profile.md` | canonical NAP + the GBP spec |
| `aeo-question-bank.md` | the real query shapes content must answer |
| `accessibility-and-i18n.md` | the WCAG 2.1 build target vs the 2.0 claim, RTL rules, the gated he/en decision |
| `mobile-ux-and-personalization.md` | thumb zones, the sticky CTA spec, what personalization is legal on a static export |
| `conversion-funnel.md` | the funnel, the friction inventory, the one-change-per-window rule |
| `performance-budgets.md` | CWV budgets + the last measured values (⚠️ JS budget is at 119.5/120 KB) |
| `data-tracking-infrastructure.md` | the PII boundary, server-side tagging decision, CRM wiring, consent |
| `measurement-plan.md` | baseline, KPI set, and the dated change log |
| `gtm-tag-spec.md` | the exact container build — triggers, tags, variables, verification |
| `security-posture.md` | the standing security assessment, incl. why the npm advisories don't apply |
| `owner-intake-checklist.md` | the questions blocking a third of the work |
| `phase-2-improvement-plan.md` | the current 16-week execution plan — **what** and **why** (W1–W10) |
| `sprint-roadmap.md` | the same work as eight dated sprints with acceptance criteria — **when** and **done-when** |

---

## 8. Deploy and verify

```bash
npm run build          # static export → out/ ; postbuild sitemap guard gates it
git push origin main   # → .github/workflows/deploy.yml → wrangler pages deploy out
```

The live origin is the Cloudflare Pages project **`skyshade`** (direct-upload type — it *cannot* be
Git-connected, which is why the workflow exists). Secrets `CLOUDFLARE_API_TOKEN` /
`CLOUDFLARE_ACCOUNT_ID` come from the Sys Admin vault.

**Verification is by live HTML, not by CI status:**

```bash
curl -sS https://skyshade.co.il/ | grep -o '<title>[^<]*</title>'
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.skyshade.co.il/
curl -sS https://skyshade.co.il/robots.txt
curl -sS -I https://skyshade.co.il/ | grep -i 'strict-transport\|content-security'
```

**Zone-level things that no repo change can fix** (Cloudflare dashboard, owner access):
www→apex 301 (a Redirect Rule — `_redirects` cannot match on hostname), managed `robots.txt`,
AI Crawl Control, WAF. Current status is logged in `docs/measurement-plan.md`.

---

## 9. Known live state (2026-08-23)

- All audit code fixes are **live**. www→apex 301 live. DMARC `p=none` live. Search Console
  **verified**. AI crawlers **unblocked** (13/13 UAs → 200); managed robots.txt **off**.
- **Open:** GTM has one tag — GA4 lead/call/WhatsApp events die in the dataLayer
  (`audit-roadmap-full.md` §6.3). No Google Business Profile. No owner intake session yet.
- CSP is **report-only** on purpose. Whoever edits the GTM container owns that allowlist.
