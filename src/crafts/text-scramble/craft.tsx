"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useDemo } from "@/lib/demo";
import type { CraftProps } from "../types";

const PHRASES = ["Design", "Prototype", "Iterate", "Ship it"];
const GLYPHS = "!<>-_\\/[]{}—=+*^?#";
const DURATION = 720;
const CHURN = 0.28;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function TextScramble({ demo }: CraftProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(PHRASES[0]);
  const frame = useRef(0);
  const shown = useRef<string[]>(PHRASES[0].split(""));
  const reduceMotion = useReducedMotion();

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useDemo(!!demo, advance, { interval: 2300 });

  function advance() {
    const nextIndex = (index + 1) % PHRASES.length;
    const target = PHRASES[nextIndex];
    setIndex(nextIndex);

    if (reduceMotion) {
      shown.current = target.split("");
      setText(target);
      return;
    }

    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION);
      const chars = target.split("").map((char, i) => {
        if (char === " ") return " ";
        const revealAt = 0.25 + (i / target.length) * 0.75;
        if (progress >= revealAt) return char;
        const previous = shown.current[i];
        return previous && previous !== " " && Math.random() > CHURN ? previous : randomGlyph();
      });
      shown.current = chars;
      setText(chars.join(""));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  return (
    <button
      type="button"
      onPointerEnter={advance}
      onClick={advance}
      className="px-4 text-5xl font-medium leading-none tracking-tight text-ink sm:text-6xl"
      aria-live="polite"
    >
      {text}
    </button>
  );
}
