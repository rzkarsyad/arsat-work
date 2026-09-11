"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const PANEL_W = 128;
const PANEL_H = 232;
const RADIUS = 24;
const OPEN = 0;
const CLOSED = -180;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Skeleton rows standing in for a list, deterministic so server and client agree. */
function Rows({ count, seed }: { count: number; seed: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-black/15" />
          <span className="h-2 rounded-full bg-black/10" style={{ width: `${40 + ((i * 37 + seed * 11) % 50)}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function Fold({ demo }: CraftProps) {
  const [open, setOpen] = useState(true);
  const angle = useMotionValue(OPEN);
  const smooth = useSpring(angle, { stiffness: 150, damping: 24, mass: 1 });
  /** Keep the device centred as it narrows to one panel. */
  const shift = useTransform(smooth, [CLOSED, OPEN], [PANEL_W / 2, 0]);
  const sheen = useTransform(smooth, [CLOSED, -90, OPEN], [0, 0.45, 0]);
  const shade = useTransform(smooth, [CLOSED, -110, OPEN], [0.5, 0.12, 0]);
  const drag = useRef<{ startX: number; startAngle: number; moved: boolean } | null>(null);

  function settle(to: number) {
    angle.set(to);
    setOpen(to === OPEN);
  }
  function toggle() {
    settle(open ? CLOSED : OPEN);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startAngle: smooth.get(), moved: false };
  }
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.startX;
    if (Math.abs(dx) > 3) state.moved = true;
    const next = clamp(state.startAngle + (dx / PANEL_W) * 180, CLOSED, OPEN);
    angle.jump(next);
    smooth.jump(next);
  }
  function onPointerUp() {
    const state = drag.current;
    drag.current = null;
    if (!state) return;
    if (!state.moved) return toggle();
    settle(smooth.get() < -90 ? CLOSED : OPEN);
  }

  useDemo(!!demo, toggle, { interval: 2800 });

  const bezel = "inset 0 0 0 4px #111";

  return (
    <div className="flex items-center justify-center p-4" style={{ perspective: 1100 }}>
      <motion.div style={{ x: shift, width: PANEL_W * 2, height: PANEL_H, transformStyle: "preserve-3d" }} className="relative">
        {/* Left screen: fixed. */}
        <div
          className="absolute left-0 top-0 h-full overflow-hidden bg-white"
          style={{ width: PANEL_W, borderRadius: `${RADIUS}px 0 0 ${RADIUS}px`, boxShadow: bezel }}
        >
          <div className="px-3.5 pt-5">
            <div className="mb-3 text-[11px] font-semibold text-black">Today</div>
            <Rows count={7} seed={1} />
          </div>
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />
          <div aria-hidden className="absolute inset-y-0 right-0 w-px bg-black/40" />
        </div>

        {/* Right screen: swings on the hinge. Its back is the cover screen. */}
        <motion.div
          role="button"
          tabIndex={0}
          aria-pressed={!open}
          aria-label={open ? "Fold the phone" : "Unfold the phone"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggle();
            }
          }}
          style={{ rotateY: smooth, width: PANEL_W, height: PANEL_H, left: PANEL_W, transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="absolute top-0 cursor-grab touch-none select-none active:cursor-grabbing"
        >
          <div
            className="absolute inset-0 overflow-hidden bg-white"
            style={{ backfaceVisibility: "hidden", borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`, boxShadow: bezel }}
          >
            <div className="px-3.5 pt-5">
              <div className="mb-2 h-3 w-3/5 rounded-full bg-black/80" />
              <div className="mb-3 h-16 rounded-xl bg-[linear-gradient(135deg,#ffb26b,#ff5c8a_55%,#7b5cff)]" />
              <Rows count={4} seed={3} />
            </div>
            <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0),#fff)]" style={{ opacity: sheen }} />
          </div>
          <div
            className="absolute inset-0 overflow-hidden text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: `${RADIUS}px 0 0 ${RADIUS}px`,
              background: "linear-gradient(160deg,#2c2c2e,#000 70%)",
              boxShadow: bezel,
            }}
          >
            <div className="flex h-full flex-col items-center pt-8">
              <span className="text-[11px] text-white/55">Thursday 11</span>
              <span className="text-[38px] font-medium leading-none tabular-nums tracking-tight">9:41</span>
              <div className="mt-auto mb-6 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2 backdrop-blur">
                <span className="h-5 w-5 rounded-md bg-[linear-gradient(135deg,#5ac8fa,#007aff)]" />
                <span className="flex flex-col gap-1">
                  <span className="h-1.5 w-12 rounded-full bg-white/70" />
                  <span className="h-1.5 w-8 rounded-full bg-white/35" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
