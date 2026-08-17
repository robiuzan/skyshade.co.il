/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shared hub package (@ishub/site-kit) ships raw TS; Next must transpile it.
  transpilePackages: ["@ishub/site-kit"],
  // Static HTML export — deployed to GitHub Pages by .github/workflows/deploy.yml and
  // fronted by Cloudflare. There is NO server config on the host: all redirects and
  // response headers live in Cloudflare Rules (the old cPanel/.htaccess era is over).
  output: "export",
  trailingSlash: true,
  images: {
    // No Next image-optimization server on static hosting.
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
