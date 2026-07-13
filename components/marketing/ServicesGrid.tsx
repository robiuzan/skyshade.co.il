import Link from "next/link";
import { Blinds, ChevronLeft, Fence, Layers, LayoutGrid, Sun, Utensils } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { serviceCards, type IconName } from "@/lib/content";

const iconMap: Record<IconName, typeof Sun> = {
  Sun,
  Fence,
  LayoutGrid,
  Layers,
  Utensils,
  Blinds,
};

export function ServicesGrid() {
  return (
    <Section id="services" tone="muted">
      <SectionHeading
        eyebrow="מה אנחנו עושים"
        title="פתרונות אלומיניום לכל מרחב חוץ"
        subtitle="מפרגולות ומחסות ועד גדרות, דקים ומטבחי חוץ — עיצוב בהתאמה אישית, בחומרים מהמשובחים בשוק."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCards.map((card, i) => {
          const Icon = iconMap[card.icon];
          return (
            <Reveal key={card.slug} delay={(i % 3) * 0.05}>
              <Link
                href={`/service/${card.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-primary">
                  {card.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-accent-600">
                  {card.tagline}
                </p>
                <p className="mt-2 flex-1 text-sm text-gray-600">{card.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:gap-2">
                  למידע נוסף
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
