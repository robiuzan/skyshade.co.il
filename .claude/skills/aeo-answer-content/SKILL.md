---
name: aeo-answer-content
description: Answer-engine optimization for skyshade — question-form headings with a 40–60 word extractable Hebrew answer first, definition/comparison/spec blocks, FAQ design that matches schema verbatim, and the freshness and authorship signals that decide whether an assistant quotes this page. Use when writing or auditing any page meant to win an AI Overview, a featured snippet, or a ChatGPT/Perplexity citation. Triggers: "AEO", "answer block", "AI Overviews", "featured snippet", "will an LLM cite this", "FAQ", "question heading".
---

# Answer-engine optimization

The question is not "does this rank" but **"can a machine reach this page, parse it, and prefer to
quote it over a competitor?"** Reachability is `geo-ai-visibility`'s job. This skill is about
whether the *content* is quotable.

## The answer block — the unit of AEO

Every question-shaped section follows the same shape:

```
H2/H3: the question, phrased the way an Israeli homeowner types it
↓
40–60 words: the direct answer, complete on its own, no pronouns pointing outside the block,
             no "כמו שראינו למעלה", no CTA inside it
↓
then: the nuance, the conditions, the exceptions, the example, the numbers
```

An extracted answer must survive being lifted out of the page with zero context. Test it by reading
only that paragraph aloud — if it needs the sentence above it, rewrite it.

## What makes an answer preferable to a competitor's

Assistants prefer answers that are **specific, conditional, and dated**. In this market that means:

- **Numbers with units and conditions** — `עד 50 מ״ר` and *under which exemption*, not "גדול".
- **The condition, not just the conclusion** — "פטור מהיתר **בתנאים מסוימים**: …" beats "לא צריך היתר",
  and it is also the only legally defensible phrasing (see below).
- **A stated scope** — who this applies to, where, and when it was last checked.
- **Comparison tables** for X-or-Y queries (`אלומיניום או עץ`, `דק סינטטי או דק עץ`) — a table with
  4–6 real criteria is the single most-quoted structure in this category.
- **Real project facts** — city, year, size, material, constraint solved. Templated copy is
  unquotable *because* every competitor has the same sentence.

## Hard content lines (these are legal, not stylistic)

- **Building permits:** conditional-exemption wording only, always with the not-legal-advice line.
  The reviewed text lives in `lib/content.ts` — copy it, do not re-word it. Any change is
  re-reviewed.
- **Sukkah:** never `כשרה לסוכה`. Say `מותאמת לסוכה` and refer the reader to their rabbi.
- **No price, warranty, standard, insurance or project count** that is not in
  `docs/evidence-register.md` as confirmed.

## FAQ design

- 4–8 questions per page, each answering a **distinct** query — not eight rephrasings of one.
- Questions come from `docs/aeo-question-bank.md` (real query shapes), not from imagination.
- The FAQ text on the page and in `faqJsonLd()` must match **verbatim**. Divergence is what made
  the permit defect ship twice.
- Never put the same FAQ block on more than one page. Duplicate FAQPage markup across 16 city pages
  is a doorway signal with extra steps.

## Freshness and authorship

- Guides carry a visible `עודכן: {חודש שנה}` — and it must be true. Fake freshness is detectable and
  it is the fastest way to lose citation trust.
- Regulation content carries the date the regulation was checked, separately from the page date.
- Authorship is currently blocked: no named human is confirmed. Until the owner intake, attribute to
  the business, never to an invented author. See `eeat-trust-evidence`.

## Audit questions for an existing page

1. Does any H2 pose a question a person would actually type?
2. Is there a self-contained 40–60 word answer immediately under it?
3. Could a competitor publish this paragraph verbatim? (If yes, it is not quotable — it is filler.)
4. Does the page contain one fact no competitor has?
5. Does the schema FAQ match the visible text exactly?
6. Is the page reachable by AI crawlers *today* (`geo-ai-visibility` gate 1)?
