import { defineCraft } from "../types";

export default defineCraft({
  title: "Number ticker",
  description: "Digits roll like an odometer instead of flashing to the new value.",
  date: "2026-08-24",
  tags: ["typography", "motion"],
  ratio: 0.8,
  notes: `Every digit column is a strip of 0–9 that translates to the right value on a spring, so a change from 3 to 7 visibly passes through 4, 5 and 6. Columns are keyed by their position from the right, which keeps the identity of the units, tens and hundreds stable when the number gains or loses a digit.`,
});
