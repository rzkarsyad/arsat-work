/** Parse an ISO date as UTC so server and client agree on the day. */
function utcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatDate(
  iso: string,
  style: "long" | "short" | "month" = "long",
): string {
  const options: Intl.DateTimeFormatOptions =
    style === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : style === "short"
        ? { month: "short", day: "numeric" }
        : { month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    utcDate(iso),
  );
}

/** "007" style numbers. */
export function pad(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}
