import type { StaticImageData } from "next/image";

/** Tags for design shots. Add here to make a new one available. */
export const DESIGN_TAGS = ["mobile", "web", "dashboard", "concept", "brand"] as const;

export type DesignTag = (typeof DESIGN_TAGS)[number];

export type DesignMeta = {
  title: string;
  description: string;
  /** ISO date, e.g. "2026-09-11". Drives ordering. */
  date: string;
  tags: DesignTag[];
  /** The shot itself, imported next to meta.ts so its size is known at build time. */
  image: StaticImageData;
  /** Optional longer write-up. Blank lines separate paragraphs. */
  notes?: string;
  /** Optional link: a Figma file, a live site, a case study. */
  source?: string;
};

export type DesignEntry = DesignMeta & {
  slug: string;
  number: number;
  /** width ÷ height of the shot; the index tile takes this proportion. */
  ratio: number;
};

export function defineDesign(meta: DesignMeta): DesignMeta {
  return meta;
}
