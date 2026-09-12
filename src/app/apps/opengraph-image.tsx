import { ImageResponse } from "next/og";
import { apps } from "@/apps/catalog";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgFrame title="Apps I make." footer={`${apps.length} app${apps.length === 1 ? "" : "s"} by ${site.author}`} />,
    { ...size, fonts: await ogFonts() },
  );
}
