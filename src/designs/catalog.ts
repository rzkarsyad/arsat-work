// Server-safe catalogue of design shots.
import { metas } from "./_metas";
import { DESIGN_TAGS, type DesignEntry, type DesignTag } from "./types";

const byDateAsc = [...metas].sort((a, b) =>
  a.meta.date === b.meta.date ? a.slug.localeCompare(b.slug) : a.meta.date.localeCompare(b.meta.date),
);

/** Every design shot, newest first. */
export const designs: DesignEntry[] = byDateAsc
  .map((item, index) => ({
    ...item.meta,
    slug: item.slug,
    number: index + 1,
    ratio: item.meta.image.width / item.meta.image.height,
  }))
  .reverse();

export const designsUpdated: string | undefined = designs[0]?.date;

export function getDesign(slug: string): DesignEntry | undefined {
  return designs.find((design) => design.slug === slug);
}

export function getDesignNeighbours(slug: string): { older?: DesignEntry; newer?: DesignEntry } {
  const index = designs.findIndex((design) => design.slug === slug);
  if (index === -1) return {};
  return { newer: designs[index - 1], older: designs[index + 1] };
}

export function designTagCounts(): { tag: DesignTag; count: number }[] {
  return DESIGN_TAGS.map((tag) => ({
    tag,
    count: designs.filter((design) => design.tags.includes(tag)).length,
  })).filter(({ count }) => count > 0);
}
