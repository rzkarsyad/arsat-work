import { defineCraft } from "../types";

export default defineCraft({
  title: "Segmented control",
  description: "A sliding indicator that carries the selection between segments.",
  date: "2026-07-28",
  tags: ["navigation", "motion"],
  ratio: 1.6,
  notes: `The indicator is a single element that moves between segments with a shared layout animation, so it stretches slightly while travelling and settles with a short spring. Text colour crossfades independently, which keeps the label legible mid-flight.`,
});
