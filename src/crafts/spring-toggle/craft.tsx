"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ROWS = [
  { id: "wifi", label: "Wi‑Fi", initial: true },
  { id: "bluetooth", label: "Bluetooth", initial: false },
  { id: "focus", label: "Focus", initial: false },
] as const;

const spring = { type: "spring", stiffness: 520, damping: 32 } as const;

function Switch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`flex h-[31px] w-[51px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-200 ${
        checked ? "bg-[#34c759] justify-end" : "bg-black/15 justify-start dark:bg-white/20"
      }`}
    >
      <motion.span
        layout
        transition={spring}
        animate={{ width: pressed ? 34 : 27 }}
        className="h-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.06)]"
      />
    </button>
  );
}

export default function SpringToggle() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ROWS.map((row) => [row.id, row.initial])),
  );

  return (
    <div className="w-[248px] divide-y divide-line rounded-2xl border border-line bg-surface shadow-sm">
      {ROWS.map((row) => (
        <div key={row.id} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-ink">{row.label}</span>
          <Switch
            checked={state[row.id]}
            label={row.label}
            onChange={(next) => setState((s) => ({ ...s, [row.id]: next }))}
          />
        </div>
      ))}
    </div>
  );
}
