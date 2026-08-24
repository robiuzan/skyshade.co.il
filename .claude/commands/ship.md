---
description: Pre-flight gate, deploy, and live verification for skyshade — the full qa-deploy-gate procedure with the change-log row.
---

Ship the current work. Follow `qa-deploy-gate` exactly; do not skip a step because the change looks small.

## 1. Pre-flight

```bash
git status && git diff --stat
npm run typecheck && npm run lint && npm run build
```

A `postbuild` failure means sitemap drift — fix `app/sitemap.ts`, never disable
`scripts/check-sitemap.mjs`.

Then confirm:
- [ ] no fabricated fact shipped — every new claim ✅ in `docs/evidence-register.md`
- [ ] titles ≤48 chars, descriptions ≤160, canonicals ending in `/`
- [ ] FAQ schema matches the visible text verbatim
- [ ] no `Review`/`AggregateRating` markup added
- [ ] `LeadForm`'s WhatsApp recovery path and consent checkbox intact
- [ ] any new third-party host added to the `public/_headers` CSP in the same change
- [ ] new/changed pages have their inbound internal links

## 2. Deploy

Ask before pushing. Then:

```bash
git push origin main
```

`.github/workflows/deploy.yml` builds and pushes `out/` to the Cloudflare Pages project `skyshade`
via wrangler. **A green Actions run does not prove the site changed** — if the secrets are missing,
the workflow passes and skips the deploy.

## 3. Verify live — by HTML

Pick a string that is **new in this deploy** and grep for it:

```bash
curl -sS https://skyshade.co.il/<changed-path>/ | grep -o '<title>[^<]*</title>'
curl -sS -o /dev/null -w '%{http_code} → %{redirect_url}\n' https://www.skyshade.co.il/
curl -sS https://skyshade.co.il/sitemap.xml | grep -c '<loc>'
curl -sS -I https://skyshade.co.il/ | grep -iE 'strict-transport|content-security'
```

If live disagrees with the repo: check the workflow reached the wrangler step → check the Pages
deployment is on `main` and promoted → check caching → then suspect a **Cloudflare zone rule**, which
no repo change can override and only the owner can fix.

## 4. Log it

Add a dated row to `docs/measurement-plan.md`: date · change · commit · the metric it should move.
For new or substantially rewritten URLs, request indexing in Search Console. If titles changed, note
the date — the 90-day title freeze runs from it.

$ARGUMENTS
