/** Parse an ISO date as UTC so server and client agree on the day. */
function utcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatDate(iso: string, style: "long" | "month" = "long"): string {
  const options: Intl.DateTimeFormatOptions =
    style === "long" ? { year: "numeric", month: "long", day: "numeric" } : { month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(utcDate(iso));
}
