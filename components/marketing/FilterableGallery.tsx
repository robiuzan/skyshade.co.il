"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SiteImage } from "@ishub/site-kit/components";
import { srcFor, type GalleryItem, type SiteImages } from "@ishub/site-kit/media";
import { cn } from "@/lib/utils";

interface FilterableGalleryProps {
  /** Catalog items (lib/gallery.ts) — alt text and dimensions travel with each image. */
  images: readonly GalleryItem[];
  /** The site's images block, for mediaHost. null => items are served from public/. */
  siteImages: SiteImages | null;
  tabs: readonly string[];
  /** Extra label for the "show everything" tab (first, selected by default). */
  allLabel?: string;
  /** Optional CTA under the grid (e.g. link to the full gallery page). */
  moreHref?: string;
  moreLabel?: string;
}

/** Hebrew first — this site is RTL, so altHe is the string that actually ships. */
const altOf = (it: GalleryItem) => it.altHe || it.alt || "";

/** Category-tabbed project gallery with a click-to-enlarge lightbox. */
export function FilterableGallery({
  images,
  siteImages,
  tabs,
  allLabel = "הכל",
  moreHref,
  moreLabel,
}: FilterableGalleryProps) {
  const [active, setActive] = useState<string>(allLabel);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered =
    active === allLabel ? images : images.filter((it) => it.category === active);

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const allTabs = [allLabel, ...tabs];

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap justify-center gap-2.5" role="tablist">
        {allTabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-primary hover:border-primary/40 hover:bg-primary/5",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setLightbox(item)}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={`הגדלת תמונת פרויקט — ${item.category}`}
          >
            <SiteImage
              images={siteImages}
              image={item}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {moreHref && moreLabel && (
        <div className="mt-10 text-center">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {moreLabel}
          </Link>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="סגירה"
            onClick={() => setLightbox(null)}
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
          {/* A plain <img> rather than SiteImage: this box is viewport-sized, so the intrinsic
              width/height SiteImage always emits would fight the max-h/max-w constraints. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={srcFor(siteImages, lightbox, { fit: "contain" })}
            alt={altOf(lightbox)}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
