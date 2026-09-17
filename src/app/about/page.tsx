import type { Metadata } from "next";
import { About } from "@/components/about";
import { JsonLd } from "@/components/json-ld";
import { aboutJsonLd } from "@/lib/jsonld";
import { aboutDescription, openGraphBase } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  openGraph: { ...openGraphBase, title: "About", url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <About />
    </>
  );
}
