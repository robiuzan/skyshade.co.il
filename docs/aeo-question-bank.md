# Question bank — the queries the content must answer

Real query shapes for this category in Hebrew. Every FAQ and every guide draws from here rather than
from imagination. Each question is owned by exactly one URL (`docs/keyword-map.md`); a question
answered on three pages is answered well on none.

Format for every answer: the question as an H2, then a **self-contained 40–60 word** answer, then the
nuance. See the `aeo-answer-content` skill.

## Permits and regulation → `/guides/pergola-permit/`

Note the vocabulary split: consumers search **פרגולה**, the regulations say **מצללה**. A permit guide
that never says מצללה misses half the query set.

- האם צריך היתר בנייה לפרגולה?
- מה גודל הפרגולה הפטורה מהיתר?
- מה זה חוק הפרגולות / תקנות הפטור?
- האם צריך אישור ועד בית לפרגולה במרפסת?
- פרגולה על גג — מה מותר?
- מה ההבדל בין מצללה לפרגולה מבחינת החוק?
- מה קורה אם בונים בלי היתר?

⚠️ Conditional-exemption wording only, always with the not-legal-advice line. The reviewed text is in
`lib/content.ts` — copy it, do not re-word it.

## Price → `/guides/pergola-cost/` (the whole cluster — there is no `/pricing/` page)

- כמה עולה פרגולת אלומיניום?
- מחיר פרגולה למ״ר
- כמה עולה פרגולה חשמלית / ביואקלימית?
- מה משפיע על המחיר? (גודל, מנוע, גימור, מורכבות התקנה)
- פרגולת אלומיניום מול עץ — מה יוצא זול יותר לאורך זמן?
- כמה עולה סגירת מרפסת? → `/guides/balcony-enclosure-cost/`
- כמה עולה דק סינטטי למ״ר? → `/guides/deck-cost/`

🔶 **Blocked:** no price band is publishable until Yossi confirms one. Build the page structure, leave
the numbers empty. A cost guide with no numbers is still the wrong answer — this cluster ships only
after the intake session.

## Comparison → `/guides/aluminum-vs-wood-pergola/` and siblings

- פרגולת אלומיניום או עץ — מה עדיף?
- דק סינטטי או דק עץ?
- פרגולה חשמלית או קבועה?
- אלומיניום מול PVC לסגירת מרפסת
- גדר אלומיניום מול גדר עץ

A 4–6 criterion table (עלות · תחזוקה · אורך חיים · עמידות בשמש/מלח · מראה · זמן התקנה) is the single
most-quoted structure in this category.

## Product and specification → the service pages

- מה זו פרגולה ביואקלימית?
- כמה זמן לוקחת התקנה?
- איזו פרגולה מתאימה למרפסת קטנה?
- האם פרגולת אלומיניום מתחממת בשמש?
- איך מנקים ומתחזקים פרגולת אלומיניום?
- האם הפרגולה עמידה בסופה / ברוח?
- אילו צבעים וגימורים קיימים?
- פרגולה מותאמת לסוכה — מה צריך לדעת? *(`מותאמת`, never `כשרה` — refer the reader to their rabbi)*

## Process and trust → `/about/`, `/contact/`, `/warranty/`

- איך מתחיל התהליך? מה קורה אחרי שמתקשרים?
- כמה זמן לוקח מהזמנה עד התקנה? 🔶
- מה כוללת האחריות? 🔶
- האם מגיעים למדידה בבית? כמה זה עולה? 🔶
- האם עובדים בכל הארץ?

## Local → the surviving city pages

- פרגולות אלומיניום ב{עיר}
- מי מתקין פרגולות ב{עיר}?
- האם צריך היתר לפרגולה ב{עיר}? *(only where the local ועדה's posture is genuinely known — this is
  the differentiator that keeps a city page alive)*

## Rules

1. One question, one owning URL. Never repeat an FAQ block across pages.
2. 4–8 questions per page, each a **distinct** query — not eight rephrasings of one.
3. FAQ text on the page and in `faqJsonLd()` must match **verbatim**.
4. A 🔶 question does not get a written answer. It gets a slot and a line in
   [owner-intake-checklist.md](owner-intake-checklist.md).
