# Security posture — the standing assessment

Procedure lives in the `web-security-headers` skill. This file is the **state**: what was
assessed, when, and what the conclusion was — so the same advisories are not re-litigated every
month.

## The shape of the attack surface

`output: "export"` — the production site is static HTML on Cloudflare Pages. **There is no Next.js
server, no API route, no middleware, no server action, no image optimizer, and no database in
production.** That single fact decides most of what follows.

What remains: response headers, third-party scripts (GTM and whatever it loads), the lead form,
the build toolchain, DNS/email, and the Cloudflare account itself.

## Dependency advisories — assessed 2026-08-24

`npm audit --omit=dev` reports **3 high**: `next`, `postcss`, `nanoid`.

**Conclusion: none are exploitable on this site, and the fix is not to upgrade.**

| Package | Advisories | Why it does not apply here | Action |
|---|---|---|---|
| `next` 14.2.35 | 22 advisories: Image Optimizer DoS, Server Components/Actions DoS, SSRF in rewrites and WebSocket upgrades, middleware/proxy bypass, RSC cache poisoning, CSP-nonce XSS, request smuggling | **Every one requires a running Next server.** This deployment ships pre-rendered HTML; no Next runtime exists in production. 14.2.35 is already the newest 14.2.x — every listed fix lands in ≥15.5.x, and `npm audit` proposes 16.3.2, a **two-major** jump | Stay on 14.2.x. Re-assess only if the site ever gains a server (SSR, route handlers, or a Cloudflare Worker in front) |
| `postcss` (via next) | `sourceMappingURL` path traversal / arbitrary `.map` read; XSS via unescaped `</style>` | Build-time only. The vector needs attacker-controlled CSS or source maps; the build consumes this repo's own source in CI | None. Rides along with the Next upgrade whenever that happens |
| `nanoid` (via next) | infinite loop on negative / zero size | Build-time only, and no code path here calls it with attacker input | None |

**Do not run `npm audit fix --force`.** It would pull Next 16 — a two-major upgrade with an App
Router migration — to fix vulnerabilities in a server this site does not run. That trade is
strictly negative.

**What would change this assessment:** adding SSR or route handlers, putting a Worker in front
(the strict-CSP-nonce option), or accepting user-supplied CSS/media into the build. Any of those
makes the Next advisories live again.

## Headers — shipped

`X-Frame-Options: SAMEORIGIN` · `X-Content-Type-Options: nosniff` ·
`Referrer-Policy: strict-origin-when-cross-origin` · locked-down `Permissions-Policy` ·
`Cross-Origin-Opener-Policy: same-origin` · `Strict-Transport-Security: max-age=31536000; includeSubDomains`
· `Content-Security-Policy-**Report-Only**`.

The CSP is report-only **on purpose** until its window closes (see `docs/measurement-plan.md`).
`'unsafe-inline'` is a deliberate concession to the static export plus the GTM bootstrap; strict
nonces would need a Worker. HSTS `preload` is not set and should not be until every subdomain is
HTTPS — it is effectively irreversible.

## Lead form

Client-side POST to Web3Forms with a **public** access key (by design, not a leak). Honeypot
present; consent checkbox unbundled and unchecked; the only client-side persistence is the
documented first-touch object in `sessionStorage` (referrer + landing path), disclosed in
`/privacy/`. No PII reaches the dataLayer. If spam appears, enable Web3Forms' own captcha rather
than adding a third-party script that would also need a CSP change.

## Email / DNS

DMARC `p=none` live since 2026-08-23 on a Cloudflare Email Routing zone; SPF and DKIM present.
The ramp to `quarantine` then `reject` needs 4–6 weeks of clean reports **and** identification of
the real outbound sender (likely Gmail send-as) so SPF/DKIM cover it. Ramping early breaks the
owner's outgoing mail.

## Owner-only, no repo fix exists

Zone Redirect Rules (www→apex), managed `robots.txt`, AI Crawl Control, WAF, and access to the
Cloudflare account itself. When one of these contradicts the repo, the repo always loses — that
has happened more than once here.

## Re-assess

Monthly, via `/growth-review`, or immediately when: a dependency major is proposed, a new
third-party script is added to GTM, the deployment stops being a pure static export, or an
advisory lands that names static export specifically.
