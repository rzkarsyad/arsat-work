"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const RINGS = [
  { key: "move", color: "#fa2d55", radius: 56 },
  { key: "exercise", color: "#a6f43a", radius: 42 },
  { key: "stand", color: "#00d7ff", radius: 28 },
];
const STROKE = 11;
const spring = { type: "spring", visualDuration: 0.9, bounce: 0.12 } as const;

function randomValues() {
  return [0.35 + Math.random() * 0.65, 0.2 + Math.random() * 0.8, 0.3 + Math.random() * 0.7];
}

export default function ActivityRings({ demo }: CraftProps) {
  const [values, setValues] = useState([0.72, 0.48, 0.9]);
  const shuffle = () => setValues(randomValues());

  useDemo(!!demo, shuffle, { interval: 2400 });

  return (
    <button type="button" onClick={shuffle} aria-label="Shuffle the rings" className="rounded-full p-3">
      <svg width="152" height="152" viewBox="0 0 152 152" className="-rotate-90">
        {RINGS.map((ring, i) => (
          <g key={ring.key}>
            <circle cx="76" cy="76" r={ring.radius} fill="none" stroke={ring.color} strokeOpacity="0.2" strokeWidth={STROKE} />
            <motion.circle
              cx="76"
              cy="76"
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: values[i] }}
              transition={spring}
            />
          </g>
        ))}
      </svg>
    </button>
  );
}
