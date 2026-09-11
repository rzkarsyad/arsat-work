import { defineCraft } from "../types";

export default defineCraft({
  title: "Activity rings",
  description: "Three rings that fill on springs, the way the Watch does it.",
  date: "2026-09-11",
  tags: ["motion", "apple"],
  ratio: 0.95,
  notes: `Each ring is a single SVG circle whose visible length is animated, so the round cap travels with the end of the arc instead of a mask sliding over it. The spring is deliberately long and soft; rings that snap into place lose the sense of effort.`,
});
