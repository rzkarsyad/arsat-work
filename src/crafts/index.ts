// Full crafts with their live components. Import this from client code.
import { components } from "./_registry";
import { entries } from "./catalog";
import type { Craft } from "./types";

export { entries, getEntry, getNeighbours, lastUpdated, tagCounts } from "./catalog";

export const crafts: Craft[] = entries.map((entry) => ({
  ...entry,
  component: components[entry.slug],
}));

export function getCraft(slug: string): Craft | undefined {
  return crafts.find((craft) => craft.slug === slug);
}
