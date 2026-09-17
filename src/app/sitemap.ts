import type { MetadataRoute } from "next";
import { entries, lastUpdated } from "@/crafts/catalog";
import { appsUpdated } from "@/apps/catalog";
import { designs, designsUpdated } from "@/designs/catalog";
import { site } from "@/lib/site";

/** The newest of some ISO dates, skipping the ones that are not there. They sort lexically. */
function newest(...dates: (string | undefined)[]): string | undefined {
  return dates.filter((date): date is string => Boolean(date)).sort().at(-1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // The index shows both the craft grid and the written headline, so either moving counts.
    { url: site.url, lastModified: newest(lastUpdated, site.pagesUpdated), changeFrequency: "weekly", priority: 1 },
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
    { url: `${site.url}/apps`, lastModified: appsUpdated, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${site.url}/about`, lastModified: site.pagesUpdated, changeFrequency: "monthly" as const, priority: 0.5 },
  ];
}
