const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const site = {
  name: "Craft by Arsat",
  author: "Arsat",
  description:
    "Interaction experiments, UI details and small delights — a personal playground by Arsat.",
  /** Set NEXT_PUBLIC_SITE_URL once a custom domain is attached. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  /**
   * Public repository. Set NEXT_PUBLIC_REPO_URL once the repo exists — the
   * "Source" and per-craft "Code" links only render when it does, so the site
   * never ships a link to a repository that is not there.
   */
  repo: process.env.NEXT_PUBLIC_REPO_URL,
  links: {
    github: "https://github.com/rzkarsyad",
  },
} as const;
