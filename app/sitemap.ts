import type { MetadataRoute } from "next";
import { siteConfig, services, locations } from "@/lib/site-config";

/**
 * Generates /sitemap.xml from the static routes + the service and location matrices.
 * Extend `staticPaths` when new top-level pages are added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

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
    "about",
    "gallery",
    "contact",
    "privacy",
    "accessibility",
    "terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: url(path),
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`service/${s.slug}`),
    lastModified: now,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: url(`locations/${c.slug}`),
    lastModified: now,
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries];
}
