import type { Metadata } from "next";
import { ogImageMeta } from "@ishub/site-kit";
import { Heebo } from "next/font/google";
import { siteConfig, manifest } from "@/lib/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { gtmHeadSnippet, gtmNoScriptSrc } from "@ishub/site-kit/analytics";
import "./globals.css";

// Heebo — clean, legible Hebrew — for both body and headings (brand font).
// Exposed as a CSS variable consumed by app/globals.css (font-sans / font-heading).
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    // ≤60 chars, keyword-first: the old 63-char default truncated in the SERP.
    default: "פרגולות אלומיניום ופתרונות חוץ בהתאמה אישית | סקיי שייד",
    template: `%s | ${siteConfig.name}`,
  },
  // Curated here rather than manifest.shortPitch: the pitch runs 163 chars and Google
  // truncates at ~160. site.config.json is hub-synced, so the trim cannot live there.
  description:
    "מומחים לפרגולות, גדרות ושערי אלומיניום, פתרונות הצללה וגידור בהתאמה אישית. אלומיניום ברמת גימור גבוהה, שירות בכל הארץ מאז 2009.",
  alternates: { canonical: "/" },
  openGraph: {
      images: ogImageMeta(manifest.images),
    type: "website",
    locale: "he_IL",
    siteName: siteConfig.name,
    title: "סקיי שייד — פרגולות ופתרונות אלומיניום פרימיום",
    description: manifest.shortPitch ?? siteConfig.tagline,
  },
};

/** Shared GTM loader — inert (renders nothing) until analytics.gtmId is set in the manifest. */
const gtmHead = gtmHeadSnippet(manifest.analytics?.gtmId);
const gtmNoScript = gtmNoScriptSrc(manifest.analytics?.gtmId);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        {manifest.images?.mediaHost && (
          <link rel="preconnect" href={`https://${manifest.images.mediaHost}`} crossOrigin="" />
        )}
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {gtmNoScript && (
          <noscript>
            <iframe
              src={gtmNoScript}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        {gtmHead && <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmHead }} />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Spacer so the fixed mobile CTA bar never overlaps footer content. */}
        <div className="h-16 lg:hidden" aria-hidden />
        <MobileCtaBar />
      </body>
    </html>
  );
}
