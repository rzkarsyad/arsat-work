"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const W = 122;
const H = 196;
const R = 18;
const OPEN = 0;
const CLOSED = 180;

/** Sky over sand, standing in for the wallpaper. */
const WALL = "linear-gradient(180deg,#9dc1e1 0%,#cfd6da 38%,#dccbad 54%,#b48d5c 100%)";
const BEZEL = "inset 0 0 0 3px #1c1c1e";
const ICONS = [
  "#34c759", "#0a84ff", "#5e5ce6", "#ff9f0a", "#ff2d55", "#1c1c1e", "#30d158", "#64d2ff",
  "#ff453a", "#bf5af2", "#ffd60a", "#8e8e93",
];

function Icon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <span
      className="block shrink-0 rounded-[4px]"
      style={{ width: size, height: size, background: color, boxShadow: "inset 0 -1px 0 rgba(0,0,0,.18)" }}
    />
  );
}

/** The half you were already looking at. It does not change when the phone opens. */
function HomeScreen() {
  return (
    <div className="absolute inset-0 p-2" style={{ background: WALL }}>
      <div className="flex gap-1.5 pr-4">
        <div className="h-11 flex-1 rounded-lg p-1.5 text-white" style={{ background: "linear-gradient(160deg,#5eaeff,#1a66ff)" }}>
          <div className="h-1 w-6 rounded-full bg-white/70" />
          <div className="mt-1 text-[12px] font-semibold leading-none">54°</div>
        </div>
        <div className="relative h-11 flex-1 overflow-hidden rounded-lg" style={{ background: "linear-gradient(160deg,#e4ead3,#b6c796)" }}>
          <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-[#ff3b30] ring-2 ring-white" />
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-x-[7px] gap-y-2 pr-4">
        {ICONS.map((color) => (
          <Icon key={color} color={color} />
        ))}
      </div>
      <div className="absolute right-1.5 top-9 flex flex-col gap-1.5">
        {["#34c759", "#0a84ff", "#30d158", "#ff2d55"].map((color) => (
          <Icon key={color} color={color} size={11} />
        ))}
      </div>
      <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full bg-white/75" />
    </div>
  );
}

/** Frosted while the hinge moves, sharp once it is nearly flat. */
const wallpaper: Variants = {
  hidden: { filter: "blur(9px)", transition: { duration: 0.2 } },
  shown: { filter: "blur(0px)", transition: { delay: 0.3, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};
const reveal: Variants = {
  hidden: { opacity: 0.45, scale: 0.93, filter: "blur(14px)", transition: { duration: 0.18 } },
  shown: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.38 + i * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

/** The half that swings open. Its widgets are the new space. */
function NewHalf({ open }: { open: boolean }) {
  const state = open ? "shown" : "hidden";
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div variants={wallpaper} initial="hidden" animate={state} className="absolute -inset-2" style={{ background: WALL }} />
      <div className="absolute inset-0 flex flex-col gap-1.5 p-2">
        <motion.div data-part="widget" custom={0} variants={reveal} initial="hidden" animate={state} className="flex h-10 w-[72%] items-center gap-1.5 rounded-lg bg-[#1c1c1e]/92 p-1.5">
          <span className="h-6 w-6 shrink-0 rounded-[5px]" style={{ background: "linear-gradient(135deg,#ff6b6b,#ffd166 60%,#4cc9f0)" }} />
          <span className="flex flex-col gap-1">
            <span className="h-1 w-8 rounded-full bg-white/80" />
            <span className="h-1 w-5 rounded-full bg-white/40" />
          </span>
        </motion.div>
        <motion.div data-part="widget" custom={1} variants={reveal} initial="hidden" animate={state} className="flex flex-1 gap-1.5 rounded-lg bg-white/92 p-1.5">
          <span className="w-[38%] rounded-md" style={{ background: "linear-gradient(160deg,#f6c1a8,#c8825b)" }} />
          <span className="flex flex-1 flex-col gap-1.5">
            <span className="h-2.5 rounded-[3px] bg-[#ffd3da]" />
            <span className="h-2.5 rounded-[3px] bg-[#d6f0cf]" />
            <span className="h-2.5 rounded-[3px] bg-[#ffd3da]" />
            <span className="h-1 w-3/4 rounded-full bg-black/15" />
          </span>
        </motion.div>
        <motion.div data-part="widget" custom={2} variants={reveal} initial="hidden" animate={state} className="flex gap-[7px]">
          <Icon color="#ff9f0a" />
          <Icon color="#5e5ce6" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Fold({ demo }: CraftProps) {
  const [open, setOpen] = useState(false);
  const angle = useMotionValue(CLOSED);
  const hinge = useSpring(angle, { stiffness: 115, damping: 19, mass: 1 });
  /** Keep the visible part centred: one half when closed, two when open. */
  const shift = useTransform(hinge, [CLOSED, OPEN], [-W / 2, 0]);
  const backShade = useTransform(hinge, [CLOSED, 100, OPEN], [0.6, 0.25, 0]);
  const hingeShade = useTransform(hinge, [CLOSED, 60, OPEN], [0, 0.35, 0]);

  function toggle() {
    const next = !open;
    setOpen(next);
    angle.set(next ? OPEN : CLOSED);
  }

  useDemo(!!demo, toggle, { interval: 3300, delay: 700 });

  return (
    <div className="flex items-center justify-center p-4" style={{ perspective: 900 }}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={open ? "Fold the phone" : "Unfold the phone"}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        style={{ x: shift, width: W * 2, height: H, transformStyle: "preserve-3d" }}
        className="relative cursor-pointer select-none rounded-sm"
      >
        {/* The half that swings out from behind. */}
        <motion.div
          data-part="hinge"
          style={{ rotateY: hinge, width: W, height: H, transformOrigin: "right center", transformStyle: "preserve-3d" }}
          className="absolute left-0 top-0"
        >
          <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", borderRadius: `${R}px 0 0 ${R}px`, boxShadow: BEZEL }}>
            <NewHalf open={open} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: `0 ${R}px ${R}px 0`,
              background: "linear-gradient(135deg,#48484a,#1c1c1e)",
            }}
          >
            <motion.div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: backShade, borderRadius: "inherit" }} />
            <span className="absolute right-3 top-3 h-6 w-6 rounded-full bg-black/60 ring-1 ring-white/15" />
          </div>
        </motion.div>

        {/* The half you were looking at. */}
        <div className="absolute top-0 overflow-hidden" style={{ left: W, width: W, height: H, borderRadius: `0 ${R}px ${R}px 0`, boxShadow: BEZEL }}>
          <HomeScreen />
          <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,0))]" style={{ opacity: hingeShade }} />
        </div>
      </motion.div>
    </div>
  );
}
