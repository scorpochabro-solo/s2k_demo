import type { MetadataRoute } from "next";
import { site, allCases, landings } from "@/lib/content";

export const dynamic = "force-static"; // ponytail: нужно для output: export

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = ["/", "/work", "/privacy"].map((p) => ({
    url: `${base}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1 : 0.6,
  }));

  const caseRoutes = allCases.map((c) => ({
    url: `${base}/work/${c.id}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const landingRoutes = landings.map((l) => ({
    url: `${base}/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...landingRoutes, ...caseRoutes];
}
