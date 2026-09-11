"use client";

import { crafts, tagCounts } from "@/crafts";
import type { Craft } from "@/crafts/types";
import { site } from "@/lib/site";
import { CraftStage } from "./craft-stage";
import { Gallery } from "./gallery";
import { ArrowUpRight } from "./icons";

/** Tiles mount their craft immediately up to this index; the rest wait for scroll. */
const EAGER = 8;

function TileContent({ craft, index }: { craft: Craft; index: number }) {
  if (craft.cover?.type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={craft.cover.src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={craft.cover.alt ?? craft.title}
      />
    );
  }
  if (craft.cover) {
    // eslint-disable-next-line @next/next/no-img-element -- covers are author-supplied local files of unknown dimensions
    return <img className="absolute inset-0 h-full w-full object-cover" src={craft.cover.src} alt={craft.cover.alt ?? craft.title} />;
  }
  return <CraftStage slug={craft.slug} preview eager={index < EAGER} className="absolute inset-0" />;
}

export function CraftGallery({ initialSlug }: { initialSlug?: string }) {
  return (
    <Gallery
      items={crafts}
      tags={tagCounts().map(({ tag }) => tag)}
      initialSlug={initialSlug}
      basePath=""
      resettable
      renderTile={(craft, index) => <TileContent craft={craft} index={index} />}
      renderStage={(craft, run) => <CraftStage slug={craft.slug} eager runKey={run} padding={32} className="absolute inset-0" />}
      renderMeta={(craft) =>
        site.repo ? (
          <a
            href={`${site.repo}/tree/main/src/crafts/${craft.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
          >
            Code
            <ArrowUpRight size={12} />
          </a>
        ) : null
      }
    />
  );
}
