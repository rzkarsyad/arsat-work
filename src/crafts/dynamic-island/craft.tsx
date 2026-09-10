"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Mode = "idle" | "timer" | "music";
const NEXT: Record<Mode, Mode> = { idle: "timer", timer: "music", music: "idle" };
const spring = { type: "spring", stiffness: 380, damping: 32 } as const;
const swap = {
  initial: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
  transition: { duration: 0.22 },
} as const;

function TimerBody() {
  const [seconds, setSeconds] = useState(5 * 60);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 1.5M9 2h6" />
        </svg>
      </span>
      <span className="text-left text-[11px] font-medium uppercase tracking-wider text-white/50">Timer</span>
      <span className="font-mono text-2xl tabular-nums text-orange-400">
        {mm}:{ss}
      </span>
    </div>
  );
}

function MusicBody() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 pr-5">
      <span className="h-9 w-9 rounded-lg bg-[conic-gradient(from_200deg,#f97316,#ec4899,#8b5cf6,#f97316)]" />
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[13px] font-medium text-white">Small delights</span>
        <span className="text-[11px] text-white/50">Craft by Arsat</span>
      </span>
      <span className="ml-2 flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((bar) => (
          <motion.span
            key={bar}
            className="w-[3px] rounded-full bg-emerald-400"
            animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
            transition={{ duration: 0.9 + bar * 0.17, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </span>
    </div>
  );
}

export default function DynamicIsland() {
  const [mode, setMode] = useState<Mode>("idle");
  return (
    <div className="flex flex-col items-center gap-5">
      <motion.button
        type="button"
        layout
        transition={spring}
        onClick={() => setMode((current) => NEXT[current])}
        aria-label="Cycle the island between idle, timer and now playing"
        className="flex items-center justify-center overflow-hidden bg-black text-white shadow-xl shadow-black/25"
        style={{ borderRadius: 999 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {mode === "idle" ? (
            <motion.div key="idle" {...swap} className="h-9 w-[120px]" />
          ) : mode === "timer" ? (
            <motion.div key="timer" {...swap}>
              <TimerBody />
            </motion.div>
          ) : (
            <motion.div key="music" {...swap}>
              <MusicBody />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Tap to cycle</span>
    </div>
  );
}
