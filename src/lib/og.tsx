import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "src", "app", "fonts");

export async function ogFonts() {
  const [regular, medium] = await Promise.all([
    readFile(join(FONT_DIR, "Geist-Regular.ttf")),
    readFile(join(FONT_DIR, "Geist-Medium.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Geist", data: medium, style: "normal" as const, weight: 500 as const },
  ];
}

const INK = "#171614";
const MUTED = "#6b6862";
const ACCENT = "#e4552b";

export function OgFrame({ eyebrow, title, footer }: { eyebrow?: string; title: string; footer?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#faf9f6",
        color: INK,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 20, height: 20, borderRadius: 999, background: ACCENT }} />
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, letterSpacing: -0.5 }}>Craft</div>
        <div style={{ display: "flex", fontSize: 26, color: MUTED }}>{`by ${site.author}`}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {eyebrow ? <div style={{ display: "flex", fontSize: 24, color: MUTED }}>{eyebrow}</div> : null}
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 500,
            letterSpacing: -3.5,
            lineHeight: 1.02,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {footer ? <div style={{ display: "flex", fontSize: 24, color: MUTED }}>{footer}</div> : null}
      </div>
    </div>
  );
}
