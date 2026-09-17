import { site } from "./site";

/**
 * Metadata from nested segments is merged shallowly, so a page that sets
 * `openGraph` at all replaces the root layout's block outright — `siteName`
 * and `type` included, not just the keys it names. Every page that declares
 * its own spreads this back in first, then overrides what it means to change.
 */
export const openGraphBase = {
  siteName: site.name,
  type: "website",
} as const;
