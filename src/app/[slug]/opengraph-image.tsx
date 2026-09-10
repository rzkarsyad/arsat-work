import { ImageResponse } from "next/og";
import { entries, getEntry } from "@/crafts/catalog";
import { formatDate, pad } from "@/lib/format";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return entries.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const craft = getEntry(slug);
  const title = craft?.title ?? site.name;
  const eyebrow = craft ? `№ ${pad(craft.number)} · ${formatDate(craft.date).toUpperCase()}` : undefined;
  const footer = craft ? craft.tags.map((tag) => `#${tag}`).join("   ") : site.description;

  return new ImageResponse(<OgFrame eyebrow={eyebrow} title={title} footer={footer} />, {
    ...size,
    fonts: await ogFonts(),
  });
}
