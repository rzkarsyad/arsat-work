import type { Metadata } from "next";
import { AppGrid } from "@/components/app-grid";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apps",
  description: `Apps and products made by ${site.author}.`,
  openGraph: { title: "Apps", url: "/apps" },
};

export default function AppsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <h1 className="pt-5 text-[26px] font-medium leading-[1.1] tracking-tight text-ink sm:pt-10 sm:text-[40px]">
        Apps I make.
      </h1>
      <AppGrid />
    </main>
  );
}
