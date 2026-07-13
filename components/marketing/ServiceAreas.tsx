import Link from "next/link";
import { MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { locations } from "@/lib/site-config";

export function ServiceAreas() {
  return (
    <Section id="areas" tone="muted">
      <SectionHeading
        eyebrow="אזורי שירות"
        title="שירות בכל הארץ"
        subtitle="מהצפון ועד הדרום — אנחנו מגיעים אליכם לייעוץ ומדידה. בחרו את העיר שלכם."
      />

      <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
        {locations.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/locations/${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-secondary hover:text-secondary"
            >
              <MapPin className="h-3.5 w-3.5 text-secondary" aria-hidden />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/locations" className="font-semibold text-secondary hover:underline">
          לכל אזורי השירות
        </Link>
      </p>
    </Section>
  );
}
