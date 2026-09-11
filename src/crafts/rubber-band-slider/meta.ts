import { defineCraft } from "../types";

export default defineCraft({
  title: "Rubber band slider",
  description: "A vertical slider that stretches when you drag past its ends, then snaps back.",
  date: "2026-09-11",
  tags: ["interaction", "motion", "apple"],
  ratio: 0.8,
  notes: `The fill stops at the ends, but the track does not: drag past the top and the whole thing stretches upward from its base, a little less than your hand moved, then springs back the moment you let go. It is the Control Center volume slider's overscroll, and it is most of what makes the control feel like an object.

Keyboard works too: arrow keys nudge it in fives.`,
});
