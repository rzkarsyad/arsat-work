import { ImageResponse } from "next/og";
import { entries } from "@/crafts/catalog";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgFrame
      title="Small delights."
      titleSerif
      footer={`${entries.length} interaction experiments, UI details & prototypes`}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
