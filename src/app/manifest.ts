import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export const dynamic = "force-static"; // ponytail: нужно для output: export

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — цифровые продукты для бизнеса`,
    short_name: site.shortName,
    description: site.description,
    start_url: `${BASE}/`,
    display: "standalone",
    background_color: "#121212",
    theme_color: "#121212",
    lang: "ru",
    icons: [{ src: `${BASE}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
