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
  repo: "https://github.com/rzkarsyad/craft-by-arsat",
  links: {
    github: "https://github.com/rzkarsyad",
  },
} as const;
