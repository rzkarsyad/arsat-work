"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const PULL = 0.35;
const LABEL_PARALLAX = 0.4;

export default function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.2 });
  const labelX = useTransform(springX, (v) => v * LABEL_PARALLAX);
  const labelY = useTransform(springY, (v) => v * LABEL_PARALLAX);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * PULL);
    y.set((event.clientY - (rect.top + rect.height / 2)) * PULL);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      className="flex items-center justify-center p-14 sm:p-20"
      onPointerMove={onPointerMove}
      onPointerLeave={release}
    >
      <motion.button
        ref={ref}
        type="button"
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.94 }}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas shadow-lg shadow-black/10 select-none"
      >
        <motion.span style={{ x: labelX, y: labelY }} className="block">
          Hover me
        </motion.span>
      </motion.button>
    </div>
  );
}
