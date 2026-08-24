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

const guide = guides.find((g) => g.slug === "pergola-permit")!;
const PATH = "/guides/pergola-permit/";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: guide.seoTitle,
  description: guide.description,
};

/**
 * THE ANSWER BLOCKS. Each of these renders verbatim on the page AND goes into the FAQPage
 * markup — one source, so the two can never diverge. The building-permit defect shipped in copy
 * and schema simultaneously; this shape is what prevents a repeat.
 *
 * ⚠️ LEGALLY REVIEWED TEXT. The first answer is the wording reviewed 2026-08-17 and is kept
 * character-identical with the copies in lib/content.ts (homepage FAQ + pergola service FAQ).
 * Change all three together, and only after re-review. Conditional-exemption phrasing only —
 * never "לא צריך היתר" — and every regulatory answer carries the not-legal-advice line.
 */
const faqs = [
  {
    q: "האם צריך היתר בנייה לפרגולה?",
    a: "לרוב הפרגולות (מצללות) יש פטור מהיתר לפי תקנות התכנון והבנייה (תשע״ד-2014), בתנאים: שטח עד 50 מ״ר או עד רבע מהשטח הפנוי (הגדול מביניהם), בנייה מחומרים קלים, מרווחים של 40% לפחות בין חלקי הקירוי, ועמידה בהנחיות המרחביות של הוועדה המקומית. גם כשיש פטור, חובה לדווח לרשות הרישוי תוך 45 יום מסיום הביצוע. אנחנו מלווים אתכם בכל התהליך. אין באמור ייעוץ משפטי.",
  },
  {
    q: "מה ההבדל בין פרגולה למצללה?",
    a: "מבחינת החוק אין מוצר שנקרא פרגולה. התקנות מדברות על מצללה — מבנה מוצל שאינו אטום — וזה המונח שבו משתמשים בוועדה המקומית ובטפסים. פרגולה היא המילה שבה משתמשים בשוק. אותו מבנה, שני שמות; אם אתם מחפשים מידע רשמי, חפשו מצללה. אין באמור ייעוץ משפטי.",
  },
  {
    q: "מה נחשב מרווחים של 40% בין חלקי הקירוי?",
    a: "התנאי דורש שהקירוי יהיה מוצל ולא אטום: לפחות 40% משטח הקירוי נשארים פתוחים בין הלהבים או הקורות. פרגולה שמכוסה ביריעה אטומה, בפוליקרבונט רצוף או בגג קשיח לכל שטחה כבר אינה עונה על התנאי הזה, וייתכן שהיא טעונה היתר. אין באמור ייעוץ משפטי.",
  },
  {
    q: "צריך לדווח לרשות הרישוי גם כשיש פטור?",
    a: "כן. הפטור מהיתר אינו פטור מדיווח: גם כשהמצללה עומדת בכל התנאים, יש להגיש הודעה לרשות הרישוי המקומית תוך 45 יום מסיום הביצוע. זה השלב שהכי הרבה אנשים מפספסים, והוא מה שהופך בנייה פטורה לבנייה מתועדת. אין באמור ייעוץ משפטי.",
  },
  {
    q: "מה שונה בפרגולה במרפסת בבניין משותף?",
    a: "מעבר לדיני התכנון והבנייה נוספת שכבה קניינית: מרפסת בבניין משותף נוגעת ברכוש המשותף ובחזות הבניין, ולכן נדרשות הסכמות מול ועד הבית ובעלי הזכויות, ולעיתים גם התאמה לתקנון הבית המשותף. זו שאלה נפרדת מהפטור, והיא לא נפתרת מול הוועדה המקומית. אין באמור ייעוץ משפטי.",
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
    { name: "היתר בנייה לפרגולה", path: PATH },
  ]),
  faqNode(PATH, faqs),
]);

