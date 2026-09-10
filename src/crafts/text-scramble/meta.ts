import { defineCraft } from "../types";

export default defineCraft({
  title: "Text scramble",
  description: "Letters resolve left to right out of a burst of glyphs.",
  date: "2026-08-16",
  tags: ["typography", "interaction"],
  ratio: 1.5,
  notes: `Each character gets its own reveal time, staggered from left to right, and only a fraction of the unresolved glyphs change per frame. Without that throttle the effect reads as noise instead of decoding.

Honours prefers-reduced-motion by swapping the text instantly.`,
});
