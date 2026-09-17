import { defineCraft } from "../types";

export default defineCraft({
  title: "Hold to confirm",
  description: "A destructive action that asks for a held press instead of a dialog.",
  date: "2026-09-02",
  tags: ["button", "feedback"],
  ratio: 1.0,
  notes: `The fill sweeps across the label while you hold, and the label's colour flips as the edge passes over it: the same text is drawn twice, once under and once inside the clipped fill. Letting go early springs the fill back, so a mistaken press costs nothing.`,
});
