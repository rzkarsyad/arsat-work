import type { Transition } from "motion/react";

/**
 * The one spring used for layout and shared-element motion. Expressed as a
 * perceived duration plus bounce, the same model as SwiftUI's springs.
 */
export const spring: Transition = { type: "spring", visualDuration: 0.4, bounce: 0.08 };

/** Content that fades and blurs in behind a moving surface. */
export const blurIn = {
  initial: { opacity: 0, filter: "blur(10px)", y: 8 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  exit: { opacity: 0, filter: "blur(10px)", y: 0 },
  transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const },
};
