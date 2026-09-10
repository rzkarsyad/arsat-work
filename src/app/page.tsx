import { CraftGrid } from "@/components/craft-grid";
import { entries, lastUpdated } from "@/crafts/catalog";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
      <section className="pb-10 pt-8 sm:pb-14 sm:pt-16">
        <h1 className="max-w-3xl text-[2.4rem] font-medium leading-[1.02] tracking-[-0.025em] text-ink sm:text-[3.6rem]">
          Interaction experiments, UI details &amp;{" "}
          <em className="font-serif font-normal italic tracking-normal text-accent">small delights</em>.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          A personal playground by {site.author}. New explorations land here as they happen, and every
          one runs live — hover, press, drag.
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">
          {entries.length} crafts
          {lastUpdated ? ` · updated ${formatDate(lastUpdated)}` : ""}
        </p>
      </section>
      <CraftGrid />
    </main>
  );
}
