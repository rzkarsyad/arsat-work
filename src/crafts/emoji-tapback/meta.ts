import { defineCraft } from "../types";

export default defineCraft({
  title: "Tapback",
  description: "Tap a message and a row of reactions pops out, one after another.",
  date: "2026-09-11",
  tags: ["feedback", "interaction", "motion"],
  ratio: 1.35,
  notes: `The bar scales up from the corner nearest the message, and each reaction pops in a few frames after the one before it, so the row reads as a gesture rather than a panel appearing. Picking one collapses the bar and lands the badge on the bubble with the same spring.`,
});
