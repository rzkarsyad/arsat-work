"use client";

import Image from "next/image";
import { designs, designTagCounts } from "@/designs/catalog";
import { Gallery } from "./gallery";
import { ArrowUpRight } from "./icons";

export function DesignGallery({ initialSlug }: { initialSlug?: string }) {
  return (
    <Gallery
      items={designs}
      tags={designTagCounts().map(({ tag }) => tag)}
      initialSlug={initialSlug}
      basePath="/design"
      renderTile={(design) => (
        <Image
          src={design.image}
          alt={design.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          placeholder="blur"
          className="object-cover"
        />
      )}
      renderStage={(design) => (
        <div className="absolute inset-5 sm:inset-7">
          <Image src={design.image} alt={design.title} fill sizes="768px" priority className="object-contain" />
        </div>
      )}
      renderMeta={(design) =>
        design.source ? (
          <a href={design.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 transition-colors hover:text-ink">
            Open
            <ArrowUpRight size={12} />
          </a>
        ) : null
      }
    />
  );
}
