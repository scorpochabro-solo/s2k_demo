import type { NextConfig } from "next";

// ponytail: hardcoded for GitHub Pages project site
// (scorpochabro-solo.github.io/s2k_demo). For Vercel/root hosting,
// drop basePath + output:"export" and restore the /api/lead route.
const basePath = "/s2k_demo"; // "" для root-хостинга (Vercel)

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  // ponytail: unoptimized next/image НЕ префиксует basePath к public-файлам —
  // отдаём его в клиент для обычного <img src> у логотипов клиентов.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
