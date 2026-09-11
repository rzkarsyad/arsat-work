import type { Metadata } from "next";
import { About } from "@/components/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.author} is a product designer based in ${site.location}, working on web, mobile and SaaS products.`,
  openGraph: { title: "About", url: "/about" },
};

export default function AboutPage() {
  return <About />;
}
