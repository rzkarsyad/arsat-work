#!/usr/bin/env node
// Usage: npm run new <slug> ["Title"]
// Creates src/crafts/<slug>/{meta.ts,craft.tsx} and regenerates the registry.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CRAFTS_DIR, generateRegistry } from "./generate-registry.mjs";

const [rawSlug, ...titleWords] = process.argv.slice(2);
if (!rawSlug) {
  console.error('usage: npm run new <slug> ["Title"]');
  process.exit(1);
}

const slug = rawSlug
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const words = slug.split("-").filter(Boolean);
const capitalised = words.map((w) => w[0].toUpperCase() + w.slice(1));
const title = titleWords.join(" ") || capitalised.join(" ");
const componentName = capitalised.join("");
const dir = join(CRAFTS_DIR, slug);

if (!slug) {
  console.error(`crafts: "${rawSlug}" does not produce a usable slug`);
  process.exit(1);
}
if (existsSync(dir)) {
  console.error(`crafts: "${slug}" already exists`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, "meta.ts"),
  `import { defineCraft } from "../types";

export default defineCraft({
  title: ${JSON.stringify(title)},
  description: "What this exploration is about, in one line.",
  date: "${today}",
  tags: ["experiment"],
  // ratio: 0.8, // optional tile proportion on the index, width ÷ height (default 1)
});
`,
);
writeFileSync(
  join(dir, "craft.tsx"),
  `"use client";

import type { CraftProps } from "../types";

export default function ${componentName}({ preview }: CraftProps) {
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-4 text-sm text-ink">
      ${title}
      {preview ? " (preview)" : null}
    </div>
  );
}
`,
);

generateRegistry({ log: false });
console.log(`crafts: created src/crafts/${slug}/`);
console.log(`        edit meta.ts and craft.tsx, then open http://localhost:3000/${slug}`);
