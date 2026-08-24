---
name: keyword-map-governance
description: How keywords are assigned to URLs on skyshade — the one-keyword-one-owner rule, the cannibalization check, how to add or move an owner, and how to decide between strengthening a page and creating one. Use before writing, retitling, or proposing any new page, and when diagnosing why two pages rank for the same query. Triggers: "keyword", "cannibalization", "should we make a page for", "which page targets", "keyword research", "search intent".
---

# Keyword governance

`docs/keyword-map.md` is the register: **one keyword → one owning URL**. It is short, and it is
binding. `audit-roadmap-full.md` §5 holds the full table with the evidence gates.

## Before writing anything

1. Look the keyword up in `docs/keyword-map.md`.
2. **It has an owner** → strengthen the owner. Do not create a second page. Do not put the keyword
   in another page's title.
3. **It is listed as a planned owner** → build that URL, not a different one. The planned slugs were
   chosen to avoid collisions (e.g. the whole price cluster lives at `/guides/pergola-cost/` —
   there is deliberately **no `/pricing/` page**).
4. **It is not listed** → decide by the test below, then add a row.

## Strengthen or create?

Create a new URL only if **all** are true:

- The query has a **different intent** than any existing page (informational vs transactional vs
  comparison), not merely different words.
- You can write **500+ words that exist nowhere else on the site**, with at least one fact no
  competitor has.
- The page would still be useful with the keyword token deleted.
- It can earn at least three internal links from pages that already have equity.

Otherwise: an H2 on the owning page. Variants become nested spokes only when the substance outgrows
the section — `/service/pergolas/electric-pergola/` is the worked example, and its gate is
"500+ unique words, own photos, own FAQs".

**Never a 7th top-level service.** Never a service×city page without delivered work in that city.

## Cannibalization check

Two pages competing for one query is a self-inflicted ranking cap. Symptoms in GSC: the same query
alternating between two URLs, or both sitting at position 8–15.

```bash
# which pages carry a term in their title/description/H1
grep -rn "פרגולות אלומיניום" app/ lib/content.ts | grep -i "title\|description\|<h1"
```

Resolution, in order: (1) retitle the weaker page toward its own intent; (2) merge and 301 the
weaker into the stronger; (3) canonical the weaker to the stronger only if both must exist for
users. Never leave both optimized for the same head term.

## Adding a row

```markdown
| `/guides/pergola-permit/` | היתר בנייה לפרגולה · חוק הפרגולות · מצללה פטור | evidence: municipal sources cited, reviewed |
```

Record the **cluster**, not one string — the page owns the whole intent, including the synonym pairs
(`פרגולה`/`מצללה`, `סגירת מרפסת`/`תריסי אקורדיון`).

## Intent tiers for this business

| Tier | Shape | Owns | Converts |
|---|---|---|---|
| Transactional | `{מוצר} {חומר}`, `{מוצר} ב{עיר}` | service + city pages | high |
| Commercial | `מחיר`, `כמה עולה`, `X או Y`, `מומלץ` | `/guides/` | medium — the biggest untapped cluster |
| Informational | `היתר`, `חוק`, `איך`, `כמה זמן` | `/guides/` | low direct, high AI-citation value |
| Navigational | brand, `סקיי שייד` | `/` | must not be lost to competitors — see `geo-ai-visibility` |
| Proof | `{מוצר} ב{עיר}` long-tail | `/projects/[slug]/` | the anti-doorway substance |

The commercial tier is where this site currently has **zero** coverage and competitors are weakest.
That is the highest-return keyword work available.
