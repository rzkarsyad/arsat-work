const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const site = {
  /** What the header shows. */
  brand: "arsat.work",
  /** What metadata, Open Graph, the feed and search engines see. */
  name: "Rizki Arsyad - Product Designer",
  author: "Rizki Arsyad",
  description:
    "Interaction experiments, UI details and small delights by Rizki Arsyad, product designer.",
  /** Canonical origin. NEXT_PUBLIC_SITE_URL is set to https://arsat.work in production. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  /**
   * Public repository. Set NEXT_PUBLIC_REPO_URL once the repo exists — the
   * "Source" and per-craft "Code" links only render when it does, so the site
   * never ships a link to a repository that is not there.
   */
  repo: process.env.NEXT_PUBLIC_REPO_URL,
  /** Google Analytics 4 measurement id; the tag is only rendered when set. */
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  links: {
    github: "https://github.com/rzkarsyad",
  },
} as const;
