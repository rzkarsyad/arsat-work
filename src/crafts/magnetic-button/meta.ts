import { defineCraft } from "../types";

export default defineCraft({
  title: "Magnetic button",
  description: "A button that leans toward the cursor and settles back on a spring.",
  date: "2026-07-14",
  tags: ["button", "interaction"],
  tile: "2x2",
  notes: `The pull is proportional to the distance from the button's centre and only active inside a generous hit area, so the button follows the pointer without ever feeling glued to it.

The label moves a little less than the button itself. That tiny parallax is what makes it read as a physical object rather than a translated div.`,
});
