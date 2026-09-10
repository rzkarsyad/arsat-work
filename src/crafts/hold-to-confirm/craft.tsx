"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";

const HOLD_MS = 1100;
const WIDTH = 220;
type Phase = "idle" | "holding" | "done";

function Label({ phase }: { phase: Phase }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={phase === "done" ? "done" : "hold"}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.16 }}
        className="flex items-center gap-1.5"
      >
        {phase === "done" ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
            Deleted
          </>
        ) : (
          "Hold to delete"
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export default function HoldToConfirm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const controls = useRef<ReturnType<typeof animate> | null>(null);

  function start() {
    if (phase === "done") return;
    setPhase("holding");
    controls.current?.stop();
    controls.current = animate(progress, 1, {
      duration: HOLD_MS / 1000,
      ease: "linear",
      onComplete: () => setPhase("done"),
    });
  }

  function cancel() {
    if (phase !== "holding") return;
    controls.current?.stop();
    controls.current = animate(progress, 0, { type: "spring", stiffness: 320, damping: 30 });
    setPhase("idle");
  }

  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      controls.current = animate(progress, 0, { duration: 0.3, ease: "easeOut" });
      setPhase("idle");
    }, 1600);
    return () => clearTimeout(timer);
  }, [phase, progress]);

  useEffect(() => () => controls.current?.stop(), []);

  return (
    <motion.button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
      whileTap={{ scale: 0.98 }}
      aria-live="polite"
      className="relative h-12 touch-none select-none overflow-hidden rounded-full border border-red-500/40 bg-red-500/10 text-sm font-medium"
      style={{ width: WIDTH }}
    >
      <span className="absolute inset-0 flex items-center justify-center text-red-600 dark:text-red-400">
        <Label phase={phase} />
      </span>
      <motion.span aria-hidden className="absolute inset-y-0 left-0 overflow-hidden bg-red-500" style={{ width }}>
        <span className="flex h-full items-center justify-center text-white" style={{ width: WIDTH }}>
          <Label phase={phase} />
        </span>
      </motion.span>
    </motion.button>
  );
}
