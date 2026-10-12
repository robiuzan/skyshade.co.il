/**
 * skyshade.co.il — the homepage updates strip (fleet live-kit). The newest three show between
 * the process steps and the project gallery; /assets/live.js (and the calm script, from <html>)
 * hide the strip once the newest item is 45 days old, so a quiet month shows nothing rather than
 * old news. A new item is a real content change.
 *
 * Each item: { date: "YYYY-MM-DD" (the day it happened, never in the future), text (≤ 140,
 * no typed phone number, no price, no promise), href (a page of this site), linkLabel (≤ 18),
 * source (the fact it rests on) }. One item per date. scripts/live/check-live-register.mjs
 * enforces it. Never a customer, street, review, count, price or response time.
 *
 * Both items below are real and dated, and both are already past 45 days on 2026-10-11 — so the
 * strip ships HIDDEN until the next real content change is added here with its own date.
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   d68a0251f821 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 */
export default {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint d68a0251f821 (one supporting source note re-cited after approval; the visible words are unchanged)",
  heading: "עדכונים אחרונים",
  items: [
    {
      date: "2026-08-25",
      text: "מדריך על פרגולה שמשמשת גם כסוכה: מה חשוב לבדוק לפני שמתכננים, ומה לבקש כבר בשלב המדידה.",
      href: "/guides/pergola-sukkah/",
      linkLabel: "לקריאת המדריך",
      source:
        "lib/guides.ts — pergola-sukkah, published 2026-08-25 (commit 69783c9); docs/measurement-plan.md row 2026-08-25 — /guides/pergola-sukkah/ shipped",
    },
    {
      date: "2026-08-24",
      text: "שני המדריכים הראשונים באתר: היתר בנייה לפרגולה, ופרגולת אלומיניום או עץ — מה עדיף.",
      href: "/guides/",
      linkLabel: "לכל המדריכים",
      source:
        "lib/guides.ts — pergola-permit and aluminum-vs-wood-pergola, both published 2026-08-24 (commit a1b35ce); docs/measurement-plan.md row 2026-08-24 — /guides/ silo opened",
    },
  ],
};
