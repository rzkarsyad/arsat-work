#!/usr/bin/env node
// Usage: npm run new:app <slug> ["Name"]
// Creates src/apps/<slug>/meta.ts; drop the cover in as cover.png and the icon as icon.png.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { APPS_DIR, generateRegistry } from "./generate-registry.mjs";

const [rawSlug, ...nameWords] = process.argv.slice(2);
if (!rawSlug) {
  console.error('usage: npm run new:app <slug> ["Name"]');
  process.exit(1);
}
const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const name = nameWords.join(" ") || slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const dir = join(APPS_DIR, slug);
if (!slug) { console.error(`apps: "${rawSlug}" does not produce a usable slug`); process.exit(1); }
if (existsSync(dir)) { console.error(`apps: "${slug}" already exists`); process.exit(1); }

mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, "meta.ts"),
  `import { defineApp } from "../types";
import cover from "./cover.png";
import icon from "./icon.png";

export default defineApp({
  name: ${JSON.stringify(name)},
  tagline: "What it does, in one line.",
  platform: "macOS",
  url: "https://example.com",
  date: "${new Date().toISOString().slice(0, 10)}",
  cover,
  icon,
});
`,
);
console.log(`apps: created src/apps/${slug}/meta.ts`);
console.log(`      drop the cover in as src/apps/${slug}/cover.png (3:2 works best) and the icon as icon.png, then it appears on /apps`);
console.log(`      (the registry is regenerated when the dev server starts, or with npm run crafts)`);
generateRegistry({ log: false });
