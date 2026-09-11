#!/usr/bin/env node
// Usage: npm run new:design <slug> ["Title"]
// Creates src/designs/<slug>/meta.ts; drop the shot in as cover.png (or edit the import).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DESIGNS_DIR, generateRegistry } from "./generate-registry.mjs";

const [rawSlug, ...titleWords] = process.argv.slice(2);
if (!rawSlug) {
  console.error('usage: npm run new:design <slug> ["Title"]');
  process.exit(1);
}
const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const title = titleWords.join(" ") || slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const dir = join(DESIGNS_DIR, slug);
if (!slug) { console.error(`designs: "${rawSlug}" does not produce a usable slug`); process.exit(1); }
if (existsSync(dir)) { console.error(`designs: "${slug}" already exists`); process.exit(1); }

mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, "meta.ts"),
  `import { defineDesign } from "../types";
import cover from "./cover.png";

export default defineDesign({
  title: ${JSON.stringify(title)},
  description: "What this design is, in one line.",
  date: "${new Date().toISOString().slice(0, 10)}",
  tags: ["mobile"],
  image: cover,
});
`,
);
console.log(`designs: created src/designs/${slug}/meta.ts`);
console.log(`         drop the shot in as src/designs/${slug}/cover.png, then it appears at /design/${slug}`);
console.log(`         (the registry is regenerated when the dev server starts, or with npm run crafts)`);
generateRegistry({ log: false });
