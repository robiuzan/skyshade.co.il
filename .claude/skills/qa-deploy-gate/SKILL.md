---
name: qa-deploy-gate
description: The pre-flight, deploy and live-verification procedure for skyshade — the local gate (typecheck, lint, build, sitemap guard), how the Cloudflare Pages deploy actually works, the curl matrix that proves a deploy landed, and what to do when the live HTML disagrees with the repo. Use before and after every deploy. Triggers: "deploy", "ship it", "push to main", "is it live", "verify", "build failed", "rollback", "QA".
---

# QA and deploy

## Local gate — all three, in order

```bash
npm run typecheck    # strict TS
npm run lint         # next lint
npm run build        # static export + postbuild sitemap drift guard
```

If `build` fails immediately after `next build` printed success, it is `scripts/check-sitemap.mjs`:
an exported page is missing from `app/sitemap.ts`, or a sitemap entry has no exported page. Fix the
sitemap — do not disable the guard.

Manual passes before pushing:
- [ ] the page at 375px width (Hebrew wraps earlier than English)
- [ ] keyboard: tab through the header, open/close the mobile menu, Escape, focus visible
- [ ] the lead form submits **and** its failure path shows the WhatsApp recovery link
- [ ] no `console.error` on load
- [ ] no fabricated fact shipped (`eeat-trust-evidence`)

## Deploying

```bash
git push origin main
```

That triggers `.github/workflows/deploy.yml`: build → `wrangler pages deploy out --project-name=skyshade
--branch=main`. The Pages project is **direct-upload type** and cannot be Git-connected, which is why
the workflow exists. There is no staging environment. Concurrency is serialized; an in-progress
deploy finishes first.

If the secrets are missing the workflow **still passes** and prints a warning instead of deploying.
A green check therefore does not mean the site changed.

## Verify live — by HTML, never by CI status

```bash
curl -sS https://skyshade.co.il/ | grep -o '<title>[^<]*</title>'
curl -sS https://skyshade.co.il/service/pergolas/ | grep -o 'application/ld+json'
curl -sS -o /dev/null -w '%{http_code} → %{redirect_url}\n' https://www.skyshade.co.il/   # 301 → apex
curl -sS https://skyshade.co.il/robots.txt                                                 # repo version only
curl -sS -I https://skyshade.co.il/ | grep -iE 'strict-transport|content-security'
curl -sS https://skyshade.co.il/sitemap.xml | grep -c '<loc>'
```

Pick a string that is **new in this deploy** and grep for it. "The build succeeded" is not
verification; this project spent weeks deploying to a host nothing pointed at.

## When live disagrees with the repo

In this order:
1. Did the workflow actually run and reach the wrangler step? (`gh run list`, `gh run view`)
2. Cloudflare Pages → project `skyshade` → Deployments: is the latest one on branch `main` and
   promoted to production?
3. Cache: append `?v=1`. A stale HTML response means a cache rule is wrong.
4. **A zone-level rule is overriding the repo.** Managed `robots.txt`, a Redirect Rule, a
   Transform Rule, or AI Crawl Control. No repo change can beat these — the owner must fix them in
   the dashboard. This has happened more than once here.

## Rollback

Cloudflare Pages → Deployments → the previous production deployment → **Rollback**. Then revert the
commit so the repo and live agree, and log both in `docs/measurement-plan.md`.

## After every deploy

- A dated row in `docs/measurement-plan.md`: what changed, the commit, the metric it should move.
- For new or substantially rewritten URLs: request indexing in Search Console.
- If titles/descriptions changed, note the date — the 90-day title freeze starts from it.
