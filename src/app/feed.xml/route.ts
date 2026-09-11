import { entries } from "@/crafts/catalog";
import { designs } from "@/designs/catalog";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

function escape(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ESCAPES[char]);
}

export function GET() {
  const posts = [
    ...entries.map((craft) => ({ ...craft, url: `${site.url}/${craft.slug}` })),
    ...designs.map((design) => ({ ...design, url: `${site.url}/design/${design.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const items = posts
    .map((craft) => {
      const url = craft.url;
      return [
        "<item>",
        `<title>${escape(craft.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${new Date(`${craft.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `<description>${escape(craft.description)}</description>`,
        ...craft.tags.map((tag) => `<category>${tag}</category>`),
        "</item>",
      ].join("");
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${escape(site.name)}</title>` +
    `<link>${site.url}</link>` +
    `<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>` +
    `<description>${escape(site.description)}</description>` +
    `<language>en</language>` +
    items +
    `</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
