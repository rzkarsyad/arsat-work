// Server-safe catalogue: metadata only, no client components.
import { metas } from "./_metas";
import { TAGS, type CraftEntry, type Tag } from "./types";

const byDateAsc = [...metas].sort((a, b) =>
  a.meta.date === b.meta.date
    ? a.slug.localeCompare(b.slug)
    : a.meta.date.localeCompare(b.meta.date),
);

/** Every craft, newest first, with stable sequential numbers. */
export const entries: CraftEntry[] = byDateAsc
  .map((item, index) => ({ ...item.meta, slug: item.slug, number: index + 1, ratio: item.meta.ratio ?? 1 }))
  .reverse();

export const lastUpdated: string | undefined = entries[0]?.date;

export function getEntry(slug: string): CraftEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

/** `older` has a lower number, `newer` a higher one. */
export function getNeighbours(slug: string): { older?: CraftEntry; newer?: CraftEntry } {
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return {};
  return { newer: entries[index - 1], older: entries[index + 1] };
}

/** Tags in canonical order with usage counts. Unused tags are omitted. */
export function tagCounts(): { tag: Tag; count: number }[] {
  return TAGS.map((tag) => ({
    tag,
    count: entries.filter((entry) => entry.tags.includes(tag)).length,
  })).filter(({ count }) => count > 0);
}
