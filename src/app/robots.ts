import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export const dynamic = "force-static"; // ponytail: нужно для output: export

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
