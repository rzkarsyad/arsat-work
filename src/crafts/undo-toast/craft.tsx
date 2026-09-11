"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const LIFETIME = 4;
const VISIBLE = 3;
const LABELS = ["Archived", "Deleted", "Snoozed", "Muted", "Moved to Later"];

type Toast = { id: number; label: string };

function Ring({ onDone }: { onDone: () => void }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="-rotate-90 shrink-0" aria-hidden>
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <motion.circle
        cx="9"
        cy="9"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: 0 }}
        transition={{ duration: LIFETIME, ease: "linear" }}
        onAnimationComplete={onDone}
      />
    </svg>
  );
}

export default function UndoToast({ demo }: CraftProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  function push() {
    const toast = { id: ++counter.current, label: LABELS[Math.floor(Math.random() * LABELS.length)] };
    setToasts((current) => [toast, ...current].slice(0, VISIBLE + 2));
  }
  const dismiss = (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id));

  useDemo(!!demo, push, { interval: 2600, delay: 600 });

  return (
    <div className="relative flex h-[190px] w-[280px] flex-col items-center">
      <button
        type="button"
        onClick={push}
        className="mt-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-canvas shadow-sm"
      >
        Archive
      </button>
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <AnimatePresence initial={false}>
          {toasts.slice(0, VISIBLE).map((toast, index) => (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1 - index * 0.22, y: -index * 12, scale: 1 - index * 0.06, zIndex: VISIBLE - index }}
              exit={{ opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: "spring", visualDuration: 0.4, bounce: 0.2 }}
              style={{ position: "absolute", bottom: 0 }}
              className="flex w-[232px] items-center gap-3 rounded-2xl bg-ink px-3.5 py-2.5 text-canvas shadow-xl"
            >
              <Ring onDone={() => dismiss(toast.id)} />
              <span className="flex-1 text-[13px] font-medium">{toast.label}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-white/25"
              >
                Undo
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
