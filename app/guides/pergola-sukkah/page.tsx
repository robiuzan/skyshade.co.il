import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";
import {
  webPageNode,
  breadcrumbNode,
  articleNode,
  faqNode,
  graphScript,
} from "@/lib/seo-graph";

const guide = guides.find((g) => g.slug === "pergola-sukkah")!;
const PATH = "/guides/pergola-sukkah/";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: guide.seoTitle,
  description: guide.description,
};

/**
 * Answer blocks — rendered verbatim on the page and in the FAQPage markup, one source.
 *
 * ⚠️ TWO HARD LINES ON THIS PAGE (docs/seo-guardrails.md):
 *
 * 1. NEVER "כשרה לסוכה". We are an aluminium fabricator, not a halachic authority; certifying
 *    kashrut is not ours to do and claiming it would be both a religious overreach and a
 *    consumer-protection exposure. The word is "מותאמת" — the pergola is engineered so a sukkah
 *    CAN be built under it, and every halachic question is referred to the reader's rabbi.
 *    Every answer below that touches halacha says so explicitly.
 * 2. NO PRICES. Same rule as every other guide — the cost cluster is blocked on the owner.
 *
 * The engineering claims (full retraction clears the aperture, louvres leave blades overhead,
 * timber laths spread the load) are product facts we can stand behind. The halachic
 * *significance* of those facts is deliberately framed as "this is the question to ask",
 * never as a ruling.
 */
const faqs = [
  {
    q: "אפשר להשתמש בפרגולה כסוכה?",
    a: "הפרגולה עצמה אינה הסוכה, ולהבי אלומיניום אינם סכך. מה שפרגולה יכולה לתת הוא המבנה: פרגולה שנפתחת במלואה מאפשרת להניח סכך תחת כיפת השמיים, בלי גג קבוע מעליו, ולפרק אותו בתום החג. פרגולה עם גג קבוע — פוליקרבונט, זכוכית או קירוי אטום — אינה מתאימה לכך. את השאלות ההלכתיות עצמן יש להפנות לרב שלכם.",
  },
  {
    q: "פרגולה נאספת או להבים מתכווננים — מה מתאים יותר?",
    a: "פרגולה נאספת מקפלת את הקירוי לצד אחד ומשאירה פתח פתוח לחלוטין לשמיים. פרגולה עם להבים מתכווננים מסובבת את הלהבים ל-90 מעלות, אבל הלהבים עצמם נשארים במקומם מעל הסכך. זה הבדל מהותי לעניין הזה, והוא בדיוק סוג השאלה שצריך להציג לרב לפני ההזמנה — לא אחריה, כי המנגנון נקבע בשלב התכנון.",
  },
  {
    q: "מותר שהסכך יונח על שלד אלומיניום?",
    a: "זו שאלת ה״מעמיד״ — מה נושא את הסכך — ויש בה דעות שונות בין הפוסקים. הפתרון המעשי שנהוג לבקש הוא הנחת קורות או לטות עץ לרוחב השלד, כך שהסכך מונח על העץ ולא על המתכת. אפשר להכין את המקומות לקורות מראש בשלב הייצור. ההכרעה ההלכתית היא של הרב שלכם; שלנו זה רק לוודא שהמבנה מאפשר את שתי האפשרויות.",
  },
  {
    q: "איזה גובה ומידות צריך לקחת בחשבון?",
    a: "בהלכה יש גבולות גובה לסכך — הוא אינו יכול להיות גבוה או נמוך מדי — וגם מידת מינימום לשטח הסוכה. לכן גובה הקירוי של הפרגולה ורוחב הפתח הנפתח אינם רק שאלה של עיצוב. הביאו לרב את המידות המדויקות שאתם שוקלים לפני שמזמינים, כי שינוי גובה אחרי הייצור פירושו פרופילים חדשים.",
  },
  {
    q: "צריך היתר בנייה לפרגולה שתשמש גם לסוכה?",
    a: "אותם כללים חלים בדיוק: פרגולה נבחנת לפי תנאי הפטור בתקנות התכנון והבנייה — שטח, חומרים קלים, ולפחות 40% מרווחים בין חלקי הקירוי — ולא לפי מה שעושים תחתיה בחג. פרגולה נאספת שנפתחת לשמיים עומדת בתנאי המרווחים בקלות. חובת הדיווח לרשות הרישוי תוך 45 יום מסיום הביצוע חלה גם כאן. אין באמור ייעוץ משפטי.",
  },
] as const;

const jsonLd = graphScript([
  webPageNode({
    path: PATH,
    name: guide.title,
    description: guide.description,
    hasBreadcrumb: true,
  }),
  articleNode({
    path: PATH,
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
  }),
  breadcrumbNode(PATH, [
    { name: "בית", path: "/" },
    { name: "מדריכים", path: "/guides/" },
    { name: "פרגולה מותאמת לסוכה", path: PATH },
  ]),
  faqNode(PATH, faqs),
]);

/** What to raise at the measurement visit. The differentiator: these are all decisions that
    become expensive or impossible after the profiles are cut. */
