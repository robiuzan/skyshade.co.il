import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";
import { galleryImages } from "@/lib/content";

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
        subtitle="מבחר עבודות אלומיניום שביצענו — פרגולות, גדרות, שערים, חיפויים ומטבחי חוץ. כל פרויקט מתוכנן ומיוצר בהתאמה אישית."
        crumbs={[{ label: "בית", href: "/" }, { label: "גלריה" }]}
      />
      <Section tone="white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((src, i) => (
            <div
              key={src}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${src}`}
                alt={`פרויקט אלומיניום של סקיי שייד ${i + 1}`}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
