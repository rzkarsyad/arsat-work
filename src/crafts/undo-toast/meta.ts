import { defineCraft } from "../types";

export default defineCraft({
  title: "Undo toast",
  description: "Toasts stack up with a countdown ring; Undo pulls one back before it is gone.",
  date: "2026-09-11",
  tags: ["feedback", "motion"],
  ratio: 1.35,
  notes: `Instead of a confirm dialog, the action just happens and a toast offers to take it back for a few seconds. The ring is the deadline, drawn as the visible length of a circle so it drains rather than blinks.

New toasts land in front; older ones step back, shrink a touch and dim, so a burst of actions reads as a stack rather than a list.`,
});