const checklist: { title: string; body: string }[] = [
  {
    title: "מנגנון הפתיחה",
    body: "נאספת (הקירוי מתקפל לצד) או להבים מתכווננים. זו ההחלטה הראשונה, והיא משנה את כל התכנון.",
  },
  {
    title: "כיוון הקיפול",
    body: "לאיזה צד נאסף הקירוי — כדי שהפתח הפתוח יהיה מעל השטח שבו תעמוד הסוכה ולא מעל הקיר.",
  },
  {
    title: "מקומות לקורות עץ",
    body: "אם תרצו שהסכך יונח על עץ ולא על מתכת, אפשר להכין את הנקודות לקורות כבר בייצור.",
  },
  {
    title: "גובה הקירוי",
    body: "הביאו את הגובה שאישר הרב שלכם. אחרי הייצור זה פרופילים חדשים, לא כוונון.",
  },
  {
    title: "רוחב הפתח",
    body: "השטח שנפתח בפועל לשמיים — לא שטח הפרגולה כולה. הם לא תמיד זהים.",
  },
  {
    title: "גישה ותפעול",
    body: "מי פותח וסוגר, ובאיזו תדירות. זה משפיע על בחירת המנוע ועל מיקום השלט.",
  },
];

export default function PergolaSukkahGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title={guide.title}
        subtitle="מה שצריך להחליט בשלב התכנון — ומה להביא לרב לפני שמזמינים."
        crumbs={[
          { label: "בית", href: "/" },
          { label: "מדריכים", href: "/guides" },
          { label: "פרגולה מותאמת לסוכה" },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-500">עודכן: אוגוסט 2026</p>

          <p className="mt-6 text-lg leading-relaxed text-gray-800">
            בקצרה: פרגולת אלומיניום אינה סוכה ולהבי אלומיניום אינם סכך. מה שפרגולה נאספת כן
            נותנת היא פתח פתוח לחלוטין לשמיים, שמאפשר להקים סוכה תחתיה ולפרק אותה בתום החג.
            ההחלטות שקובעות אם זה יעבוד — מנגנון הפתיחה, כיוון הקיפול והגובה — מתקבלות בשלב
            התכנון, לא אחריו.
          </p>

          {/* Set the boundary once, up front, in a visually distinct block — so a reader
              skimming for a kashrut claim finds the disclaimer instead. */}
          <div className="mt-8 rounded-2xl border border-accent-200 bg-accent-50 p-5">
            <p className="font-heading font-bold text-primary">מה המדריך הזה כן ולא</p>
            <p className="mt-2 leading-relaxed text-gray-700">
              אנחנו יצרני אלומיניום, לא פוסקי הלכה. המדריך מסביר מה המבנה מאפשר מבחינה
              הנדסית ואילו שאלות כדאי להביא לרב — ואינו קובע מה כשר. אנחנו לא מצהירים על אף
              מוצר שהוא &quot;כשר לסוכה&quot;; ההכרעה היא של הרב שלכם, ורצוי לפני ההזמנה.
            </p>
          </div>

          {faqs.map((f, i) => (
            <div key={f.q} className={i === 0 ? "mt-10" : "mt-8"}>
              <h2 className="font-heading text-xl font-bold text-primary">{f.q}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{f.a}</p>

              {i === 4 && (
                <p className="mt-3 leading-relaxed text-gray-700">
                  הפירוט המלא של תנאי הפטור, כולל מה נחשב &quot;חומרים קלים&quot; ואיך נמדדים
                  40% המרווחים, נמצא במדריך{" "}
                  <Link href="/guides/pergola-permit" className="text-secondary underline">
                    היתר בנייה לפרגולה
                  </Link>
                  .
                </p>
              )}
            </div>
          ))}

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            מה לבקש כבר בשלב המדידה
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            כל אחד מהסעיפים האלה נקבע לפני שהפרופילים נחתכים. אחרי הייצור, שינוי בהם אינו
            כוונון אלא הזמנה חדשה — ולכן שווה להעלות אותם בביקור המדידה, גם אם החג עוד רחוק.
          </p>
          <ul className="mt-5 space-y-3">
            {checklist.map((c) => (
              <li key={c.title} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <strong className="text-primary">{c.title}</strong>
                <span className="text-gray-700"> — {c.body}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            למה בכלל להתכנן לזה מראש
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            פרגולה נאספת עובדת כל השנה כפתרון הצללה רגיל — צל בקיץ, שמש בחורף, מרפסת שמישה
            בכל עונה. ההתאמה לסוכה אינה מוצר נפרד ואינה מייקרת את המבנה בפני עצמה; היא סדרה
            של החלטות תכנון שנעשות ממילא, רק עם שיקול נוסף באוזן. מי שלא חשב על זה מראש
            מגלה בדרך כלל בערב החג שהפתח נפתח מעל הצד הלא נכון של המרפסת.
          </p>

          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="font-heading text-lg font-bold text-primary">
              מתכננים פרגולה שתתאים גם לחג?
            </h2>
            <p className="mt-2 leading-relaxed text-gray-700">
              ספרו לנו על זה כבר בשיחה הראשונה — זה משנה את מנגנון הפתיחה, את כיוון הקיפול
              ואת הכנת המקומות לקורות. ייעוץ ומדידה בשטח, ללא עלות וללא התחייבות.
            </p>
            <p className="mt-3">
              <Link href="/service/pergolas" className="font-medium text-secondary underline">
                לעמוד הפרגולות ←
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
