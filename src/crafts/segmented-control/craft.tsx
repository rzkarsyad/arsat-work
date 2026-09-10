"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";

const OPTIONS = ["Day", "Week", "Month", "Year"] as const;
type Option = (typeof OPTIONS)[number];

export default function SegmentedControl() {
  const [value, setValue] = useState<Option>("Week");
  const id = useId();

  return (
    <div
      role="tablist"
      aria-label="Range"
      className="flex rounded-full bg-black/6 p-1 dark:bg-white/10"
    >
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setValue(option)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={`${id}-indicator`}
                className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] dark:bg-white/15 dark:shadow-none"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            ) : null}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
