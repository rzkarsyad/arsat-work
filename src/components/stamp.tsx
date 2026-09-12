"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/about/photos";
import { STAMP_RATIO, paperGrain, stampMask } from "@/lib/stamp";

const MASK = stampMask();
const GRAIN = paperGrain();

/**
 * The stamp itself: perforated paper, the photo inside its margins and two
 * small printed labels. The shadow lives on the wrapper so it follows the
 * notches; `children` lets the opened stamp add its sheen on top.
 */
export function Stamp({ photo, sizes, children }: { photo: Photo; sizes: string; children?: ReactNode }) {
  return (
    <div
      data-stamp
      className="@container relative w-full"
      style={{ aspectRatio: STAMP_RATIO, filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))" }}
    >
      <div
        className="absolute inset-0 select-none bg-[#f6f3ec] text-[#3a3733]"
        style={{ WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
      >
        <div className="absolute inset-x-[9%] top-[13%] bottom-[13%] overflow-hidden bg-[#e9e4d8]">
          {/* The source files are small 640px JPEGs; serving them as-is means the
              opened stamp reuses the bytes the pile already loaded, so it never
              shows a placeholder. */}
          <Image
            src={photo.src}
            alt={photo.alt}
            sizes={sizes}
            placeholder="blur"
            unoptimized
            draggable={false}
            className="block h-full w-full object-cover"
            style={{ objectPosition: photo.focus ?? "50% 50%" }}
          />
        </div>
        <span className="absolute left-[9%] top-[5.5%] text-[4.4cqw] font-medium uppercase leading-none tracking-[0.14em]">
          {photo.title}
        </span>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        {children}
      </div>
    </div>
  );
}
