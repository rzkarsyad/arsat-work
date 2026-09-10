import type { MetadataRoute } from "next";
import { entries, lastUpdated } from "@/crafts/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: lastUpdated, changeFrequency: "weekly", priority: 1 },
    ...entries.map((craft) => ({
      url: `${site.url}/${craft.slug}`,
      lastModified: craft.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
