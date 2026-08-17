import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
  title: "מדיניות פרטיות",
  description:
    "מדיניות הפרטיות של אתר סקיי שייד: איזה מידע נאסף בטופס, בטלפון ובוואטסאפ, כיצד הוא משמש ואיך פונים אלינו בנושא.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="מדיניות פרטיות"
        crumbs={[{ label: "בית", href: "/" }, { label: "מדיניות פרטיות" }]}
      />
      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-4 text-gray-700">
          <p>
            אנו ב{siteConfig.name} מכבדים את פרטיותכם. עמוד זה מסביר איזה מידע אנו
            אוספים, כיצד אנו משתמשים בו ומהן זכויותיכם.{" "}
            <span className="text-gray-500">עודכן לאחרונה: אוגוסט 2026.</span>
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">
            איזה מידע אנו אוספים
          </h2>
          <p>
            כאשר אתם פונים אלינו דרך הטופס, הטלפון או הוואטסאפ, אנו אוספים את הפרטים
            שמסרתם — שם, טלפון ותוכן הפנייה — יחד עם העמוד שממנו נשלחה הפנייה ומקור
            ההגעה לאתר. מסירת המידע תלויה ברצונכם ואינה חובה על פי חוק, אך בלעדיה לא
            נוכל לחזור אליכם.
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">שימוש במידע</h2>
          <p>
            המידע משמש לחזרה אליכם ולמתן השירות שביקשתם. דיוור שיווקי (עדכונים והצעות)
            יישלח רק אם סימנתם הסכמה מפורשת לכך בטופס, וניתן לבטל את ההסכמה בכל עת
            בהודעה אלינו.
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">
            שירותי צד שלישי
          </h2>
          <p>
            הטופס באתר נשלח באמצעות שירות Web3Forms, המעביר את פנייתכם לתיבת הדוא״ל
            שלנו. האתר משתמש ב-Google Tag Manager וב-Google Analytics לניתוח סטטיסטי של
            השימוש באתר (עמודים נצפים ומקורות הגעה); פרטי הפנייה שלכם — שם וטלפון —
            אינם מועברים לשירותי הניתוח. תמונות האתר מוגשות משרת תמונות ייעודי
            (imgquarry.com).
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">
            שמירת מידע וזכויותיכם
          </h2>
          <p>
            פרטי פנייה נשמרים כל עוד הם דרושים לטיפול בפנייה ולמתן השירות. על פי חוק
            הגנת הפרטיות, התשמ״א-1981, זכותכם לעיין במידע שנאסף עליכם ולבקש לתקן או
            למחוק אותו — פנו אלינו באחד מפרטי הקשר שלהלן.
          </p>
          <h2 className="font-heading text-lg font-bold text-primary">יצירת קשר</h2>
          <p>
            בכל שאלה בנושא פרטיות ניתן לפנות אלינו בטלפון{" "}
            <span dir="ltr">{siteConfig.phone}</span> או בדוא״ל{" "}
            <span dir="ltr">{siteConfig.email}</span>.
          </p>
        </div>
      </Section>
    </>
  );
}
