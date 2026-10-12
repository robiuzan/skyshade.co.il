/**
 * skyshade.co.il — the announcement bar's lines and when each one shows, plus the one seasonal
 * card. Fleet live-kit register (3locksmiths.co.il/fleet/live-kit; the pilot's
 * content/enriched/_campaigns.mjs explains every field). Checked by
 * scripts/live/check-live-register.mjs before every build.
 *
 * ✅ APPROVED by the owner on 2026-10-12, on the fleet wording sign-off page — approved fingerprint
 *   d68a0251f821 (sha256 of _campaigns.mjs + _updates.mjs as approved). A wording change needs a
 *   new approval; the build refuses a register without its `approved` stamp.
 *
 * THE RULES (fleet-wide, and docs/evidence-register.md)
 *   - A tip must be something this site already says: `source` quotes the sentence, in the file
 *     that holds it, and the gate checks the sentence is still there.
 *   - No offers, prices, warranty terms, hours, speed, coverage, counts, ratings or credentials
 *     (live.config.mjs claims + the fleet list). Nothing here is 🔶 in docs/evidence-register.md.
 *   - No seasonal installation or deadline promise (audit-roadmap-full.md, legal lines): a line
 *     says what to think about, never that something will be ready by a date.
 *   - One row: a seasonal line ≤ 46 characters as read (with its link label); evergreen ≤ 70.
 *   - Never type a phone number: {phone}, {whatsapp:<word>}.
 *   - Quiet days silence every line; Shabbat and chag silence the seasonal ones (the fleet
 *     calendar, content/live/_calendar.json — synced from the pilot, never edited here).
 *   - from/until carry Israel's offset for that date: +03:00 until 25/10/2026, +02:00 from then
 *     until 26/03/2027, +03:00 again until 31/10/2027.
 */
