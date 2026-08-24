import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { guides } from "@/lib/guides";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/marketing/FinalCta";
import { webPageNode, breadcrumbNode, itemListNode, graphScript } from "@/lib/seo-graph";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/" },
  title: "מדריכים — פרגולות, היתרים וחומרים",
  description:
    "מדריכים מעשיים לפני שמזמינים: מתי פרגולה פטורה מהיתר בנייה, מה ההבדל בין אלומיניום לעץ, ומה כדאי לברר מול הוועדה המקומית מראש.",
};

const jsonLd = graphScript([
  webPageNode({
    path: "/guides/",
    name: "מדריכים",
    description: "מדריכים מעשיים לפני שמזמינים פרגולה או פתרון אלומיניום לחוץ.",
    type: "CollectionPage",
    hasBreadcrumb: true,
  }),
  breadcrumbNode("/guides/", [
    { name: "בית", path: "/" },
    { name: "מדריכים", path: "/guides/" },
  ]),
  itemListNode(
    "/guides/",
    guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}/` })),
  ),
]);

export default function GuidesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHeader
        title="מדריכים"
        subtitle="השאלות שמגיעות אלינו לפני ההזמנה — היתרים, חומרים והחלטות שקשה לשנות אחר כך."
        crumbs={[{ label: "בית", href: "/" }, { label: "מדריכים" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            רוב ההחלטות סביב פרגולה נסגרות לפני שמישהו מודד משהו: אם צריך היתר, מאיזה חומר,
            וכמה תחזוקה זה ידרוש בעוד עשור. המדריכים כאן עונים על השאלות האלה במלואן — גם
            כשהתשובה היא שהתכנון שרציתם אינו פטור מהיתר.
          </p>

          <ul className="mt-10 grid gap-4">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-colors hover:border-secondary"
                >
                  <h2 className="font-heading text-lg font-bold text-primary">{g.title}</h2>
                  <p className="mt-2 text-gray-700">{g.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                    למדריך המלא
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
