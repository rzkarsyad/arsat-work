"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { crafts, getEntry, getNeighbours, tagCounts } from "@/crafts";
import type { Tag } from "@/crafts/types";
import { spring } from "@/lib/motion";
import { CraftModal } from "./craft-modal";
import { CraftTile } from "./craft-tile";

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors ${
        active ? "text-canvas" : "text-muted hover:text-ink"
      }`}
    >
      {active ? <motion.span layoutId="active-chip" className="absolute inset-0 rounded-full bg-ink" transition={spring} /> : null}
      <span className="relative">{label}</span>
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

/**
 * The index: tag filter, masonry grid of live tiles, and the craft popup. The
 * popup keeps the URL in sync with the History API so every craft stays
 * linkable without leaving the page.
 */
export function Gallery({ initialSlug }: { initialSlug?: string }) {
  const [tag, setTag] = useState<Tag | null>(null);
  /**
   * Per-craft mount generation, bumped whenever a craft re-enters the grid.
   * It is part of the tile's React key, so a tile that is still fading out
   * when its craft is filtered back in keeps leaving while a fresh tile
   * mounts in the new layout — instead of the old one being revived and
   * sliding in from wherever it used to sit.
   */
  const [generation, setGeneration] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(initialSlug ?? null);
  const grid = useRef<HTMLDivElement>(null);
  const metrics = useGridMetrics(grid);
  /** Whether the open popup pushed a history entry, so closing can pop it. */
  const pushed = useRef(false);

  const open = useCallback((slug: string) => {
    pushed.current = true;
    setActive(slug);
    window.history.pushState({ craft: slug }, "", `/${slug}`);
  }, []);

  const navigate = useCallback((slug: string) => {
    setActive(slug);
    window.history.replaceState({ craft: slug }, "", `/${slug}`);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  useEffect(() => {
    function onPopState() {
      const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
      pushed.current = false;
      setActive(slug && getEntry(slug) ? slug : null);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  const entry = active ? getEntry(active) : undefined;
  const neighbours = active ? getNeighbours(active) : {};
  const visibleFor = (filter: Tag | null) => (filter ? crafts.filter((craft) => craft.tags.includes(filter)) : crafts);
  const visible = visibleFor(tag);

  function selectTag(next: Tag | null) {
    if (next === tag) return;
    const staying = new Set(visible.map((craft) => craft.slug));
    const entering = visibleFor(next).filter((craft) => !staying.has(craft.slug));
    if (entering.length) {
      setGeneration((current) => {
        const bumped = { ...current };
        for (const craft of entering) bumped[craft.slug] = (bumped[craft.slug] ?? 0) + 1;
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
        className="-mx-4 mt-4 flex gap-0.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <Chip active={tag === null} label="All" onClick={() => selectTag(null)} />
        {tagCounts().map(({ tag: t }) => (
          <Chip key={t} active={tag === t} label={t} onClick={() => selectTag(t)} />
        ))}
      </div>
      <div ref={grid} className="masonry mt-4 sm:mt-5" data-packed={metrics ? "" : undefined}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((craft, index) => (
            <CraftTile
              key={`${craft.slug}:${generation[craft.slug] ?? 0}`}
              craft={craft}
              index={index}
              rowSpan={metrics ? Math.ceil(metrics.columnWidth / (craft.ratio ?? 1) + metrics.gap) : undefined}
              onOpen={open}
            />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {entry ? (
          <CraftModal
            key={entry.slug}
            craft={entry}
            older={neighbours.older}
            newer={neighbours.newer}
            onClose={close}
            onNavigate={navigate}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
