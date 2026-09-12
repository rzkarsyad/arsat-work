"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import type { Photo } from "@/about/photos";
import { spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { ArrowUpRight } from "./icons";

/** Where each print lies, back to front: a lean in degrees and offsets in % of the pile's width. */
const SLOTS = [
  { rotate: -4, left: 0, top: 0 },
  { rotate: 3, left: 38, top: 20 },
  { rotate: -1.5, left: 10, top: 44 },
];

const print = {
  hidden: (rotate: number) => ({ opacity: 0, y: 14, rotate: rotate * 1.8 }),
  shown: (rotate: number) => ({ opacity: 1, y: 0, rotate }),
};

/**
 * A few prints dropped on the page. Hover lifts and straightens one; a click
 * brings it to the front, the way you would leaf through a stack.
 */
export function PhotoPile({ photos, className = "" }: { photos: Photo[]; className?: string }) {
  // Indices back to front. Bringing a print forward moves it to the end.
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const bringForward = (i: number) => setOrder((current) => [...current.filter((x) => x !== i), i]);

  return (
    <div className={className}>
      <motion.div
        data-pile
        className="relative aspect-[5/6] w-full"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { delayChildren: 0.1, staggerChildren: 0.09 } } }}
      >
        {photos.map((photo, i) => {
          const slot = SLOTS[i % SLOTS.length];
          return (
            <motion.button
              key={photo.src.src}
              type="button"
              aria-label={photo.alt}
              onClick={() => bringForward(i)}
              custom={slot.rotate}
              variants={print}
              whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              style={{
                position: "absolute",
                left: `${slot.left}%`,
                top: `${slot.top}%`,
                width: "58%",
                zIndex: order.indexOf(i) + 1,
                transformOrigin: "50% 60%",
              }}
              className="cursor-pointer rounded-[3px] bg-[#fbfaf7] p-[6%] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
            >
              <Image
                src={photo.src}
                alt=""
                sizes="(min-width: 1024px) 15rem, 55vw"
                placeholder="blur"
                draggable={false}
                className="block aspect-square h-auto w-full select-none object-cover"
              />
            </motion.button>
          );
        })}
      </motion.div>
      <a
        href={site.links.instagram}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 rounded-sm text-[12px] text-muted transition-colors hover:text-ink"
      >
        More on Instagram
        <ArrowUpRight size={12} />
      </a>
    </div>
  );
}
