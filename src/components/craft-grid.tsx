"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { crafts, tagCounts } from "@/crafts";
import type { Tag } from "@/crafts/types";
import { CraftCard } from "./craft-card";

function Chip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative rounded-full px-3 py-1.5 font-mono text-[12px] transition-colors ${
        active ? "text-canvas" : "text-muted hover:text-ink"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="active-chip"
          className="absolute inset-0 rounded-full bg-ink"
          transition={{ type: "spring", stiffness: 520, damping: 40 }}
        />
      ) : null}
      <span className="relative">
        {label} <span className={active ? "text-canvas/60" : "text-muted/60"}>{count}</span>
      </span>
    </button>
  );
}

export function CraftGrid() {
  const [active, setActive] = useState<Tag | null>(null);
  const visible = active ? crafts.filter((craft) => craft.tags.includes(active)) : crafts;
  const counts = tagCounts();

  return (
    <section aria-label="Crafts">
      <div role="group" aria-label="Filter by tag" className="-mx-1 flex flex-wrap gap-0.5">
        <Chip active={active === null} label="All" count={crafts.length} onClick={() => setActive(null)} />
        {counts.map(({ tag, count }) => (
          <Chip key={tag} active={active === tag} label={tag} count={count} onClick={() => setActive(tag)} />
        ))}
      </div>
      <motion.div layout className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((craft, index) => (
            <CraftCard key={craft.slug} craft={craft} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-muted">Nothing here yet.</p>
      ) : null}
    </section>
  );
}
