# Craft by Arsat

A personal experiment place. Every exploration is a small React component that
runs **live** on the page — no screen recordings, no CMS, no database. Content
lives in the repo, so publishing is one folder and one push.

## Publishing an exploration

```bash
npm run new my-idea "My idea"
```

That scaffolds `src/crafts/my-idea/` with two files:

- **`meta.ts`** — title, one-line description, date, tags, and optional
  `notes` (the write-up), `source` (a reference link) and `cover` (a static
  image or video to show on the index instead of the live component).
- **`craft.tsx`** — the exploration itself, a `"use client"` component. It
  receives `{ preview }` so it can render something lighter inside an index
  card than on its own page.

Edit both, and it appears at `/my-idea` and on the index. Push, and Vercel
deploys it.

The index registry (`src/crafts/_metas.ts` and `_registry.ts`) is generated
from the folder listing before every `dev` and `build`, so it never needs to
be edited by hand. Run `npm run crafts` to regenerate it on demand.

Numbering is automatic and stable: crafts are numbered by date ascending, and
listed newest first. Tags come from the fixed list in
[`src/crafts/types.ts`](src/crafts/types.ts) — add one there to use it.

## Writing a craft

- Use the theme tokens, not raw colours: `bg-surface`, `text-ink`,
  `text-muted`, `border-line`, `text-accent`. They already work in light and
  dark.
- The stage centres your component and gives it a dot-grid background. Size
  the component itself; do not try to fill the stage.
- Keep motion in [`motion`](https://motion.dev). `MotionConfig` already
  honours `prefers-reduced-motion` for the whole site.
- The detail page has a Reset control that remounts the component, so it is
  fine to have a craft end in a finished state.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run new <slug> ["Title"]` | Scaffold a new craft |
| `npm run crafts` | Regenerate the craft registry |
| `npm run build` | Production build (type-checks and prerenders every page) |
| `npm run typecheck` | Types only |
| `npm run lint` | ESLint |

## Deploying

The site is a static Next.js App Router build with no runtime services, so it
deploys to Vercel with no configuration. Set `NEXT_PUBLIC_SITE_URL` to the
custom domain once one is attached — it is what the RSS feed, sitemap and
Open Graph URLs are built from. Without it the deployment URL is used.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Motion · next-themes ·
Geist and Instrument Serif · Vercel Analytics.

## Environment variables

Both are optional and only affect links.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for RSS, sitemap and Open Graph. Falls back to the Vercel deployment URL. |
| `NEXT_PUBLIC_REPO_URL` | Enables the footer "Source" link and the per-craft "Code" link. They are hidden when it is unset. |
