import type { Metadata } from "next";
import { DesignHome } from "@/components/design-home";
import { openGraphBase } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "UI design",
  description: "Screens, mockups and interface explorations by Rizki Arsyad.",
  openGraph: { ...openGraphBase, title: "UI design", url: "/design" },
};

export default function DesignPage() {
  return <DesignHome />;
}
