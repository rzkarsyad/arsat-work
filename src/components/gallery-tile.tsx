"use client";

import { motion, useIsPresent } from "motion/react";
import { spring } from "@/lib/motion";
import { Expand } from "./icons";

/** Clicks that land on a control belong to the content, not to the tile. */
const CONTROL =
  'button, a, input, select, textarea, [role="button"], [role="switch"], [role="tab"], [contenteditable="true"]';

type Props = {
  slug: string;
  title: string;
  /** width ÷ height of the tile. */
  ratio: number;
  index: number;
  /** Grid rows (1px each) this tile occupies once the column width is known. */
  rowSpan?: number;
  onOpen: (slug: string) => void;
  children: React.ReactNode;
  /**
   * AnimatePresence's popLayout mode hands the exiting child a ref and uses
   * it to lift the element out of the grid flow for its exit animation. It
   * must reach the outer cell, or exiting tiles keep their grid slots until
   * they unmount and the grid re-packs late.
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * One masonry cell. The outer element is the grid item and animates its
 * position when the grid reflows; the inner element is the visible tile that
 * morphs into the popup, so the two must stay separate.
 */
export function GalleryTile({ slug, title, ratio, index, rowSpan, onOpen, children, ref }: Props) {
  /**
   * Once a tile is exiting, popLayout moves it to absolute positioning in
   * place. Layout animation is switched off so Motion does not run the settle
   * spring on an invisible element (which delays removal), and pointer events
   * are dropped so it cannot swallow a click meant for the tile beneath.
   */
  const present = useIsPresent();
  return (
    <motion.div
      ref={ref}
      layout={present ? "position" : false}
      transition={spring}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } }}
      style={{ "--tile-index": Math.min(index, 10), gridRowEnd: rowSpan ? `span ${rowSpan}` : undefined } as React.CSSProperties}
      className={`tile-in cell ${present ? "" : "pointer-events-none"}`}
    >
      <motion.div
        layoutId={present ? `tile-${slug}` : undefined}
        transition={spring}
        data-tile={slug}
        style={{ aspectRatio: ratio, borderRadius: 20 }}
        className="group relative w-full overflow-hidden border border-line bg-stage transition-colors hover:border-line-strong"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest(CONTROL)) return;
          onOpen(slug);
        }}
      >
        {children}
        <button
          type="button"
          aria-label={`Open ${title}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpen(slug);
          }}
          className="tile-affordance absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted opacity-0 shadow-sm ring-1 ring-line backdrop-blur transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Expand size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}
