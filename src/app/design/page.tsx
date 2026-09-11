import type { Metadata } from "next";
import { DesignHome } from "@/components/design-home";

export const metadata: Metadata = {
  title: "UI design",
  description: "Screens, mockups and interface explorations by Rizki Arsyad.",
  openGraph: { title: "UI design", url: "/design" },
};

export default function DesignPage() {
  return <DesignHome />;
}
