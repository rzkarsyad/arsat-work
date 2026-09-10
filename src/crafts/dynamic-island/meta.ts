import { defineCraft } from "../types";

export default defineCraft({
  title: "Dynamic island",
  description: "One black pill that grows into a timer, then a player, then back.",
  date: "2026-09-10",
  tags: ["apple", "motion", "layout"],
  notes: `The container is a single element with a layout animation; the content inside swaps with a blur-and-scale crossfade. Because the exiting content is popped out of the layout flow, the pill can start resizing toward the new content immediately instead of waiting for the old content to leave.`,
});
