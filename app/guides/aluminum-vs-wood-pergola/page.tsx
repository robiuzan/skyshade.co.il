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

const guide = guides.find((g) => g.slug === "aluminum-vs-wood-pergola")!;
const PATH = "/guides/aluminum-vs-wood-pergola/";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: guide.seoTitle,
  description: guide.description,
};

/**
 * Answer blocks — rendered verbatim on the page and in the FAQPage markup, one source.
 *
 * ⚠️ NO PRICES. Every claim here is about material behaviour, not cost. Price bands are 🔶
 * blocked on the owner (docs/evidence-register.md), and the whole price cluster belongs to
 * /guides/pergola-cost/ when it can be written honestly — not smuggled in here as "יקר יותר".
 */
const faqs = [
  {
    q: "פרגולת אלומיניום או עץ — מה עדיף?",
    a: "אלומיניום עדיף כשרוצים מבנה שלא דורש טיפול: הוא אינו מחליד, אינו מתעוות בשמש ואינו נסדק, ולכן מתאים במיוחד לאקלים הישראלי ולקרבה לים. עץ עדיף כשהמראה החם והטבעי הוא השיקול המרכזי, ומקבלים על עצמכם צביעה או שימון תקופתיים. ההבדל אינו באיכות אלא במה שאתם מוכנים לתחזק.",
  },
  {
    q: "כמה תחזוקה דורשת פרגולת עץ לעומת אלומיניום?",
    a: "פרגולת עץ בחוץ דורשת טיפול תקופתי — ליטוש, שימון או צביעה — כדי לעצור התייבשות, סדקים והכהיה מהשמש. פרגולת אלומיניום דורשת שטיפה במים ולא יותר: הצבע נצרב בתנור ואינו מתקלף, והפרופיל אינו סופג לחות. לאורך עשור זה ההבדל המעשי הגדול ביותר בין השניים.",
  },
  {
    q: "האם החומר משפיע על הפטור מהיתר?",
    a: "התנאי בתקנות הוא בנייה מחומרים קלים, ואלומיניום ועץ שניהם נכנסים לקטגוריה הזו — כך שהבחירה ביניהם אינה מכריעה את הפטור. מה שכן מכריע הוא הקירוי: לפחות 40% מרווחים בין חלקי הקירוי. גג אטום יוציא אתכם מהפטור בין אם המבנה מעץ ובין אם מאלומיניום. אין באמור ייעוץ משפטי.",
  },
  {
    q: "פרגולת אלומיניום מתחממת בשמש?",
    a: "הפרופיל עצמו מתחמם למגע בשמש ישירה, אבל זה כמעט אינו מורגש בשימוש: אין נגיעה בפרופילים בגובה הקירוי, והצל עצמו מתנהג זהה. מה שכן משפיע על תחושת החום מתחת לפרגולה הוא צבע הקירוי וכיוון הלהבים — לא החומר.",
  },
  {
    q: "אפשר לשלב אלומיניום ועץ באותה פרגולה?",
    a: "כן, וזו בחירה נפוצה: שלד אלומיניום שנושא את המבנה ומספק את העמידות, עם קירוי או חיפוי עץ שנותן את המראה. כך התחזוקה מצטמצמת לחלק הגלוי בלבד, והמבנה עצמו נשאר ללא טיפול.",
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
    { name: "אלומיניום או עץ", path: PATH },
  ]),
  faqNode(PATH, faqs),
]);

/** The comparison table — the single most-quoted structure for X-או-Y queries. */
const rows: { criterion: string; aluminium: string; wood: string }[] = [
  {
    criterion: "תחזוקה שוטפת",
    aluminium: "שטיפה במים. אין צביעה ואין שימון.",
    wood: "ליטוש ושימון או צביעה אחת לתקופה, לפי החשיפה לשמש.",
  },
  {
    criterion: "התנהגות בשמש הישראלית",
    aluminium: "אינו מתעוות ואינו נסדק. הצבע נצרב בתנור ואינו מתקלף.",
    wood: "מתייבש, נסדק ומכהה עם הזמן ללא טיפול.",
  },
  {
    criterion: "קרבה לים ואוויר מלוח",
    aluminium: "אינו מחליד. מתאים לחזית ים.",
    wood: "סופג לחות; דורש טיפול תכוף יותר.",
  },
  {
    criterion: "מראה",
    aluminium: "קווים נקיים ומדויקים, מגוון גוונים.",
    wood: "מראה חם וטבעי, שינוי גוון טבעי עם השנים.",
  },
  {
    criterion: "דיוק מידות",
    aluminium: "פרופיל מיוצר למידה — סטיות מזעריות.",
    wood: "חומר טבעי; מידות מושפעות מלחות.",
  },
  {
    criterion: "אפשרות מנגנון חשמלי",
    aluminium: "כן — להבים מתכווננים, פתיחה וסגירה בלחיצה.",
    wood: "לא בשלד עץ מלא.",
  },
  {
    criterion: "השפעה על הפטור מהיתר",
    aluminium: "חומר קל — נכנס לתנאי.",
    wood: "חומר קל — נכנס לתנאי. הקירוי הוא מה שמכריע.",
  },
];

