import { ImageResponse } from "next/og";
import { entries, getEntry } from "@/crafts/catalog";
import { formatDate } from "@/lib/format";
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
  return new ImageResponse(
    <OgFrame
      eyebrow={craft ? formatDate(craft.date) : undefined}
      title={craft?.title ?? site.name}
      footer={craft ? craft.tags.join(" · ") : site.description}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
