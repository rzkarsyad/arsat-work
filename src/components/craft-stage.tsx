"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { getCraft } from "@/crafts";
import { Reset } from "./icons";

type Props = {
  slug: string;
  /** Rendered inside an index card. Passed through to the craft. */
  preview?: boolean;
  /** Mount immediately instead of waiting until the stage scrolls into view. */
  eager?: boolean;
  /** Show a reset control that remounts the craft. */
  controls?: boolean;
  /**
   * Sizing for the stage. It is always `relative` so the craft can fill it, so
   * pass size/shape utilities (`h-full w-full`, `aspect-[4/3] rounded-3xl`)
   * rather than `absolute`, which would collide with that.
   */
  className?: string;
};

export function CraftStage({ slug, preview = false, eager = false, controls = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "240px 0px" });
  const [run, setRun] = useState(0);
  const craft = getCraft(slug);
  if (!craft) return null;

  const Component = craft.component;
  const mounted = eager || inView;

  return (
    <div ref={ref} className={`stage relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {mounted ? <Component key={run} preview={preview} /> : null}
      </div>
      {controls ? (
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 py-1.5 font-mono text-[11px] text-muted backdrop-blur transition-colors hover:text-ink"
        >
          <Reset size={13} />
          Reset
        </button>
      ) : null}
    </div>
  );
}
