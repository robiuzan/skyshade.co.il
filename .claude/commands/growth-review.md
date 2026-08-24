---
description: Monthly growth review — read the change log, re-verify the zone-level gates, check what AI assistants say, and decide the single next change.
---

Run the monthly review for skyshade.co.il. Read-only unless the last step says otherwise.

## 1. What shipped, and did it move anything

Read `docs/measurement-plan.md`. For every row dated in the last ~5 weeks: was its named metric
read? If a change shipped without its metric being recorded, that is the first finding — the whole
plan rests on attribution.

Report each as: change · expected effect · actual · verdict (worked / no signal / too early /
unattributable because it shipped alongside X).

## 2. Re-verify the gates that live outside the repo

These have all silently regressed before. Verify, do not assume:

```bash
curl -sS https://skyshade.co.il/robots.txt                       # repo version only, no managed block
for ua in GPTBot OAI-SearchBot PerplexityBot ClaudeBot Google-Extended; do
  printf '%-18s %s\n' "$ua" "$(curl -sS -o /dev/null -w '%{http_code}' -A "$ua" https://skyshade.co.il/)"
done
curl -sS -o /dev/null -w '%{http_code} → %{redirect_url}\n' https://www.skyshade.co.il/
curl -sS -I https://skyshade.co.il/ | grep -iE 'strict-transport|content-security'
dig +short TXT _dmarc.skyshade.co.il
```

Also: is GTM still firing more than one tag? Is `lead_submit_failed` still zero?

## 3. Entity and AI visibility

Run the fixed prompt set (`geo-ai-visibility`) and record verbatim answers plus cited sources:
`מי זו סקיי שייד?` · `פרגולות אלומיניום מומלץ בישראל` · `כמה עולה פרגולת אלומיניום?` ·
`האם צריך היתר לפרגולה?` · `חברות פרגולות אלומיניום במרכז`

Check whether a GBP exists yet and whether `sameAs` is still `[]`.

## 4. Search Console

Clicks, impressions and average position on the fixed ~30-keyword set; indexed-page count; any
coverage errors; any query where two of our URLs alternate (cannibalization).

## 5. Blocked items

Which rows in `docs/evidence-register.md` are still 🔶? Has the owner intake happened? Name the one
question to Yossi that would unblock the most work this month.

## 6. Decide the single next change

**One substantive change per read window.** Recommend exactly one, with its metric, its baseline,
and what it would confound if shipped alongside anything else. Then propose the row it will add to
`docs/measurement-plan.md`.

$ARGUMENTS
