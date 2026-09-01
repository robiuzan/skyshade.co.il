import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, telHref, services, locations, socialLinks } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";

export function Footer() {
  // Build-time year; the monthly rebuild cron in deploy.yml keeps it current.
  // Contrast note: white-on-primary opacities must stay ≥/85 body, ≥/80 small text —
  // /70 measured 4.12:1 and /60 measured 3.45:1, both under the WCAG AA 4.5:1 floor
  // that IS 5568 makes binding.
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white/90">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact */}
        <div>
          <p className="font-heading text-2xl font-extrabold text-white">
            {siteConfig.name}
          </p>
          <p className="mt-3 text-sm text-white/85">{siteConfig.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent-400" aria-hidden />
              <a href={telHref} data-cta="footer-call" className="hover:text-white" dir="ltr">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent-400" aria-hidden />
              <a
                href={`mailto:${siteConfig.email}`}
                data-cta="footer-email"
                className="hover:text-white"
                dir="ltr"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent-400" aria-hidden />
              <span>{siteConfig.serviceArea}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-accent-400" aria-hidden />
              <span>
                {siteConfig.hours.weekday}
                <br />
                {siteConfig.hours.friday}
              </span>
            </li>
          </ul>

          {/* Official profiles. Icon-only links, so each carries an aria-label — the icon is
              aria-hidden and would otherwise leave the link with no accessible name.
              Same list feeds schema.sameAs (lib/seo-graph.ts), so the two cannot drift. */}
          {socialLinks.length > 0 && (
            <nav aria-label="הפרופילים שלנו" className="mt-6">
              <ul className="flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon =
                    s.key === "facebook" ? Facebook : s.key === "instagram" ? Instagram : MapPin;
                  return (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener"
                        data-cta={`footer-social-${s.key}`}
                        aria-label={s.label}
                        title={s.label}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>

        {/* Services */}
        <nav aria-label="שירותים">
          <p className="font-semibold text-white">השירותים שלנו</p>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/service/${s.slug}`} className="text-white/85 hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Areas */}
        <nav aria-label="אזורי שירות">
          <p className="font-semibold text-white">אזורי שירות</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {/* All cities — a subset here starves the rest of sitewide internal links. */}
            {locations.map((c) => (
              <li key={c.slug}>
                <Link href={`/locations/${c.slug}`} className="text-white/85 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick links + legal */}
        <nav aria-label="קישורים">
          <p className="font-semibold text-white">קישורים</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-white/85 hover:text-white">
                אודות
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-white/85 hover:text-white">
                גלריה
              </Link>
            </li>
            <li>
              <Link href="/locations" className="text-white/85 hover:text-white">
                אזורי שירות
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white/85 hover:text-white">
                צור קשר
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/85 hover:text-white">
                מדיניות פרטיות
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="text-white/85 hover:text-white">
                הצהרת נגישות
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/85 hover:text-white">
                תקנון
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/80 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. כל הזכויות שמורות.
          </p>
          <p>פרגולות ופתרונות אלומיניום פרימיום · שירות בכל הארץ</p>
        </Container>
      </div>
    </footer>
  );
}