export default function AluminumVsWoodGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title={guide.title}
        subtitle="שבעה קריטריונים מעשיים, כולל אחד שרוב ההשוואות מפספסות."
        crumbs={[
          { label: "בית", href: "/" },
          { label: "מדריכים", href: "/guides" },
          { label: "אלומיניום או עץ" },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-500">עודכן: אוגוסט 2026</p>

          <p className="mt-6 text-lg leading-relaxed text-gray-800">
            בקצרה: ההבדל בין פרגולת אלומיניום לפרגולת עץ אינו באיכות אלא בתחזוקה. אלומיניום
            נשאר כפי שהותקן כמעט ללא טיפול; עץ נותן מראה חם יותר ודורש טיפול תקופתי כדי
            לשמור עליו. הבחירה היא בין מראה לבין זמן.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            השוואה לפי שבעה קריטריונים
          </h2>
          {/* overflow-x-auto: the table must scroll inside itself, never push the page sideways
              on a phone. */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-start text-sm">
              <thead>
                <tr className="bg-gray-50 text-primary">
                  <th className="border border-gray-200 px-3 py-2 text-start font-heading">
                    קריטריון
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-start font-heading">
                    אלומיניום
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-start font-heading">
                    עץ
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.criterion} className="align-top">
                    <th className="border border-gray-200 px-3 py-2 text-start font-medium text-primary">
                      {r.criterion}
                    </th>
                    <td className="border border-gray-200 px-3 py-2 text-gray-700">
                      {r.aluminium}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-700">{r.wood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            עלות לא מופיעה בטבלה בכוונה: היא נגזרת מהמידות, מהמפרט ומתנאי ההתקנה בשטח, ומחירון
            כללי היה מטעה יותר מאשר עוזר. אנחנו נותנים הצעה אחרי מדידה, ללא עלות.
          </p>

          {faqs.map((f, i) => (
            <div key={f.q} className={i === 0 ? "mt-10" : "mt-8"}>
              <h2 className="font-heading text-xl font-bold text-primary">{f.q}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{f.a}</p>

              {i === 2 && (
                <p className="mt-3 leading-relaxed text-gray-700">
                  ההבחנה הזו חשובה כי היא מפילה הנחה נפוצה — שפרגולת עץ &quot;פטורה יותר&quot;.
                  הפירוט המלא של תנאי הפטור נמצא במדריך{" "}
                  <Link href="/guides/pergola-permit" className="text-secondary underline">
                    היתר בנייה לפרגולה
                  </Link>
                  .
                </p>
              )}
            </div>
          ))}

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            אז מה מתאים לחצר שלכם?
          </h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>
              <strong className="text-primary">חזית ים או אוויר מלוח</strong> — אלומיניום, בלי
              היסוס.
            </li>
            <li>
              <strong className="text-primary">מרפסת בבניין שאין אליה גישה נוחה</strong> —
              אלומיניום, כי כל טיפול עתידי יהיה יקר ומסובך.
            </li>
            <li>
              <strong className="text-primary">גינה עם עיצוב טבעי ונכונות לתחזק</strong> — עץ,
              או שילוב של שלד אלומיניום עם קירוי עץ.
            </li>
            <li>
              <strong className="text-primary">רוצים שליטה בכמות הצל</strong> — אלומיניום עם
              להבים מתכווננים; בעץ אין מקבילה.
            </li>
          </ul>

          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="font-heading text-lg font-bold text-primary">
              רוצים לראות איך זה נראה אצלכם?
            </h2>
            <p className="mt-2 leading-relaxed text-gray-700">
              אנחנו מתכננים פרגולות אלומיניום למידה, כולל שילובי עץ בקירוי כשזה מה שמתאים
              לחצר. ייעוץ ומדידה בשטח — ללא עלות וללא התחייבות.
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
