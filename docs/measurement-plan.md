# Measurement plan & change log

**The rule (merge requirement):** no SEO/CRO recommendation is "done" until its metric is
named and its baseline value is written down here; every shipped change gets a dated
entry below. This defends against the audit's biggest failure mode — simultaneous change
making everything unattributable.

## Baseline (captured 2026-08-17, BEFORE any of this deployed)

- Per-page titles/descriptions/word counts: `baseline-seo-snapshot.json` (repo root)
- GA4 (G-BRZ0S93NFS): page views only — the emptiness is the baseline
- AI crawler access: GPTBot / PerplexityBot / ClaudeBot → **HTTP 403** (curl-verified)
- www.skyshade.co.il → **200 mirror**, no redirect
- Live robots.txt: Cloudflare managed content-signals version, NOT the repo's Allow-all
- DMARC: no `_dmarc` record
- GSC: never verified (no historical data exists)

## Waves (non-negotiable order)

1. **Week 1:** GA4 event tags + GSC verification → then 4 clean weeks of lead/traffic baseline
2. **Weeks 5–6:** Consent Mode v2 + banner — write down the expected 20–40% measured-session drop first
3. **Week 7+:** GTM defer experiment
4. Title changes freeze for 90 days after the Phase-1 final state (GSC CTR deltas need stability)

## KPI set

Leads/week by channel (`generate_lead` + `phone_call_click` + `whatsapp_click` — intent
proxy, overcounts, say so) · form_start→submit rate per template · GSC clicks + position
on the fixed ~30-keyword set · indexed-page count · `lead_submit_failed` (alarm if >0) ·
AI-assistant-channel sessions.

## Change log

