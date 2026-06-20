import type { NextConfig } from "next";

// ponytail: hardcoded for GitHub Pages project site
// (scorpochabro-solo.github.io/s2k_demo). For Vercel/root hosting,
// drop basePath + output:"export" and restore the /api/lead route.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/s2k_demo",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
