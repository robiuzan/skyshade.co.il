import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  title: "השירותים שלנו",
  description:
    "פתרונות אלומיניום פרימיום מסקיי שייד: פרגולות ומחסות, גדרות ושערים, חיפוי קירות, דקים, מטבחי חוץ ומוצרים אקורדיאוניים — בהתאמה אישית ובכל הארץ.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="השירותים שלנו"
        subtitle="מפרגולות אלומיניום ועד מטבחי חוץ — פתרונות מעוצבים בהתאמה אישית, בחומרים מהמשובחים בשוק ועם אחריות מלאה."
        crumbs={[{ label: "בית", href: "/" }, { label: "השירותים שלנו" }]}
      />
      <ServicesGrid />
      <FinalCta />
    </>
  );
}
