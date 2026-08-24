---
name: hebrew-rtl-copy
description: Hebrew voice and RTL mechanics for skyshade — how Israeli homeowners actually search and read, the brand register, heading and CTA patterns, numerals/units/phone formatting in RTL, and the layout traps (logical properties, bidi punctuation, mixed Latin). Use when writing or reviewing any Hebrew string, or when RTL layout looks wrong. Triggers: "Hebrew copy", "RTL", "עברית", "write the section", "rewrite this text", "direction", "mirrored layout".
---

# Hebrew copy and RTL

## Voice

Israeli homeowner buying an outdoor structure: high-consideration, price-sensitive, permit-anxious,
suspicious of contractors. The register that works is **מקצועי ונגיש** — concrete, calm, no
exclamation marks, no hype, no English marketing loans (`פרימיום` is acceptable brand vocabulary;
`סולושן`, `אקספירינס`, `דיל` are not).

- Second person plural, direct: `נגיע לפגישת ייעוץ` — not `החברה תגיע`.
- Verbs over nouns: `מתכננים, מייצרים ומתקינים` beats `תכנון, ייצור והתקנה` in body copy (keep the
  noun form for headings and lists).
- Say the constraint out loud. `לא כל פרגולה פטורה מהיתר` earns more trust than another superlative.
- Nikud: none, ever, except a genuine ambiguity.

## How the audience searches (write toward this)

`פרגולות אלומיניום` · `פרגולה חשמלית` · `מצללה` · `סגירת מרפסת` · `תריסי אקורדיון` ·
`גדר אלומיניום` · `שער חשמלי` · `דק סינטטי` · `חיפוי קירות חוץ` · `מטבח חוץ` ·
`היתר בנייה לפרגולה` · `כמה עולה פרגולה` · `{מוצר} ב{עיר}`

Note the split: **מצללה** is the regulatory/municipal word, **פרגולה** is the consumer word. Use
each where its readers are — a permit guide that never says מצללה misses the query.

## Headings

- H1 once per page, carrying the primary keyword naturally. `{מוצר} {חומר}` or the question form.
- H2s are questions or benefits, never `שירותים נוספים` / `קצת עלינו`.
- Keep headings ≤8 words; Hebrew sets wide and wraps badly in card grids.

## CTAs

Ranked: `חייגו עכשיו` · `דברו איתנו בוואטסאפ` · `קבלו הצעת מחיר` · `נשמח לייעץ — ללא התחייבות`.
Avoid `שלח` alone (ambiguous imperative) — use `שליחת הפרטים`. Never promise a response time that
is not confirmed (`תוך 24 שעות` is 🔶).

## RTL mechanics

- **Logical properties only** in Tailwind: `ms-*/me-*`, `ps-*/pe-*`, `start-*/end-*`, `text-start`.
  A stray `ml-4` or `text-left` is a bug that only shows in Hebrew.
- Icons that imply direction (arrows, chevrons) must mirror. Icons that don't (phone, WhatsApp) must
  not — check `lucide-react` usages after any RTL fix.
- **Numbers, phones and Latin strings are LTR islands** inside RTL text. `050-5063152` renders
  correctly but a trailing `.` or `:` can jump — wrap with `<span dir="ltr">` when punctuation
  neighbours a number, and always in table cells.
- Units follow the number with a space: `50 מ״ר`, `3 מ׳`. Use the Hebrew geresh/gershayim
  (`מ״ר`, `ת״י`, `ח״פ`) — not `"` and `'`.
- Currency: `₪12,000` or `12,000 ₪` — pick one and stay consistent (the site uses `₪` before).
- Dates: `אוגוסט 2026` in prose, ISO in `datetime` attributes.
- Line length: Hebrew reads comfortably at ~65–75 chars; the wide-screen `max-w-*` that looks fine in
  English is too wide here.

## Before shipping a string

- [ ] no fabricated fact (`eeat-trust-evidence`)
- [ ] primary keyword appears naturally in H1 + first 100 words, not stuffed
- [ ] no sentence a competitor could publish verbatim
- [ ] `npm run build` — Heebo subsets `hebrew` + `latin`; a new glyph set is a real cost
- [ ] eyeball at 375px width: Hebrew wraps earlier than you expect
