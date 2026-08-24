/**
 * guides.ts — the index of the /guides/ silo.
 *
 * The guides answer the decision questions the service pages cannot own without losing their
 * transactional intent (docs/information-architecture.md). Each guide's BODY lives in its own
 * page file; only the index metadata lives here, so `app/guides/page.tsx` and `app/sitemap.ts`
 * have one list to iterate and cannot drift from each other.
 *
 * ADDING A GUIDE: run the `new-page-gate` skill first. A guide ships only with 500+ unique
 * words, an answer block per question, and every fact confirmed in docs/evidence-register.md.
 * `updated` is rendered on the page as "עודכן" — it must be true. Fake freshness is detectable
 * and it is the fastest way to lose citation trust.
 *
 * NOT YET BUILT (blocked on owner-supplied price bands — docs/owner-intake-checklist.md §5):
 * pergola-cost, balcony-enclosure-cost, deck-cost. The whole price cluster owns /guides/*-cost/;
 * there is deliberately no /pricing/ page.
 */

export interface Guide {
  slug: string;
  /** H1 / hub card title. */
  title: string;
  /** <title> without the "| סקיי שייד" suffix — ≤48 chars. */
  seoTitle: string;
  description: string;
  /** One-line hub summary. */
  summary: string;
  published: string;
  updated: string;
  /** The service page this guide feeds. The money link. */
  service: { slug: string; name: string };
}

export const guides: Guide[] = [
  {
    slug: "pergola-permit",
    title: "היתר בנייה לפרגולה — מתי צריך ומתי יש פטור",
    seoTitle: "היתר בנייה לפרגולה — מתי צריך ומתי לא",
    description:
      "מתי פרגולה (מצללה) פטורה מהיתר בנייה, מהם ארבעת התנאים לפטור, חובת הדיווח תוך 45 יום, ומה שונה במרפסת בבניין משותף. מדריך מעשי, לא ייעוץ משפטי.",
    summary:
      "ארבעת תנאי הפטור, חובת הדיווח שרוב האנשים מפספסים, ומה בודקים מול הוועדה המקומית.",
    published: "2026-08-24",
    updated: "2026-08-24",
    service: { slug: "pergolas", name: "פרגולות, מחסות וגגות" },
  },
  {
    slug: "aluminum-vs-wood-pergola",
    title: "פרגולת אלומיניום או עץ — מה עדיף?",
    seoTitle: "פרגולת אלומיניום או עץ — השוואה",
    description:
      "השוואה בין פרגולת אלומיניום לפרגולת עץ: תחזוקה, אורך חיים, עמידות בשמש ובאוויר מלוח, מראה, והשפעה על הפטור מהיתר. מה מתאים לאיזו חצר.",
    summary:
      "שבעה קריטריונים, כולל אחד שרוב ההשוואות מפספסות: איך החומר משפיע על הפטור מהיתר.",
    published: "2026-08-24",
    updated: "2026-08-24",
    service: { slug: "pergolas", name: "פרגולות, מחסות וגגות" },
  },
];

export const guidePaths = guides.map((g) => `guides/${g.slug}`);
