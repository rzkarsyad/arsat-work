"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/**
 * The index: tag filter, bento grid of live tiles, and the craft popup. The
 * popup keeps the URL in sync with the History API so every craft stays
 * linkable without leaving the page.
 */
export function Gallery({ initialSlug }: { initialSlug?: string }) {
  const [tag, setTag] = useState<Tag | null>(null);
  const [active, setActive] = useState<string | null>(initialSlug ?? null);
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
  const visible = tag ? crafts.filter((craft) => craft.tags.includes(tag)) : crafts;

  return (
    <>
      <div
        role="group"
        aria-label="Filter by tag"
        className="-mx-4 mt-4 flex gap-0.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <Chip active={tag === null} label="All" onClick={() => setTag(null)} />
        {tagCounts().map(({ tag: t }) => (
          <Chip key={t} active={tag === t} label={t} onClick={() => setTag(t)} />
        ))}
      </div>
      <div className="bento-wrap mt-4 sm:mt-5">
        <motion.div layout className="bento">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((craft, index) => (
              <CraftTile key={craft.slug} craft={craft} index={index} onOpen={open} />
            ))}
          </AnimatePresence>
        </motion.div>
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
