"use client";

import { motion } from "motion/react";
import type { Craft } from "@/crafts/types";
import { spring } from "@/lib/motion";
import { CraftStage } from "./craft-stage";
import { Expand } from "./icons";

/** Tiles mount their craft immediately up to this index; the rest wait for scroll. */
const EAGER = 8;

/** Clicks that land on a control belong to the craft, not to the tile. */
const CONTROL =
  'button, a, input, select, textarea, [role="button"], [role="switch"], [role="tab"], [contenteditable="true"]';

type Props = {
  craft: Craft;
  index: number;
  /** Grid rows (1px each) this tile occupies once the column width is known. */
  rowSpan?: number;
  onOpen: (slug: string) => void;
};

/**
 * One masonry cell. The outer element is the grid item and animates its
 * position when the grid reflows; the inner element is the visible tile that
 * morphs into the popup, so the two must stay separate.
 */
export function CraftTile({ craft, index, rowSpan, onOpen }: Props) {
  return (
    <motion.div
      layout="position"
      transition={spring}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } }}
      style={{ "--tile-index": Math.min(index, 10), gridRowEnd: rowSpan ? `span ${rowSpan}` : undefined } as React.CSSProperties}
      className="tile-in cell"
    >
      <motion.div
        layoutId={`craft-${craft.slug}`}
        transition={spring}
        data-craft={craft.slug}
        style={{ aspectRatio: craft.ratio ?? 1, borderRadius: 20 }}
        className="group relative w-full overflow-hidden border border-line bg-stage transition-colors hover:border-line-strong"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest(CONTROL)) return;
          onOpen(craft.slug);
        }}
      >
        {craft.cover ? (
          craft.cover.type === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={craft.cover.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={craft.cover.alt ?? craft.title}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- covers are author-supplied local files of unknown dimensions
            <img className="absolute inset-0 h-full w-full object-cover" src={craft.cover.src} alt={craft.cover.alt ?? craft.title} />
          )
        ) : (
          <CraftStage slug={craft.slug} preview eager={index < EAGER} className="absolute inset-0" />
        )}
        <button
          type="button"
          aria-label={`Open ${craft.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpen(craft.slug);
          }}
          className="tile-affordance absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted opacity-0 shadow-sm ring-1 ring-line backdrop-blur transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Expand size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}
