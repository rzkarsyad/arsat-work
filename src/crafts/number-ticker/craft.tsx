"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CraftProps } from "../types";

const DIGIT_HEIGHT = 44;
const spring = { type: "spring", stiffness: 240, damping: 26, mass: 0.7 } as const;

function random(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block w-[0.62em] overflow-hidden" style={{ height: DIGIT_HEIGHT }}>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        animate={{ y: -value * DIGIT_HEIGHT }}
        transition={spring}
      >
        {Array.from({ length: 10 }, (_, digit) => (
          <span key={digit} className="flex items-center justify-center" style={{ height: DIGIT_HEIGHT }}>
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-ink transition-colors hover:border-line-strong active:bg-stage"
    >
      {children}
    </button>
  );
}

export default function NumberTicker({ preview }: CraftProps) {
  const [value, setValue] = useState(1024);
  const chars = value.toLocaleString("en-US").split("");

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className={`flex font-mono font-medium tabular-nums text-ink ${preview ? "text-[36px]" : "text-[36px] sm:text-[48px]"}`}
        style={{ lineHeight: `${DIGIT_HEIGHT}px` }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((char, i) => {
            const key = String(chars.length - i);
            const isDigit = /\d/.test(char);
            return (
              <motion.span
                key={isDigit ? `d${key}` : `s${key}`}
                layout="position"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                {isDigit ? <Digit value={Number(char)} /> : <span className="w-[0.4em] text-muted">{char}</span>}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Action onClick={() => setValue((v) => Math.max(0, v - random(1, 400)))}>−</Action>
        <Action onClick={() => setValue(random(0, 999_999))}>Shuffle</Action>
        <Action onClick={() => setValue((v) => v + random(1, 400))}>+</Action>
      </div>
    </div>
  );
}
