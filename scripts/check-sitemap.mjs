/**
 * check-sitemap.mjs — postbuild guard. Fails the build when the exported pages in out/
 * and the entries in out/sitemap.xml drift apart, so a new route can never be silently
 * orphaned from the sitemap (app/sitemap.ts hand-lists top-level paths) and the sitemap
 * can never advertise a page that no longer exports.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";

/** Pages that are exported but deliberately kept out of the sitemap. */
const NOT_IN_SITEMAP = new Set([
  "/404/", // noindex error page
]);

const xml = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const sitemapPaths = new Set(
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
);

const exportedPaths = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (entry !== "_next") walk(p);
    } else if (entry === "index.html") {
      const rel = relative(OUT, dir).split(sep).join("/");
      exportedPaths.push(rel === "" ? "/" : `/${rel}/`);
    }
  }
})(OUT);

const missing = exportedPaths.filter(
  (u) => !NOT_IN_SITEMAP.has(u) && !sitemapPaths.has(u),
);
const stale = [...sitemapPaths].filter((u) => !exportedPaths.includes(u));

if (missing.length || stale.length) {
  console.error("✖ sitemap check FAILED");
  for (const u of missing) console.error(`  exported but missing from sitemap: ${u}`);
  for (const u of stale) console.error(`  in sitemap but not exported:        ${u}`);
  console.error("  (fix app/sitemap.ts, or add a deliberate exclusion in scripts/check-sitemap.mjs)");
  process.exit(1);
}
console.log(
  `✓ sitemap check ok — ${sitemapPaths.size} sitemap entries match ${exportedPaths.length} exported pages (${NOT_IN_SITEMAP.size} deliberate exclusions)`,
);