| Date | Change | Commit | Expected effect / metric |
|---|---|---|---|
| 2026-08-25 | **`/guides/pergola-sukkah/` shipped** — the one roadmap item with a hard deadline (Sukkot is late Sept; the roadmap said publish by mid-Elul, which is now). Needed no owner facts. Framed as מותאמת with an explicit "we do not certify kashrut" block; halachic questions referred to the reader's rabbi; zero price claims. Verified: 5/5 FAQ answers verbatim in the rendered page | (this batch) | GSC impressions/clicks on `פרגולה לסוכה`-family queries through Sept–Oct. **Baseline: zero** — no page targeted this. Judge it in the Oct review, then again next Elul |
| 2026-08-24 | **Entity graph rebuilt** (`lib/seo-graph.ts`): one `@graph` per page, business + `WebSite` on every page from the layout, everything `@id`-linked to `#business`. Replaces the site-kit's unlinked standalone nodes. Adds `WebPage`/`AboutPage`/`ContactPage`/`CollectionPage`, `ItemList` on hubs, `Service` on service **and** city pages, `Article` on guides. Verified: 0 banned-markup hits, 35/35 FAQ answers match the rendered text verbatim | (this batch) | Entity resolution — brand search returning us, a knowledge panel, assistants naming the business correctly. Baseline: no knowledge panel, brand search surfaces competitors (2026-08-17) |
| 2026-08-24 | **`/guides/` silo opened** — hub + `pergola-permit` + `aluminum-vs-wood-pergola`, in the primary nav, two-way linked with `/service/pergolas/`. First coverage of the informational/commercial tier | (this batch) | GSC impressions on permit + comparison queries. **Baseline: zero** — the site had no page targeting them |
| 2026-08-24 | **Analytics events aligned to the spec**: `lead_submit` → `generate_lead`, added `form_start` (first focus, once per mount), `form_location` on all three events (`home-hero` / `contact-page`), `error_type` on failures, `consent` on leads. Container build spec: `docs/gtm-tag-spec.md` | (this batch) | Nothing yet — **the events still die in the dataLayer until the GTM tags exist**. This makes the site side ready, not the measurement |
| 2026-08-24 | `/services/` given its own intro + per-need routing; title → `עבודות אלומיניום לבית ולגינה`. **Deliberate exception to the 90-day title freeze**: this page was not in the query-led retitle tranche (`ade3f37`), so it had no fresh CTR baseline to protect. Its own 90-day clock starts today | (this batch) | Stops the hub duplicating the homepage; CTR on `עבודות אלומיניום` |
| 2026-08-24 | Two unsupportable claims removed from `/about/`: "הפכנו למובילים בתחום" and "מאות פרויקטים". Accordion display name → `סגירת מרפסות ותריסי אקורדיון` (slug and `<title>` unchanged — title stays frozen) | (this batch) | Removes live misleading-advertising exposure; recognition on `סגירת מרפסת` |
| 2026-08-24 | Assessed: `npm audit` 3 high (next/postcss/nanoid) — **all require a Next server this static export does not run**; 14.2.35 is already the newest 14.2.x and every fix needs a two-major jump. Decision recorded in `docs/security-posture.md`, not actioned | — | Prevents a needless Next 16 migration being re-proposed monthly |
| 2026-08-16 | Media catalog migration (images via imgquarry CDN) | `7a72e27` | LCP/bytes on gallery pages; CWV field data |
| 2026-08-17 | 9 verified defect fixes (placeholder markers, #1 claim, lead-form silent loss, 404 soft-404, footer cities, WhatsApp contrast, sibling links, city-page spacing) | `2bc8889` | lead_submit_failed visibility; a11y compliance; crawl of 4 orphan-ish cities |
| 2026-08-17 | Query-led titles (all ≤60), services in primary nav, sitemap lastmod removed + drift guard, mobile-menu a11y | `ade3f37` | GSC CTR on service/city queries (after deploy + 90-day freeze) |
| 2026-08-23 | DMARC added: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:yossi@skyshade.co.il; fo=1` (zone uses Cloudflare Email Routing; SPF + DKIM already present). Ramp to `quarantine` then `reject` after 4–6 weeks of clean reports — first identify the real outbound sender (likely Gmail send-as) and add its SPF/DKIM | (DNS via API) | Spoofing of yossi@ becomes visible in reports, then blocked |
| 2026-08-23 | www→apex 301 deployed as a zone Redirect Rule (template "Redirect from WWW to Root"); verified path + query preserved, http→https→apex chain = 2 hops | (dashboard) | GSC: www duplicates drop out of the index; one canonical host |
| 2026-08-23 | **All audit fixes went LIVE** — deploy pipeline rebuilt to push `out/` to the Cloudflare Pages project via wrangler-action on every push to main (secrets from the Sys Admin vault). Verified live: new titles, corrected permit FAQ in copy+schema, testimonials/stats removed, 404 fixed, services dropdown, consent checkbox, HSTS + 5 security headers + CSP-RO, immutable static cache, RSC noindex, legacy-photo 301s | `1d27af1` | From here on, GSC/GA4 deltas are attributable to dated entries |
| 2026-08-23 | Cloudflare: managed robots.txt off; AI Crawl Control set to Allow — GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, meta-externalagent, Applebot-Extended, Amazonbot all verified 200 (were 403), incl. deep paths + sitemap | (dashboard) | AI-assistant referral sessions in GA4; citations in ChatGPT/Perplexity for brand + pergola queries (check monthly) |
| 2026-08-23 | Discovered live origin is Cloudflare Pages project `skyshade`, not GitHub Pages; headers/redirects moved into `public/_headers` + `public/_redirects` | `e0f2d9e` | Security headers + HSTS observable once Pages deploys |
| 2026-08-17 | Stop-ship legal batch: corrected permit FAQ (copy+schema), truthful privacy policy, testimonials unrendered, verifiable trust stats, footer contrast /85 & /80, consent checkbox + privacy line, GTM→head, first-touch capture, data-cta labels, monthly rebuild cron, framer-motion removed, .htaccess deleted | (this commit) | Removes live legal exposure; enables lawful nurture; GTM fires earlier |
