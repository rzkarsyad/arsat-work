import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { designs, getDesign } from "@/designs/catalog";
import { formatDate } from "@/lib/format";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return designs.map(({ slug }) => ({ slug }));
}

/** The shot itself, inlined from the design's folder so the build needs no network. */
async function shotDataUrl(slug: string): Promise<string | null> {
  try {
    const dir = join(process.cwd(), "src", "designs", slug);
    const file = (await readdir(dir)).find((name) => /\.(png|jpe?g)$/i.test(name));
    if (!file) return null;
    const data = await readFile(join(dir, file));
    return `data:image/${/\.png$/i.test(file) ? "png" : "jpeg"};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const design = getDesign(slug);
  const shot = design ? await shotDataUrl(slug) : null;
  const fonts = await ogFonts();
  if (!design || !shot) {
    return new ImageResponse(<OgFrame eyebrow={design ? formatDate(design.date) : undefined} title={design?.title ?? site.name} footer="UI design" />, { ...size, fonts });
  }
  const landscape = design.ratio >= 1;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3f2ee", color: "#171614", fontFamily: "Geist" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: landscape ? 420 : 560, padding: "56px 48px 56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: "#e4552b" }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 500 }}>{site.brand}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 20, color: "#6b6862" }}>UI design</div>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 500, letterSpacing: -2, lineHeight: 1.05 }}>{design.title}</div>
            <div style={{ display: "flex", fontSize: 20, color: "#6b6862" }}>{formatDate(design.date)}</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <img src={shot} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 18, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)" }} />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
