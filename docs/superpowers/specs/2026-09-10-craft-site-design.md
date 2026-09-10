# Craft by Arsat — design spec (2026-09-10)

## Purpose

A personal "experiment place": a public gallery where Arsat publishes UI and
interaction explorations, in the spirit of designspells.com, inspora.design and
recent.design — but single-author, and with every exploration rendered live
instead of as a screen recording. Publishing a new exploration must be a
one-folder, one-push operation.

## Non-goals

- No CMS, database, auth, comments or search. Content lives in the repo.
- No mandatory screen recordings. A craft is a React component; the index
  renders it live. A static image/video cover is optional.

## Content model

Each craft is a folder under `src/crafts/<slug>/` with two files:

- `meta.ts` — data only (server-safe): `title`, `description`, `date`
  (ISO), `tags` (fixed union in `types.ts`), optional `notes`, `source`,
  `cover`.
- `craft.tsx` — a `"use client"` component. It receives `{ preview }` so it
  can render a lighter version inside an index card.

`scripts/generate-registry.mjs` scans the folder and writes two files:
`_metas.ts` (data only, importable from server code such as pages, the feed,
the sitemap and OG images) and `_registry.ts` (the client components). It runs
before `dev` and `build`, and via `npm run crafts`. `npm run new <slug>
["Title"]` scaffolds a craft and regenerates both.

Numbering is stable and sequential by date ascending (like designspells'
"#332"); listings show newest first.

## Routes (all static)

- `/` — hero, tag filter chips, live grid of cards.
- `/[slug]` — large stage with a reset control, notes, metadata, prev/next
  navigation, keyboard shortcuts (← older, → newer, Esc back).
- `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `opengraph-image` for the site
  and per craft.

`generateStaticParams` + `dynamicParams = false`; unknown slugs 404.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `motion` v13,
`next-themes`, Geist Sans/Mono (npm `geist`), Instrument Serif (vendored TTF,
OFL), `@vercel/analytics`. Deploys to Vercel with no configuration.

## Visual direction

Warm paper canvas, white surfaces, hairline borders, dot-grid preview stages,
Geist for UI, Geist Mono for numbers and metadata, Instrument Serif italic as
the accent voice ("small delights"), a single coral accent. Light and dark
themes, system-aware with a manual toggle. Motion respects
`prefers-reduced-motion`.

## Verification

`npm run build` (type-check + lint + static generation) and a manual pass in
the browser: filtering, card → detail navigation, keyboard shortcuts, theme
toggle, reset control, RSS and OG image responses.

## Revision — 2026-09-11

Arsat asked for a cleaner, text-light index and a popup instead of a detail
page. The content model and routes are unchanged; presentation is not.

- **Index tiles only.** Cards lost their title, description, number, tags and
  date. A tile is the live preview, interactive in place. A click on the
  craft's own controls belongs to the craft; a click anywhere else on the
  tile, or the expand affordance shown on hover (always shown on touch
  screens), opens the popup.
- **Bento grid.** Square cells, 2 / 3 / 4 columns by viewport, dense packing.
  Each craft declares an optional `tile` footprint (`1x1`, `2x1`, `1x2`,
  `2x2`). Row height derives from the wrapper's width with container units so
  cells stay square. The stage scales a craft down (never up) to fit its tile.
- **Popup instead of a page.** `/[slug]` still prerenders, with its own
  metadata and OG image, but it renders the index with that craft's popup
  open. Opening from the index pushes a history entry so Back closes it;
  ← and → move between crafts; Escape and the backdrop close. The tile and
  the panel share a layout id, so the tile morphs into the panel on one
  spring (`visualDuration` 0.45, `bounce` 0.12) behind a frosted backdrop,
  and the text blurs in beneath it.
- **Typography.** Geist Sans only. Instrument Serif and Geist Mono are gone
  from the UI, the crafts and the OG images. The headline is one short line.
