// Server-safe catalogue of apps.
import { metas } from "./_metas";
import type { AppEntry } from "./types";

const byDateAsc = [...metas].sort((a, b) =>
  a.meta.date === b.meta.date ? a.slug.localeCompare(b.slug) : a.meta.date.localeCompare(b.meta.date),
);

/** Every app, newest first. */
export const apps: AppEntry[] = byDateAsc.map((item) => ({ ...item.meta, slug: item.slug })).reverse();

export const appsUpdated: string | undefined = apps[0]?.date;
