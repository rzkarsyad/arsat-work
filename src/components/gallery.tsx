"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@/lib/motion";
import { GalleryModal, type GalleryItem } from "./gallery-modal";
import { GalleryTile } from "./gallery-tile";

const titleCase = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "text-canvas"
          : "bg-black/[0.045] text-muted hover:bg-black/[0.075] hover:text-ink dark:bg-white/[0.07] dark:hover:bg-white/[0.11]"
      }`}
    >
      {active ? <motion.span layoutId="active-chip" className="absolute inset-0 rounded-full bg-ink" transition={spring} /> : null}
      <span className="relative">{titleCase(label)}</span>
    </button>
  );
}

type Metrics = { columnWidth: number; gap: number };

/**
 * Reads the masonry grid's column width and gap, and keeps them current as
 * the viewport changes. Tiles turn these into a row span for their ratio.
 */
function useGridMetrics(grid: React.RefObject<HTMLDivElement | null>): Metrics | null {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(el);
      const cols = parseInt(style.getPropertyValue("--cols"), 10) || 1;
      const gap = parseFloat(style.getPropertyValue("--gap")) || 0;
      const columnWidth = (el.clientWidth - (cols - 1) * gap) / cols;
      setMetrics((current) =>
        current && current.columnWidth === columnWidth && current.gap === gap ? current : { columnWidth, gap },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [grid]);
  return metrics;
}

export type GalleryProps<T extends GalleryItem> = {
  /** Newest first. */
  items: T[];
  /** Tags to offer as filters, in order. */
  tags: readonly string[];
  initialSlug?: string;
  /** URL prefix of item pages: "" for crafts, "/design" for designs. */
  basePath?: string;
  renderTile: (item: T, index: number) => React.ReactNode;
  renderStage: (item: T, runKey: number) => React.ReactNode;
  renderMeta?: (item: T) => React.ReactNode;
  /** Give the popup's media area the item's own proportion, edge to edge. */
  stageRatio?: (item: T) => number | undefined;
  resettable?: boolean;
};

/**
 * A section index: tag filter, masonry grid of tiles, and the popup. The
 * popup keeps the URL in sync with the History API so every item stays
 * linkable without leaving the page.
 */
export function Gallery<T extends GalleryItem>({
  items,
  tags,
  initialSlug,
  basePath = "",
  renderTile,
  renderStage,
  renderMeta,
  stageRatio,
  resettable,
}: GalleryProps<T>) {
  const [tag, setTag] = useState<string | null>(null);
  /**
   * Per-item mount generation, bumped whenever an item re-enters the grid.
   * It is part of the tile's React key, so a tile that is still fading out
   * when its item is filtered back in keeps leaving while a fresh tile
   * mounts in the new layout — instead of the old one being revived and
   * sliding in from wherever it used to sit.
   */
  const [generation, setGeneration] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(initialSlug ?? null);
  /** Which way the popup's content slides on the next navigation. */
  const [direction, setDirection] = useState<1 | -1>(1);
  /**
   * Bumped on every open, never on navigation. It keys the popup, so moving
   * between items slides content inside one panel, while opening again
   * right after closing mounts a fresh popup that morphs out of its own tile
   * instead of reviving the one still on its way out.
   */
  const [session, setSession] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const metrics = useGridMetrics(grid);
  /** Whether the open popup pushed a history entry, so closing can pop it. */
  const pushed = useRef(false);

  const getItem = useCallback((slug: string) => items.find((item) => item.slug === slug), [items]);
  const indexUrl = basePath || "/";
  const itemUrl = (slug: string) => `${basePath}/${slug}`;

  const open = useCallback(
    (slug: string) => {
      pushed.current = true;
      setSession((current) => current + 1);
      setActive(slug);
      window.history.pushState({ item: slug }, "", itemUrl(slug));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- itemUrl only depends on basePath
    [basePath],
  );

  function navigate(slug: string, dir: 1 | -1) {
    setDirection(dir);
    setActive(slug);
    window.history.replaceState({ item: slug }, "", itemUrl(slug));
  }

  const close = useCallback(() => {
    setActive(null);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", indexUrl);
    }
  }, [indexUrl]);

  useEffect(() => {
    function onPopState() {
      const path = window.location.pathname.replace(/\/+$/, "");
      const slug = path.startsWith(basePath) ? path.slice(basePath.length).replace(/^\/+/, "") : "";
      pushed.current = false;
      setActive(slug && getItem(slug) ? slug : null);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [basePath, getItem]);

  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  const entry = active ? getItem(active) : undefined;
  const activeIndex = active ? items.findIndex((item) => item.slug === active) : -1;
  /** The ends wrap, so the arrows never dead-end: past the newest comes the oldest. */
  const neighbours =
    activeIndex >= 0 && items.length > 1
      ? {
          newer: items[(activeIndex - 1 + items.length) % items.length],
          older: items[(activeIndex + 1) % items.length],
        }
      : {};
  const visibleFor = (filter: string | null) => (filter ? items.filter((item) => item.tags.includes(filter)) : items);
  const visible = visibleFor(tag);

  function selectTag(next: string | null) {
    if (next === tag) return;
    const staying = new Set(visible.map((item) => item.slug));
    const entering = visibleFor(next).filter((item) => !staying.has(item.slug));
    if (entering.length) {
      setGeneration((current) => {
        const bumped = { ...current };
        for (const item of entering) bumped[item.slug] = (bumped[item.slug] ?? 0) + 1;
        return bumped;
      });
    }
    setTag(next);
  }

  return (
    <>
      <div
        role="group"
        aria-label="Filter by tag"
        className="-mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <Chip active={tag === null} label="All" onClick={() => selectTag(null)} />
        {tags.map((t) => (
          <Chip key={t} active={tag === t} label={t} onClick={() => selectTag(t)} />
        ))}
      </div>
      <div ref={grid} className="masonry mt-4 sm:mt-5" data-packed={metrics ? "" : undefined}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, index) => (
            <GalleryTile
              key={`${item.slug}:${generation[item.slug] ?? 0}`}
              slug={item.slug}
              title={item.title}
              ratio={item.ratio}
              index={index}
              rowSpan={metrics ? Math.ceil(metrics.columnWidth / item.ratio + metrics.gap) : undefined}
              onOpen={open}
            >
              {renderTile(item, index)}
            </GalleryTile>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {entry ? (
          <GalleryModal
            key={`popup-${session}`}
            item={entry}
            direction={direction}
            older={neighbours.older}
            newer={neighbours.newer}
            onClose={close}
            onNavigate={navigate}
            renderStage={renderStage}
            renderMeta={renderMeta}
            stageRatio={stageRatio}
            resettable={resettable}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
