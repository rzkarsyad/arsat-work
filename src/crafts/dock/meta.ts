import { defineCraft } from "../types";

export default defineCraft({
  title: "Dock",
  description: "Icons swell toward the pointer and settle back, the way the Mac's dock does.",
  date: "2026-09-11",
  tags: ["apple", "interaction"],
  ratio: 1.7,
  notes: `Each icon measures its own distance to the pointer and maps that to a size, so the swell is a smooth hill centred on the cursor rather than one icon jumping at a time. A light spring with almost no mass trails the pointer just enough to feel like something physical is following your hand.

Click an icon and it hops, the launch bounce. Left alone, an invisible pointer sweeps the dock every few seconds.`,
});
