"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Craft } from "@/crafts/types";
import { formatDate, pad } from "@/lib/format";
import { CraftStage } from "./craft-stage";
import { ArrowUpRight } from "./icons";

const EAGER_COUNT = 6;

export function CraftCard({ craft, index }: { craft: Craft; index: number }) {
  const href = `/${craft.slug}`;
  return (
    <motion.article
      layout="position"
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      style={{ "--card-index": Math.min(index, 8) } as React.CSSProperties}
      className="card-in group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong"
    >
      <div className="relative aspect-[4/3]">
        {craft.cover ? (
          craft.cover.type === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={craft.cover.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={craft.cover.alt ?? craft.title}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- covers are author-supplied local files of unknown dimensions
            <img className="absolute inset-0 h-full w-full object-cover" src={craft.cover.src} alt={craft.cover.alt ?? craft.title} />
          )
        ) : (
          <CraftStage slug={craft.slug} preview eager={index < EAGER_COUNT} className="h-full w-full" />
        )}
        <Link
          href={href}
          aria-label={`Open ${craft.title}`}
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-line bg-surface/90 py-1 pl-2.5 pr-2 font-mono text-[11px] text-muted opacity-0 backdrop-blur transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
        >
          Open
          <ArrowUpRight size={13} />
        </Link>
      </div>
      <Link href={href} className="flex flex-col gap-1 border-t border-line px-4 pb-4 pt-3.5">
        <span className="flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-medium leading-snug text-ink">{craft.title}</h2>
          <span className="font-mono text-[11px] text-muted">{pad(craft.number)}</span>
        </span>
        <p className="text-[13px] leading-snug text-muted">{craft.description}</p>
        <span className="mt-2 flex items-center justify-between gap-3 font-mono text-[11px] text-muted">
          <span className="flex flex-wrap gap-x-2">
            {craft.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </span>
          <time dateTime={craft.date}>{formatDate(craft.date, "month")}</time>
        </span>
      </Link>
    </motion.article>
  );
}
