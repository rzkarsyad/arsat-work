import { defineCraft } from "../types";

export default defineCraft({
  title: "Spring toggle",
  description: "An iOS-style switch whose knob stretches while pressed and snaps on release.",
  date: "2026-08-05",
  tags: ["form", "motion", "apple"],
  notes: `Press and hold: the knob widens toward the direction it is about to travel. Release: it slides and snaps back to its resting width. Both are driven by the same spring so the two motions feel like one gesture.`,
});
