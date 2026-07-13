import type { Metadata } from "next";
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
    default: "סקיי שייד — פרגולות ופתרונות אלומיניום פרימיום | שירות בכל הארץ",
    template: `%s | ${siteConfig.name}`,
  },
  description: manifest.shortPitch ?? siteConfig.tagline,
  alternates: { canonical: "/" },
  openGraph: {
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
