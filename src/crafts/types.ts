import type { ComponentType } from "react";

/**
 * The fixed set of tags. Keep it short — tags are filters, not folksonomy.
 * Add a new one here and it will show up as a chip once a craft uses it.
 */
export const TAGS = [
  "interaction",
  "motion",
  "button",
  "navigation",
  "typography",
  "form",
  "feedback",
  "apple",
  "layout",
  "experiment",
] as const;

export type Tag = (typeof TAGS)[number];

export type CraftMedia = {
  type: "image" | "video";
  /** Path under /public, e.g. "/crafts/my-craft/cover.mp4". */
  src: string;
  alt?: string;
};

export type CraftMeta = {
  /** Shown on the card and used as the page title. */
  title: string;
  /** One line. Shown under the title and in the RSS feed. */
  description: string;
  /** ISO date, e.g. "2026-09-10". Drives ordering and numbering. */
  date: string;
  tags: Tag[];
  /** Optional longer write-up. Blank lines separate paragraphs. */
  notes?: string;
  /** Optional link to a reference: a tweet, a Figma file, an article. */
  source?: string;
  /** Show a static image/video on the index instead of the live component. */
  cover?: CraftMedia;
  /**
   * Proportion of the tile on the index, as width ÷ height. Columns are all the
   * same width, so this sets the tile's height: 0.8 is portrait, 1 square,
   * 1.5 landscape. Defaults to 1.
   */
  ratio?: number;
};

export type CraftProps = {
  /** True inside an index tile, false in the popup. */
  preview?: boolean;
  /**
   * True while the craft should demonstrate itself: it is on screen, nobody is
   * hovering it or has just touched it, and the visitor has not asked for
   * reduced motion. Pair it with `useDemo` from `@/lib/demo`.
   */
  demo?: boolean;
};

export type CraftComponent = ComponentType<CraftProps>;

export type CraftEntry = Omit<CraftMeta, "ratio"> & {
  slug: string;
  /** Stable sequential number, assigned by date ascending. */
  number: number;
  /** Resolved tile proportion (defaults to 1). */
  ratio: number;
};

export type Craft = CraftEntry & {
  component: CraftComponent;
};

/** Identity helper that gives `meta.ts` files type checking and autocomplete. */
export function defineCraft(meta: CraftMeta): CraftMeta {
  return meta;
}
