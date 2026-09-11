import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgFrame eyebrow="About" title="Hi, I’m Rizki." footer={`${site.role}, ${site.location}`} />,
    { ...size, fonts: await ogFonts() },
  );
}
