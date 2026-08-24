---
description: Full read-only health check of skyshade — technical SEO, live crawler access, schema, links, trust claims, performance and security — in parallel, merged into one prioritized list.
---

Run a complete read-only audit of skyshade.co.il. Do not edit or deploy anything.

Launch these subagents **in parallel, in one message**:

- `seo-auditor` — metadata, canonicals, sitemap/robots, indexability, repo-vs-live drift
- `aeo-geo-strategist` — live AI-crawler reachability matrix, entity resolution, citability
- `schema-auditor` — JSON-LD coverage, `@id` graph, FAQ/visible-text parity, banned markup
- `link-architect` — orphans, crawl depth, anchor text, hub integrity
- `eeat-trust-auditor` — unsupportable claims currently live, blocked-on-owner items
- `perf-a11y-auditor` — CWV budgets, CLS/LCP sources, contrast, keyboard, RTL
- `security-auditor` — headers, CSP allowlist drift, deps, DMARC

Then merge into a single list, deduplicated, ordered **P0 → P2**, each finding with:
`file:line or surface · what is wrong · why it matters · the fix`.

Rules for the merge:

- Drop anything that contradicts `docs/seo-guardrails.md` or the settled decisions in `CLAUDE.md` —
  those were decided deliberately (no review schema, no new city pages, no sitemap `lastmod`,
  report-only CSP, GTM in `<head>`).
- Separate **repo-fixable** from **owner-only** (Cloudflare zone, GBP, business facts).
- State explicitly what was verified live versus read from source.
- End with the recommended ship order and the rows they would add to `docs/measurement-plan.md`.

$ARGUMENTS
