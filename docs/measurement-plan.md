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
| 2026-08-16 | Media catalog migration (images via imgquarry CDN) | `7a72e27` | LCP/bytes on gallery pages; CWV field data |
| 2026-08-17 | 9 verified defect fixes (placeholder markers, #1 claim, lead-form silent loss, 404 soft-404, footer cities, WhatsApp contrast, sibling links, city-page spacing) | `2bc8889` | lead_submit_failed visibility; a11y compliance; crawl of 4 orphan-ish cities |
| 2026-08-17 | Query-led titles (all ≤60), services in primary nav, sitemap lastmod removed + drift guard, mobile-menu a11y | `ade3f37` | GSC CTR on service/city queries (after deploy + 90-day freeze) |
| 2026-08-23 | www→apex 301 deployed as a zone Redirect Rule (template "Redirect from WWW to Root"); verified path + query preserved, http→https→apex chain = 2 hops | (dashboard) | GSC: www duplicates drop out of the index; one canonical host |
| 2026-08-23 | **All audit fixes went LIVE** — deploy pipeline rebuilt to push `out/` to the Cloudflare Pages project via wrangler-action on every push to main (secrets from the Sys Admin vault). Verified live: new titles, corrected permit FAQ in copy+schema, testimonials/stats removed, 404 fixed, services dropdown, consent checkbox, HSTS + 5 security headers + CSP-RO, immutable static cache, RSC noindex, legacy-photo 301s | `1d27af1` | From here on, GSC/GA4 deltas are attributable to dated entries |
| 2026-08-23 | Cloudflare: managed robots.txt off; AI Crawl Control set to Allow — GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, meta-externalagent, Applebot-Extended, Amazonbot all verified 200 (were 403), incl. deep paths + sitemap | (dashboard) | AI-assistant referral sessions in GA4; citations in ChatGPT/Perplexity for brand + pergola queries (check monthly) |
| 2026-08-23 | Discovered live origin is Cloudflare Pages project `skyshade`, not GitHub Pages; headers/redirects moved into `public/_headers` + `public/_redirects` | `e0f2d9e` | Security headers + HSTS observable once Pages deploys |
| 2026-08-17 | Stop-ship legal batch: corrected permit FAQ (copy+schema), truthful privacy policy, testimonials unrendered, verifiable trust stats, footer contrast /85 & /80, consent checkbox + privacy line, GTM→head, first-touch capture, data-cta labels, monthly rebuild cron, framer-motion removed, .htaccess deleted | (this commit) | Removes live legal exposure; enables lawful nurture; GTM fires earlier |
