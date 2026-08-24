/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shared hub package (@ishub/site-kit) ships raw TS; Next must transpile it.
  transpilePackages: ["@ishub/site-kit"],
  // Static HTML export. The LIVE site (skyshade.co.il = skyshade.pages.dev) is the Cloudflare
  // Pages project "skyshade"; response headers and redirects ship from public/_headers and
  // public/_redirects inside out/. The project is direct-upload type and cannot be
  // Git-connected, so .github/workflows/deploy.yml IS the integration: it builds here and
  // pushes out/ with `wrangler pages deploy out --project-name=skyshade` on every push to main.
  output: "export",
  trailingSlash: true,
  images: {
    // No Next image-optimization server on static hosting.
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
