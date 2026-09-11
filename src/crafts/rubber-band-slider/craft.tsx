"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const HEIGHT = 176;
const WIDTH = 60;
/** How much of an overdrag the track follows. */
const GIVE = 0.32;
const MAX_STRETCH = 26;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function RubberBandSlider({ demo }: CraftProps) {
  const value = useMotionValue(0.6);
  /** Px past the end: positive above the top, negative below the bottom. */
  const stretch = useMotionValue(0);
  const fill = useTransform(value, (v) => `${clamp(v, 0, 1) * 100}%`);
  const scaleY = useTransform(stretch, (s) => 1 + Math.abs(s) / 340);
  const y = useTransform(stretch, (s) => -s * 0.45);
  const origin = useTransform(stretch, (s) => (s >= 0 ? "50% 100%" : "50% 0%"));
  const frame = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(60);

  useMotionValueEvent(value, "change", (v) => setLevel(Math.round(clamp(v, 0, 1) * 100)));

  function settle() {
    animate(stretch, 0, { type: "spring", stiffness: 380, damping: 18 });
  }

  /** Reads the pointer against the untransformed frame, so a stretched track cannot feed back into itself. */
  function follow(clientY: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = 1 - (clientY - rect.top) / rect.height;
    value.set(clamp(raw, 0, 1));
    const over = raw > 1 ? raw - 1 : raw < 0 ? raw : 0;
    stretch.set(clamp(over * rect.height * GIVE, -MAX_STRETCH, MAX_STRETCH));
  }

  useDemo(
    !!demo,
    () => {
      const target = 0.15 + Math.random() * 0.85;
      const glide = animate(value, target, { type: "spring", stiffness: 120, damping: 16 });
      let flick: ReturnType<typeof animate> | undefined;
      let back = 0;
      if (target > 0.82) {
        flick = animate(stretch, MAX_STRETCH * 0.8, { duration: 0.22, ease: "easeOut", delay: 0.25 });
        back = window.setTimeout(settle, 520);
      }
      return () => {
        glide.stop();
        flick?.stop();
        window.clearTimeout(back);
        settle();
      };
    },
    { interval: 2400 },
  );

  return (
    <div className="p-6">
      <div
        ref={frame}
        role="slider"
        tabIndex={0}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          follow(event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) follow(event.clientY);
        }}
        onPointerUp={settle}
        onPointerCancel={settle}
        onKeyDown={(event) => {
          const step = event.key === "ArrowUp" ? 0.05 : event.key === "ArrowDown" ? -0.05 : 0;
          if (!step) return;
          event.preventDefault();
          animate(value, clamp(value.get() + step, 0, 1), { type: "spring", stiffness: 300, damping: 24 });
        }}
        className="cursor-pointer touch-none select-none rounded-[30px] outline-offset-4"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        <motion.div
          data-track
          style={{ scaleY, y, transformOrigin: origin }}
          className="relative h-full w-full overflow-hidden rounded-[30px] bg-black/10 dark:bg-white/15"
        >
          <motion.div style={{ height: fill }} className="absolute inset-x-0 bottom-0 bg-white dark:bg-white/90" />
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-black/60"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
