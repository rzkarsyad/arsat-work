import type { StaticImageData } from "next/image";

export type AppMeta = {
  name: string;
  /** One line under the name. */
  tagline: string;
  /** Where it runs, shown next to the name: "macOS", "iOS", "Web". */
  platform: string;
  /** The product's own site. The whole card links there. */
  url: string;
  /** ISO date, e.g. "2026-09-12". Newest first on the page. */
  date: string;
  /** Imported next to meta.ts. Any size; the card crops it to 3:2. */
  cover: StaticImageData;
  /** Square app icon, imported next to meta.ts. */
  icon: StaticImageData;
  /** Optional pill on the cover, e.g. "Coming soon". */
  status?: string;
};

export type AppEntry = AppMeta & { slug: string };

export function defineApp(meta: AppMeta): AppMeta {
  return meta;
}
