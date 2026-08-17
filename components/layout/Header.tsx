"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { SiteImage } from "@ishub/site-kit/components";
import { manifest, siteConfig, telHref, services } from "@/lib/site-config";
import { navItems } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false); // mobile menu
  const [servicesOpen, setServicesOpen] = useState(false); // desktop services dropdown
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // trailingSlash: true means the live URL is "/about/" while navItems carry "/about".
  const path = pathname.replace(/\/$/, "") || "/";

  /** Exact page match — drives aria-current. */
  const isCurrent = (href: string) => path === href;
  /** Section match — drives the active style (e.g. /service/pergolas lights "השירותים שלנו"). */
  const isActive = (href: string) => {
    if (href === "/services") return path === "/services" || path.startsWith("/service/");
    return path === href || path.startsWith(`${href}/`);
  };

  // Close both menus on navigation; Link clicks keep the header mounted.
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Escape and outside-click close whichever menu is open.
  useEffect(() => {
    if (!open && !servicesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    }
    function onPointer(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setServicesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, servicesOpen]);

  const desktopLinkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive(href) ? "text-primary" : "text-gray-700",
    );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label={`${siteConfig.name} — דף הבית`}>
          {manifest.images?.logo ? (
            // `priority` because the logo is above the fold on every page and this site's hero is
            // a CSS gradient, so there is no other LCP candidate to hand it to.
            <SiteImage
              images={manifest.images}
              image={manifest.images.logo}
              fixed
              priority
              fit="contain"
              className="h-9 w-auto"
            />
          ) : (
            /* Legacy fallback: used only until ops/sync-media.ps1 writes manifest.images.logo,
               which takes precedence. Safe to delete once this site is on the media pipeline. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/skysgade-logo-1-1.png"
              alt={siteConfig.name}
              className="h-9 w-auto"
              width={288}
              height={45}
            />
          )}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) =>
              item.href === "/services" ? (
                /* Money pages in the primary nav: link to the hub + disclosure listing all six
                   services. Hover opens for mouse; the button serves keyboard and touch. */
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={desktopLinkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="פתיחת רשימת השירותים"
                      aria-expanded={servicesOpen}
                      aria-controls="desktop-services-menu"
                      onClick={() => setServicesOpen((v) => !v)}
                      className="rounded p-0.5 text-gray-500 hover:text-primary"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform motion-reduce:transition-none",
                          servicesOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>
                  {/* pt-2 (not mt-2) keeps the hover path to the menu unbroken. */}
                  <div
                    className={cn(
                      "absolute start-0 top-full z-50 pt-2",
                      servicesOpen ? "block" : "hidden",
                    )}
                  >
                    <ul
                      id="desktop-services-menu"
                      className="w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
                    >
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/service/${s.slug}`}
                            aria-current={isCurrent(`/service/${s.slug}`) ? "page" : undefined}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 hover:text-primary",
                              isCurrent(`/service/${s.slug}`) ? "text-primary" : "text-gray-700",
                            )}
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={desktopLinkClass(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href={telHref} data-cta="header-call" variant="accent" className="hidden sm:inline-flex">
            <Phone className="h-4 w-4" aria-hidden />
            <span dir="ltr">{siteConfig.phone}</span>
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary lg:hidden"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div id="mobile-menu" className={cn("border-t border-gray-100 lg:hidden", open ? "block" : "hidden")}>
        <Container className="py-4">
          <nav aria-label="ראשי נייד">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-2 py-2.5 text-base font-medium hover:bg-gray-50 hover:text-primary",
                      isActive(item.href) ? "text-primary" : "text-gray-700",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {/* The six services, always expanded — these are the money pages. */}
                  {item.href === "/services" && (
                    <ul className="mt-0.5 flex flex-col gap-0.5 ps-4">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/service/${s.slug}`}
                            aria-current={isCurrent(`/service/${s.slug}`) ? "page" : undefined}
                            className={cn(
                              "block rounded-lg px-2 py-2 text-sm hover:bg-gray-50 hover:text-primary",
                              isCurrent(`/service/${s.slug}`)
                                ? "font-medium text-primary"
                                : "text-gray-600",
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <Button href={telHref} data-cta="header-call" variant="accent" size="lg" className="mt-3 w-full">
            <Phone className="h-5 w-5" aria-hidden />
            חייגו עכשיו: <span dir="ltr">{siteConfig.phone}</span>
          </Button>
        </Container>
      </div>
    </header>
  );
}