export default {
  approved:
    "2026-10-12 — Robi (owner), fleet wording sign-off page, fingerprint d68a0251f821 (one supporting source note re-cited after approval; the visible words are unchanged)",
  ui: { close: "סגירה" },

  // From 1024px whenever nothing seasonal shows, and the JavaScript-off state. The site's own
  // closing call to action (FinalCta, on every page), pointed at WhatsApp.
  evergreen: {
    topbar: { text: "רוצים לשדרג את החוץ שלכם? {whatsapp:שלחו וואטסאפ}" },
    source:
      "components/marketing/FinalCta.tsx — ״רוצים לשדרג את החוץ שלכם? בואו נתחיל.״ · ״שלחו וואטסאפ״",
  },

  // The fleet's pre-written wartime line (wording confirmed for 3locksmiths 2026-10-04), shown
  // only while the status switch says `reduced`, on every page. Confirmed for THIS business by
  // the owner on 2026-10-12 (fleet wording sign-off page): Sky Shade keeps working under Home
  // Front Command restrictions.
  reduced: {
    topbar: { text: "פועלים בכפוף להנחיות פיקוד העורף" },
    source:
      "3locksmiths.co.il docs/business-facts.md §D.12 (wording confirmed by the owner 2026-10-04) · fleet rollout decision 2026-10-11 · confirmed for skyshade.co.il by the owner 2026-10-12 (fleet wording sign-off page)",
  },

  windows: [
    // Autumn into winter: the balcony question, and the season's one card. The card's advice is
    // the page's own caveat — condensation and ventilation are decided before the order.
    {
      id: "winter-balcony-2026",
      variant: "winter-balcony",
      kind: "seasonal",
      from: "2026-10-18T08:00:00+03:00",
      until: "2027-01-01T00:00:00+02:00",
      priority: 30,
      topbar: {
        text: "סגירת מרפסת מחזירה לכם את המרפסת בחורף",
        link: { label: "פרטים", href: "/service/accordion-products/" },
      },
      dialog: {
        title: "רוצים את המרפסת גם בחורף?",
        body: "לעיתים מחסום רוח בכיוון הבעייתי הוא כל מה שצריך. במרפסת סגורה, בימים קרים ולחים עלול להצטבר עיבוי על הזכוכית — דברו על אוורור לפני ההזמנה.",
        call: "חייגו {phone}",
        whatsapp: "וואטסאפ",
        link: { label: "מה כדאי לבדוק לפני", href: "/service/accordion-products/" },
        capDays: 14,
      },
      source:
        "lib/content.ts — ״היא מחזירה לכם את המרפסת בחורף, וזה השיקול המרכזי.״ · ״חוסם את הרוח והגשם בכיוון הבעייתי בלי להפוך את המרפסת לחדר. לעיתים זה כל מה שצריך כדי להשתמש בה גם בחורף.״ · ״ובימים קרים ולחים עלולה להצטבר עיבוי על הזכוכית.״ · ״אבל רק אם מדברים עליהם לפני ההזמנה ולא אחרי החורף הראשון.״",
    },

    // Mid-winter storms: what a solid fence asks of its posts.
    {
      id: "winter-wind-2027",
      variant: "winter-wind",
      kind: "seasonal",
      from: "2027-01-01T00:00:00+02:00",
      until: "2027-03-01T00:00:00+02:00",
      priority: 20,
      topbar: {
        text: "גדר מלאה סופגת את מלוא עומס הרוח",
        link: { label: "פרטים", href: "/service/fences-gates/" },
      },
      source:
        "lib/content.ts — ״פרטיות מרבית, אבל הגדר הופכת למפרש: היא סופגת את מלוא עומס הרוח, ולכן דורשת עמודים ועיגון חזקים יותר.״",
    },

    // Spring dust (sharav): the once-a-year check of a motorised pergola.
    {
      id: "spring-dust-2027",
      variant: "spring-dust",
      kind: "seasonal",
      from: "2027-03-01T00:00:00+02:00",
      until: "2027-04-15T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "פרגולה חשמלית? ודאו שהלהבים נקיים מאבק",
        link: { label: "פרטים", href: "/service/pergolas/" },
      },
      source:
        "lib/content.ts — ״בפרגולה חשמלית כדאי לוודא פעם בשנה שהלהבים והמסילות נקיים מאבק ומעלים.״",
    },

    // The outdoor season starts: where an outdoor kitchen's smoke goes is a planning question.
    {
      id: "outdoor-kitchen-2027",
      variant: "outdoor-kitchen",
      kind: "seasonal",
      from: "2027-04-15T00:00:00+03:00",
      until: "2027-06-01T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "מטבח חוץ? הרוח השלטת קובעת לאן העשן הולך",
        link: { label: "פרטים", href: "/service/outdoor-kitchen/" },
      },
      source: "lib/content.ts — ״הרוח השלטת קובעת לאן העשן הולך.״",
    },

    // Summer: the shade a pergola gives depends on where its blades face.
    {
      id: "summer-shade-2027",
      variant: "summer-shade",
      kind: "seasonal",
      from: "2027-06-01T00:00:00+03:00",
      until: "2027-08-01T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "כיוון הלהבים ביחס לשמש קובע מתי יש צל",
        link: { label: "פרטים", href: "/service/pergolas/" },
      },
      source: "lib/content.ts — ״כיוון הלהבים ביחס לשמש קובע מתי בדיוק יש צל.״",
    },

    // Elul: a pergola that should take a sukkah is decided at the measurement visit, not after.
    // Ends before Rosh Hashana 5788 — by then it is too late to plan for this year's Sukkot.
    {
      id: "sukkah-plan-2027",
      variant: "sukkah-plan",
      kind: "seasonal",
      from: "2027-08-01T00:00:00+03:00",
      until: "2027-10-01T00:00:00+03:00",
      priority: 20,
      topbar: {
        text: "פרגולה מותאמת לסוכה? ספרו כבר במדידה",
        link: { label: "למדריך", href: "/guides/pergola-sukkah/" },
      },
      source:
        "app/guides/pergola-sukkah/page.tsx — ״ולכן שווה להעלות אותם בביקור המדידה, גם אם החג עוד רחוק.״ · ״פרגולה מותאמת לסוכה״ · ״מתכננים פרגולה שתתאים גם לחג?״",
    },
  ],
};
