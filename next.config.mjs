/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shared hub package (@ishub/site-kit) ships raw TS; Next must transpile it.
  transpilePackages: ["@ishub/site-kit"],
  // Static HTML export. The LIVE site (skyshade.co.il = skyshade.pages.dev) is a Cloudflare
  // Pages project; response headers and redirects ship from public/_headers and
  // public/_redirects inside out/. NOTE: .github/workflows/deploy.yml publishes to GitHub
  // Pages, which nothing points at — connect the Pages project to this repo (Workers &
  // Pages → skyshade → Settings → Builds) or deploy with `wrangler pages deploy out`.
  output: "export",
  trailingSlash: true,
  images: {
    // No Next image-optimization server on static hosting.
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
