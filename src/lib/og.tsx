import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "src", "app", "fonts");

export async function ogFonts() {
  const [serifItalic, sans, sansMedium, mono] = await Promise.all([
    readFile(join(FONT_DIR, "InstrumentSerif-Italic.ttf")),
    readFile(join(FONT_DIR, "Geist-Regular.ttf")),
    readFile(join(FONT_DIR, "Geist-Medium.ttf")),
    readFile(join(FONT_DIR, "GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Instrument Serif", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Geist", data: sans, style: "normal" as const, weight: 400 as const },
    { name: "Geist", data: sansMedium, style: "normal" as const, weight: 500 as const },
    { name: "Geist Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

const INK = "#171614";
const MUTED = "#6b6862";
const ACCENT = "#e4552b";

export function OgFrame({
  eyebrow,
  title,
  footer,
  titleSerif = false,
}: {
  eyebrow?: string;
  title: string;
  footer: string;
  titleSerif?: boolean;
}) {
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
        backgroundImage: "radial-gradient(rgba(23,22,20,0.16) 2px, transparent 2px)",
        backgroundSize: "26px 26px",
        color: INK,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 22, height: 22, borderRadius: 999, background: ACCENT }} />
        <div style={{ display: "flex", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 46, lineHeight: 1 }}>
          Craft
        </div>
        <div style={{ display: "flex", fontSize: 26, color: MUTED }}>{`by ${site.author}`}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {eyebrow ? (
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: MUTED, letterSpacing: 2 }}>
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontFamily: titleSerif ? "Instrument Serif" : "Geist",
            fontStyle: titleSerif ? "italic" : "normal",
            fontWeight: titleSerif ? 400 : 500,
            fontSize: titleSerif ? 132 : 88,
            letterSpacing: titleSerif ? 0 : -3,
            lineHeight: 1.02,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: MUTED }}>{footer}</div>
      </div>
    </div>
  );
}
