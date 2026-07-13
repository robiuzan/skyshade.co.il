import type { MetadataRoute } from "next";
import { siteConfig, services, locations } from "@/lib/site-config";

/**
 * Generates /sitemap.xml from the static routes + the service and location matrices.
 * Extend `staticPaths` when new top-level pages are added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

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
    url: path ? `${base}/${path}` : base,
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/service/${s.slug}`,
    lastModified: now,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((c) => ({
    url: `${base}/locations/${c.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...serviceEntries, ...locationEntries];
}
