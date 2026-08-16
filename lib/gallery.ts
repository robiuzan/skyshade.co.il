/**
 * gallery.ts — where the project photos come from.
 *
 * The Media Studio catalog (manifest.images.gallery, written by ops/sync-media.ps1) is the source
 * of truth. The hardcoded lists in lib/content.ts are a LEGACY FALLBACK, used only until that
 * block exists — the same transition pattern the USA fleet uses for manifest.images.hero. Once
 * this site has been on the media pipeline for a release or two, the fallback and the `src`
 * lists in content.ts can be deleted.
 *
 * Why the catalog is worth it: the object key (`skyshade/gallery/project-N.webp`) is stable, so
 * replacing a photo in the Studio changes the live site within ~5 minutes with NO rebuild. The
 * baked `/project-N.webp` files could only ever change via a redeploy.
 *
 * The homepage keeps its own 12-tile preview and its two SHORT tab labels ("פרגולות" / "חיפויים"),
 * which deliberately differ from the catalog's four canonical categories. So the preview reuses
 * the catalog's bytes and alt text but overrides `category` with the homepage label, and its
 * filter keeps behaving exactly as before.
 */
import type { GalleryItem, SiteImages } from "@ishub/site-kit/media";
import { manifest } from "@/lib/site-config";
import {
  galleryImages as legacyGalleryImages,
  galleryTabs as legacyGalleryTabs,
  homeGalleryImages as legacyHomeGalleryImages,
  homeGalleryTabs as legacyHomeGalleryTabs,
} from "@/lib/content";

type LegacyEntry = { src: string; category: string };

/**
 * ONLY the two fields SiteImage actually reads. FilterableGallery is a client component, so
 * whatever it receives is serialized into the page's RSC payload — passing the whole images
 * block would bake all 55 catalog entries (sha256, bytes, both alt strings) into the HTML of
 * every page that renders a gallery. The homepage needs 12 tiles, not the catalog.
 */
export const siteImages: SiteImages | null = manifest.images
  ? { mediaHost: manifest.images.mediaHost, defaultQuality: manifest.images.defaultQuality }
  : null;

const block = manifest.images?.gallery ?? null;
const catalog: readonly GalleryItem[] = block?.items ?? [];
const hasCatalog = catalog.length > 0;

/**
 * Nominal 4:3 box for the legacy path. The grid renders every tile into `aspect-[4/3]`, so these
 * match the painted box and keep the <img> free of CLS even though the real files vary in size.
 */
const LEGACY_W = 800;
const LEGACY_H = 600;

function fromLegacy(list: readonly LegacyEntry[]): GalleryItem[] {
  return list.map((it, i) => ({
    // The leading slash makes isLocalPath() true, so SiteImage serves the file verbatim with no
    // srcset — correct for a static export, which has no resizer to produce advertised widths.
    key: `/${it.src}`,
    alt: `Sky Shade aluminium project - ${it.category} ${i + 1}`,
    altHe: `פרויקט אלומיניום של סקיי שייד — ${it.category} ${i + 1}`,
    width: LEGACY_W,
    height: LEGACY_H,
    kind: "raster" as const,
    category: it.category,
  }));
}

/** The catalog entry for a legacy filename, e.g. "project-10.webp". */
function findInCatalog(src: string): GalleryItem | undefined {
  return catalog.find((it) => it.key.endsWith(`/${src}`));
}

/** Full gallery page: every catalog item, in catalog order. */
export const galleryItems: readonly GalleryItem[] = hasCatalog
  ? catalog
  : fromLegacy(legacyGalleryImages);

export const galleryCategories: readonly string[] =
  hasCatalog && block?.categories?.length ? block.categories : legacyGalleryTabs;

// Relabelled to the homepage's short tabs. If the catalog ever stops carrying one of these
// filenames the entry drops out, so fall back wholesale rather than render a thinned-out grid.
const mappedHome: GalleryItem[] = hasCatalog
  ? legacyHomeGalleryImages.flatMap((entry) => {
      const hit = findInCatalog(entry.src);
      return hit ? [{ ...hit, category: entry.category }] : [];
    })
  : [];

export const homeGalleryItems: readonly GalleryItem[] =
  mappedHome.length === legacyHomeGalleryImages.length
    ? mappedHome
    : fromLegacy(legacyHomeGalleryImages);

export const homeGalleryCategories: readonly string[] = legacyHomeGalleryTabs;
