---
name: web-security-headers
description: Security posture for skyshade — the public/_headers response headers and the report-only CSP (what it allows and why, and what must change before enforcing), form and third-party exposure, dependency hygiene, secret handling, and the Cloudflare zone controls that live outside the repo. Use when editing headers, adding a third-party script or endpoint, or auditing security. Triggers: "security", "CSP", "headers", "HSTS", "XSS", "vulnerability", "dependencies", "secrets", "WAF", "DMARC".
---

# Security

There is no server and no database, so the attack surface is: **response headers, third-party
scripts, the lead form, the dependency tree, DNS/email, and the Cloudflare account itself.**

## `public/_headers` — the only place headers are configured

Currently shipped: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a locked-down `Permissions-Policy`,
`Cross-Origin-Opener-Policy: same-origin`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`,
and **`Content-Security-Policy-Report-Only`**.

Rules:
- **The CSP is report-only on purpose.** It runs 2–3 weeks against GTM's real tag set before being
  renamed to `Content-Security-Policy`. Do not enforce it on a hunch — enforcing it while a GTM tag
  is silently blocked breaks analytics or the form with no visible error.
- **Whoever edits the GTM container owns the CSP allowlist.** A new tag (Google Ads, Meta pixel)
  needs its host added to `script-src`/`connect-src`/`img-src` *before* it is published, or it will
  be blocked the day the CSP is enforced.
- `'unsafe-inline'` is a deliberate concession to the static export + the GTM bootstrap. Strict
  nonces would require a Cloudflare Worker in front — a real option, but a separate decision.
- `form-action` includes `https://api.web3forms.com` because `LeadForm` posts there. Changing the
  form provider means changing this line in the same commit.
- Before enforcing: add HSTS `preload` only after `includeSubDomains` has run cleanly for weeks and
  every subdomain is HTTPS — preload is effectively irreversible.

## `public/_redirects`

Evaluated before static assets. It **cannot match on hostname** — a `www.` line is silently ignored.
Legacy WordPress URLs get appended here from a real old→new map (Wayback CDX + the GSC 404 report),
**never** blanket-redirected to home.

## The lead form

Client-side POST to Web3Forms with a **public** access key — by design; it is not a secret, but it
is abusable. Mitigations in place: honeypot, required fields, the WhatsApp fallback. If spam
appears: enable Web3Forms' own captcha/hCaptcha option rather than adding a third-party script that
would also need a CSP change.

**Never log or transmit form PII anywhere except the delivery inbox.** No PII in the dataLayer, GA4,
or `sessionStorage` beyond the documented first-touch object (referrer + landing path only — it is
disclosed in `/privacy/`).

## Secrets

- Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (from the Sys Admin vault). The
  token is scoped to Pages Edit + DNS — **not** zone Redirect Rules, which is why some fixes are
  dashboard-only.
- `.env` / `.env.*` are never read or committed. `NEXT_PUBLIC_*` values are public by definition —
  never put anything sensitive behind that prefix.
- Never print a token, key or account id into output, a comment, or a commit message.

## Dependencies

`dependabot.yml` is configured. `npm audit` before any dependency bump. Next.js 14.2.x gets patched
promptly — static export limits exposure but does not eliminate it. The vendored
`@ishub/site-kit` tarball is updated from the hub, never edited in place.

## Outside the repo (Cloudflare zone, owner access)

www→apex Redirect Rule · managed `robots.txt` · AI Crawl Control · WAF rules · Email Routing ·
**DMARC** — currently `p=none` (live 2026-08-23). Ramp to `quarantine` then `reject` after 4–6 weeks
of clean reports, and identify the real outbound sender (likely Gmail send-as) first so SPF/DKIM
cover it. Log every zone change in `docs/measurement-plan.md`; there is no other audit trail.

## Verifying live

```bash
curl -sS -I https://skyshade.co.il/ | grep -iE 'strict-transport|content-security|x-frame|x-content|referrer|permissions'
curl -sS -o /dev/null -w '%{http_code} → %{redirect_url}\n' http://skyshade.co.il/
dig +short TXT _dmarc.skyshade.co.il
```
