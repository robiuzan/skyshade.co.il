import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";
import { FilterableGallery } from "@/components/marketing/FilterableGallery";
import { galleryImages, galleryTabs } from "@/lib/content";

export const metadata: Metadata = {
  title: "גלריית פרויקטים",
  description:
    "גלריית פרויקטים של סקיי שייד — פרגולות, גדרות, שערים, דקים וחיפויי אלומיניום מהשטח. עיצוב בהתאמה אישית ברמת הגימור הגבוהה ביותר.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="גלריית פרויקטים"
        subtitle="מבחר עבודות אלומיניום שביצענו — פרגולות, גדרות, שערים, חיפויים ומטבחי חוץ. כל פרויקט מתוכנן ומיוצר בהתאמה אישית. סננו לפי קטגוריה ולחצו להגדלה."
        crumbs={[{ label: "בית", href: "/" }, { label: "גלריה" }]}
      />
      <Section tone="white">
        <FilterableGallery images={galleryImages} tabs={galleryTabs} />
      </Section>
      <FinalCta />
    </>
  );
}
