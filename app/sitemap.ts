import type { MetadataRoute } from "next";
import { siteConfig, services, locations } from "@/lib/site-config";
import { guidePaths } from "@/lib/guides";

/**
 * Generates /sitemap.xml from the static routes + the service and location matrices.
 * Extend `staticPaths` when new top-level pages are added — forgetting is caught by
 * scripts/check-sitemap.mjs (postbuild), which fails the build on any drift between
 * the exported pages and this sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;

  /**
   * `trailingSlash: true` in next.config.mjs means the host serves `/about/` and
   * 308-redirects `/about`. A sitemap must list final destinations, so every URL
   * here ends with a slash — matching the per-page `alternates.canonical` values.
   */
  const url = (path: string) => (path ? `${base}/${path}/` : `${base}/`);

  const staticPaths = [
    "",
    "services",
    "locations",
    "guides",
    ...guidePaths,
    "about",
    "gallery",
    "contact",
    "privacy",
    "accessibility",
    "terms",
  ];

  // No lastModified: stamping the build time marked every URL "modified" on every deploy,
  // a freshness signal Google learns to distrust. Add real per-page dates only when the
  // content actually carries them.
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: url(path),
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`service/${s.slug}`),
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: url(`locations/${c.slug}`),
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries];
}