export default function PergolaPermitGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title={guide.title}
        subtitle="מה התקנות באמת דורשות, מה קורה אחרי הבנייה, ואיפה זה משתנה מעיר לעיר."
        crumbs={[
          { label: "בית", href: "/" },
          { label: "מדריכים", href: "/guides" },
          { label: "היתר בנייה לפרגולה" },
        ]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-500">
            עודכן: אוגוסט 2026 · הבסיס הרגולטורי: תקנות התכנון והבנייה (עבודות ותכנון הפטורים
            מהיתר), תשע״ד-2014
          </p>

          {/* The lead answer: self-contained, quotable, and the same text as the first FAQ
              entry — an extracted snippet must work with zero context around it. */}
          <p className="mt-6 text-lg leading-relaxed text-gray-800">
            בקצרה: רוב הפרגולות בישראל פטורות מהיתר בנייה, אבל הפטור מותנה בארבעה תנאים
            מצטברים — ואפילו כשהוא חל, עדיין חובה לדווח לרשות הרישוי תוך 45 יום מסיום
            הביצוע. פרגולה שאינה עומדת באחד התנאים היא בנייה טעונת היתר לכל דבר.
          </p>

          {faqs.map((f, i) => (
            <div key={f.q} className={i === 0 ? "mt-10" : "mt-8"}>
              <h2 className="font-heading text-xl font-bold text-primary">{f.q}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{f.a}</p>

              {/* Nuance goes AFTER the answer block, never inside it — an extractable answer
                  must not depend on the paragraph that follows. */}
              {i === 0 && (
                <ul className="mt-4 space-y-2 text-gray-700">
                  <li>
                    <strong className="text-primary">שטח.</strong> עד 50 מ״ר, או עד רבע מהשטח
                    הפנוי של המגרש — הגדול מבין השניים. בחצר גדולה זה יכול להיות יותר מ-50 מ״ר,
                    ובמגרש קטן פחות.
                  </li>
                  <li>
                    <strong className="text-primary">חומרים קלים.</strong> התקנות מדברות על
                    בנייה קלה. אלומיניום ועץ נכנסים לקטגוריה הזו; קירוי בטון או בנייה מסיבית
                    אינם.
                  </li>
                  <li>
                    <strong className="text-primary">40% מרווחים.</strong> הקירוי חייב להישאר
                    מוצל ולא אטום — ראו את ההסבר המלא בהמשך.
                  </li>
                  <li>
                    <strong className="text-primary">הנחיות מרחביות.</strong> לכל ועדה מקומית
                    יש הנחיות משלה, והן גוברות. זה התנאי היחיד שמשתנה מעיר לעיר.
                  </li>
                </ul>
              )}

              {i === 2 && (
                <p className="mt-3 leading-relaxed text-gray-700">
                  זו הסיבה שפרגולה חשמלית עם להבים מתכווננים היא מקרה שדורש תשומת לב: כשהלהבים
                  פתוחים היא עומדת בתנאי, וכשהם סגורים הקירוי אטום. בררו את הנקודה הזו מול
                  הוועדה המקומית לפני ההזמנה, לא אחריה.
                </p>
              )}

              {i === 4 && (
                <p className="mt-3 leading-relaxed text-gray-700">
                  אם אתם מתכננים לסגור את המרפסת ולא רק להצל עליה, מדובר בעבודה אחרת לגמרי —
                  ראו{" "}
                  <Link
                    href="/service/accordion-products"
                    className="text-secondary underline"
                  >
                    סגירת מרפסות ותריסי אקורדיון
                  </Link>
                  .
                </p>
              )}
            </div>
          ))}

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            איך בודקים מה ההנחיות בעיר שלי?
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            ההנחיות המרחביות מתפרסמות באתר הוועדה המקומית לתכנון ובנייה של הרשות שבה נמצא
            הנכס, לרוב תחת &quot;הנחיות מרחביות&quot; או &quot;מידע להיתר&quot;. שתי שאלות
            שכדאי לשאול בטלפון לפני שמזמינים: האם יש הנחיה מקומית שמצמצמת את שטח המצללה
            הפטורה, והאם יש דרישה לחומר או לגוון מסוים בחזית. שתיהן משפיעות על התכנון, ושתיהן
            זולות לברר מראש ויקרות לגלות אחרי ההתקנה.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-primary">
            מה קורה אם בונים בלי היתר וללא פטור?
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            בנייה שאינה נכנסת לגדר הפטור ואין לה היתר היא עבירה לפי חוק התכנון והבנייה,
            וחשופה לאכיפה של הוועדה המקומית. מעבר לכך יש גם השלכה מעשית שקל לשכוח: בנייה לא
            מוסדרת עולה בבדיקות של עורך דין ושמאי בעסקת מכירה, והיא הופכת שם לבעיה של המוכר.
            אין באמור ייעוץ משפטי.
          </p>

          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="font-heading text-lg font-bold text-primary">
              איפה אנחנו נכנסים לתמונה
            </h2>
            <p className="mt-2 leading-relaxed text-gray-700">
              אנחנו מתכננים את המצללה כך שתעמוד בתנאי הפטור מלכתחילה — מידות, חומרים ומרווחים
              — ומלווים אתכם מול הוועדה המקומית ובדיווח שאחרי הביצוע. אם התכנון שאתם רוצים
              חורג מהפטור, נגיד לכם את זה לפני ההזמנה ולא אחריה.
            </p>
            <p className="mt-3">
              <Link
                href="/service/pergolas"
                className="font-medium text-secondary underline"
              >
                לעמוד הפרגולות ←
              </Link>
            </p>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            המידע במדריך זה הוא הסבר כללי בלבד ואינו מהווה ייעוץ משפטי או תחליף לבדיקה פרטנית
            מול הוועדה המקומית לתכנון ובנייה.
          </p>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
