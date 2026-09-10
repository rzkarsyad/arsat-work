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
  `notes` (the write-up), `source` (a reference link), `cover` (a static
  image or video to show on the index instead of the live component) and
  `tile` (its footprint on the index grid: `"1x1"`, `"2x1"`, `"1x2"` or
  `"2x2"`).
- **`craft.tsx`** — the exploration itself, a `"use client"` component. It
  receives `{ preview }` so it can render something lighter inside an index
  card than on its own page.

Edit both, and it appears on the index as a live tile; clicking the tile opens
it in a popup at `/my-idea`, which is also a shareable link. Push, and Vercel
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
- Give the component a natural size and let the stage handle the rest. It is
  centred, and scaled down (never up) when a tile is too small for it, so a
  wide craft still reads inside a 1x1 tile. Ask for a bigger `tile` when the
  craft needs the room or the hit area.
- The index shows tiles only, no text. Clicks on the craft's own controls stay
  with the craft; a click anywhere else on the tile opens the popup.
- The site is set in Geist Sans only. Use `tabular-nums` for figures rather
  than a mono face.
- Keep motion in [`motion`](https://motion.dev). `MotionConfig` already
  honours `prefers-reduced-motion` for the whole site, and `src/lib/motion.ts`
  has the shared spring.
- The popup has a Reset control that remounts the component, so it is fine to
  have a craft end in a finished state.

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
Geist · Vercel Analytics.

## Environment variables

Both are optional and only affect links.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for RSS, sitemap and Open Graph. Falls back to the Vercel deployment URL. |
| `NEXT_PUBLIC_REPO_URL` | Enables the footer "Source" link and the per-craft "Code" link. They are hidden when it is unset. |
