import { DesignGallery } from "./design-gallery";

export function DesignHome({ initialSlug }: { initialSlug?: string }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8">
      <h1 className="pt-5 text-[26px] font-medium leading-[1.1] tracking-tight text-ink sm:pt-10 sm:text-[40px]">
        UI design.
      </h1>
      <DesignGallery initialSlug={initialSlug} />
    </main>
  );
}
