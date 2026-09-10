"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { getCraft } from "@/crafts";

type Props = {
  slug: string;
  /** Rendered inside an index tile. Passed through to the craft. */
  preview?: boolean;
  /** Mount immediately instead of waiting until the stage scrolls into view. */
  eager?: boolean;
  /** Change to remount the craft (the popup's Reset control). */
  runKey?: number;
  /** Breathing room kept around the craft when it has to scale down. */
  padding?: number;
  /**
   * The stage has no position of its own so it can fill whatever the caller
   * positions it in — pass `absolute inset-0`, not a size of your own.
   */
  className?: string;
};

/**
 * Centres its child and scales it down (never up) so a craft with a fixed
 * natural size fits a small tile. Measures layout size, which transforms do
 * not affect, so there is no feedback loop.
 */
function Fit({ children, padding }: { children: React.ReactNode; padding: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const observer = new ResizeObserver(() => {
      const width = o.clientWidth - padding * 2;
      const height = o.clientHeight - padding * 2;
      const natural = { width: i.offsetWidth, height: i.offsetHeight };
      if (width <= 0 || height <= 0 || !natural.width || !natural.height) return;
      setScale(Math.min(1, width / natural.width, height / natural.height));
    });
    observer.observe(o);
    observer.observe(i);
    return () => observer.disconnect();
  }, [padding]);

  return (
    <div ref={outer} className="absolute inset-0 flex items-center justify-center">
      {/* shrink-0 keeps the craft at its natural size so it is scaled, never squeezed into wrapping. */}
      <div ref={inner} className="shrink-0" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

export function CraftStage({ slug, preview = false, eager = false, runKey = 0, padding = 20, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "240px 0px" });
  const craft = getCraft(slug);
  if (!craft) return null;

  const Component = craft.component;
  const mounted = eager || inView;

  return (
    <div ref={ref} className={`overflow-hidden bg-stage ${className}`}>
      {mounted ? (
        <Fit padding={padding}>
          <Component key={runKey} preview={preview} />
        </Fit>
      ) : null}
    </div>
  );
}
