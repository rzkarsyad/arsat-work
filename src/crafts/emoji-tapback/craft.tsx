"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const REACTIONS = ["❤️", "👍", "👎", "😂", "‼️", "❓"];
const pop = { type: "spring", visualDuration: 0.32, bounce: 0.35 } as const;

export default function EmojiTapback({ demo }: CraftProps) {
  const [showBar, setShowBar] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  function pick(emoji: string) {
    setReaction((current) => (current === emoji ? null : emoji));
    setShowBar(false);
  }

  useDemo(
    !!demo,
    () => {
      setShowBar(true);
      const choose = window.setTimeout(() => pick(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]), 950);
      return () => {
        window.clearTimeout(choose);
        setShowBar(false);
      };
    },
    { interval: 2700 },
  );

  return (
    <div className="relative flex flex-col items-end px-6 pb-4 pt-16">
      <AnimatePresence>
        {showBar ? (
          <motion.div
            key="bar"
            role="group"
            aria-label="Reactions"
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 8, transition: { duration: 0.15 } }}
            transition={pop}
            style={{ transformOrigin: "90% 100%" }}
            className="absolute right-6 top-3 flex gap-0.5 rounded-full bg-surface px-2 py-1.5 shadow-lg ring-1 ring-line"
          >
            {REACTIONS.map((emoji, i) => (
              <motion.button
                key={emoji}
                type="button"
                aria-label={`React with ${emoji}`}
                onClick={() => pick(emoji)}
                initial={{ scale: 0, y: 6 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ ...pop, delay: 0.04 * i }}
                whileHover={{ scale: 1.3, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[18px] leading-none ${
                  reaction === emoji ? "bg-black/10 dark:bg-white/15" : ""
                }`}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setShowBar((current) => !current)}
        aria-label="Message. Tap to react"
        className="relative max-w-[230px] rounded-[20px] rounded-br-md bg-[#0a84ff] px-4 py-2.5 text-left text-[15px] leading-snug text-white shadow-sm"
      >
        Dinner at 8? Found a place with a garden.
        <AnimatePresence>
          {reaction ? (
            <motion.span
              key={reaction}
              initial={{ scale: 0, y: 6 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, transition: { duration: 0.12 } }}
              transition={pop}
              className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[14px] shadow-md ring-1 ring-line"
            >
              {reaction}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
    </div>
  );
}
