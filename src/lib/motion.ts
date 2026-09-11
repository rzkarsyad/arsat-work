import type { Transition } from "motion/react";

/**
 * The one spring used for layout and shared-element motion. Expressed as a
 * perceived duration plus bounce, the same model as SwiftUI's springs.
 */
export const spring: Transition = { type: "spring", visualDuration: 0.4, bounce: 0.08 };
