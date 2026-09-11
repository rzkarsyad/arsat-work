import type { MetadataRoute } from "next";
import { entries, lastUpdated } from "@/crafts/catalog";
import { designs, designsUpdated } from "@/designs/catalog";
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
    { url: `${site.url}/design`, lastModified: designsUpdated, changeFrequency: "weekly" as const, priority: 0.9 },
    ...designs.map((design) => ({
      url: `${site.url}/design/${design.slug}`,
      lastModified: design.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/about`, changeFrequency: "yearly" as const, priority: 0.5 },
  ];
}
