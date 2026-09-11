"use client";

import { useRef } from "react";
import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const BASE = 40;
const PEAK = 76;
/** How far from the pointer, in px, an icon still feels the swell. */
const REACH = 130;

const APPS = [
  { name: "Finder", background: "linear-gradient(160deg,#5ac8fa,#1b6ef3)" },
  { name: "Mail", background: "linear-gradient(160deg,#63b3ff,#2557ff)" },
  { name: "Notes", background: "linear-gradient(160deg,#ffe27a,#ffbf00)" },
  { name: "Photos", background: "conic-gradient(from 90deg,#ff6b6b,#ffd166,#06d6a0,#4cc9f0,#c77dff,#ff6b6b)" },
  { name: "Music", background: "linear-gradient(160deg,#ff5f6d,#ff2d55)" },
  { name: "Messages", background: "linear-gradient(160deg,#5ef07f,#22c55e)" },
  { name: "Settings", background: "linear-gradient(160deg,#9a9aa3,#5b5b66)" },
];

function DockIcon({ app, pointerX }: { app: (typeof APPS)[number]; pointerX: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);
  const hop = useMotionValue(0);
  const distance = useTransform(pointerX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? x - (rect.left + rect.width / 2) : Infinity;
  });
  const size = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE]);
  const smooth = useSpring(size, { mass: 0.1, stiffness: 170, damping: 12 });

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={app.name}
      onClick={() => animate(hop, [0, -18, 0], { duration: 0.55, ease: "easeInOut" })}
      style={{ width: smooth, height: smooth, y: hop, background: app.background }}
      className="shrink-0 rounded-[22%] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.18)]"
    />
  );
}

export default function Dock({ demo }: CraftProps) {
  /** Pointer x in viewport px; Infinity means "not over the dock". */
  const pointerX = useMotionValue(Infinity);
  const dock = useRef<HTMLDivElement>(null);

  useDemo(
    !!demo,
    () => {
      const rect = dock.current?.getBoundingClientRect();
      if (!rect) return;
      const sweep = animate(pointerX, [rect.left - 24, rect.right + 24], { duration: 1.7, ease: "easeInOut" });
      const done = window.setTimeout(() => pointerX.set(Infinity), 1750);
      return () => {
        sweep.stop();
        window.clearTimeout(done);
        pointerX.set(Infinity);
      };
    },
    { interval: 3400 },
  );

  return (
    <div
      className="flex items-end justify-center px-8 pb-5 pt-14"
      onPointerMove={(event) => pointerX.set(event.clientX)}
      onPointerLeave={() => pointerX.set(Infinity)}
    >
      <div
        ref={dock}
        className="flex h-14 items-end gap-2 rounded-2xl bg-white/60 px-3 pb-2 ring-1 ring-black/10 backdrop-blur dark:bg-white/10 dark:ring-white/15"
      >
        {APPS.map((app) => (
          <DockIcon key={app.name} app={app} pointerX={pointerX} />
        ))}
      </div>
    </div>
  );
}
