---
name: skyshade-architecture
description: Orientation for the skyshade.co.il codebase — the static-export constraints, where every kind of content lives, the hub-synced manifest, the Media Studio image pipeline, the Cloudflare Pages deploy path, and which files are load-bearing. Read this before the first edit in a session that touches app/, components/, lib/ or public/. Triggers: "how does this site work", "where is X defined", "add a page", "change the phone number", "why is this file like this".
---

# skyshade.co.il — architecture

Next.js 14 App Router, `output: "export"`, `trailingSlash: true`, Hebrew RTL, static-hosted on
Cloudflare Pages. **There is no server.** No API routes, no middleware, no server actions, no ISR,
no `next/image` optimizer, no runtime redirects or headers from Next.

## Where things live

| You want to change | Edit |
|---|---|
| Phone, email, brand name, hours, schema type | the **hub roster**, then sync — never `site.config.json` |
| Services or city lists | `lib/site-config.ts` (`services`, `locations`) |
| Page copy, service detail, FAQs, process, differentiators | `lib/content.ts` |
| Titles / descriptions / canonicals | the `metadata` export of the page file |
| Site-wide title template + default description | `app/layout.tsx` |
| JSON-LD | the page file, via `@ishub/site-kit/seo` helpers |
| Response headers, CSP, cache | `public/_headers` |
| Path redirects | `public/_redirects` (⚠️ cannot match hostname) |
| Photos | the **Media Studio catalog**, not this repo |
| Sitemap | `app/sitemap.ts` — and `staticPaths` must list every new static route |

## The five things that surprise people

1. **`site.config.json` is synced downstream.** Its `_comment` says so. Anything you write into a
   synced field is lost on the next hub sync. Per-page overrides go in code — the curated meta
   description in `app/layout.tsx:28` is the worked example, with the reason in a comment.
2. **`public/_redirects` cannot match on hostname.** A `www.skyshade.co.il/*` line there is silently
   ignored (verified live). www→apex is a **zone Redirect Rule** in the Cloudflare dashboard.
3. **Images are served from `imgquarry.com`** through the Cloudflare image resizer, driven by
   `manifest.images` and `srcFor()` from `@ishub/site-kit/media`. Swapping a photo in the Media
   Studio changes the live site in ~5 minutes **with no rebuild and no commit**. The
   `public/project-*.webp` files and the `galleryImages` arrays in `lib/content.ts` are a legacy
   fallback; `public/_redirects` 301s the old paths to the CDN.
4. **`postbuild` gates the build.** `scripts/check-sitemap.mjs` diffs the exported pages against
   `sitemap.xml` and fails on drift. If the build fails right after `next build` succeeded, this is
   why — add the route to `staticPaths`.
5. **`@ishub/site-kit` is a vendored tarball** (`vendor/ishub-site-kit-0.0.0.tgz`) that ships raw
   TypeScript, hence `transpilePackages`. Do not edit it here; fix it in the hub and re-vendor.

## Component layers

```
components/ui/         Button, Container, Section, SectionHeading, Reveal   (primitives)
components/layout/     Header, Footer, MobileCtaBar, PageHeader             (chrome)
components/marketing/  Hero, ServicesGrid, WhyUs, Process, Faq, Reviews,
                       TrustBar, ServiceAreas, FilterableGallery, FinalCta  (sections)
components/forms/      LeadForm                                             (the money path)
```

`LeadForm` posts client-side to Web3Forms (`api.web3forms.com/submit`) with the public access key
from the manifest, a honeypot, and a **WhatsApp deep link carrying the typed data as the visible
recovery path on failure**. That recovery path is load-bearing — a silent failure here costs a real
lead. Anything you add to `connect-src`/`form-action` must stay in the `public/_headers` CSP.

## Comments are scar tissue

Long `why` comments in `app/sitemap.ts`, `public/_headers`, `public/_redirects`, `app/layout.tsx`
and `lib/content.ts` record real defects and legal reviews. Do not delete or condense them as
"cleanup". If one is wrong, fix the fact and keep the note.

## Before you finish

```bash
npm run typecheck && npm run lint && npm run build
```

Then a dated row in `docs/measurement-plan.md`. See the `qa-deploy-gate` skill for the full gate.
