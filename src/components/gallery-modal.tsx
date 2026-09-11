"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useIsPresent, type Variants } from "motion/react";
import { formatDate } from "@/lib/format";
import { spring } from "@/lib/motion";
import { ArrowLeft, ArrowRight, Close, Reset } from "./icons";

/** What the gallery needs to know about an item, whatever kind it is. */
export type GalleryItem = {
  slug: string;
  number: number;
  title: string;
  description: string;
  date: string;
  tags: readonly string[];
  /** width ÷ height of the tile. */
  ratio: number;
  notes?: string;
};

type Props<T extends GalleryItem> = {
  item: T;
  /** +1 when moving to a newer item, -1 to an older one. Sets the slide direction. */
  direction: 1 | -1;
  older?: T;
  newer?: T;
  onClose: () => void;
  /** `direction` is the way the content should slide: +1 towards newer, -1 towards older. */
  onNavigate: (slug: string, direction: 1 | -1) => void;
  renderStage: (item: T, runKey: number) => React.ReactNode;
  /**
   * When given, the media area takes exactly this proportion and the panel
   * hugs it, so the content reaches all four edges with no gap or letterbox.
   * Without it the stage keeps the default 4:3 / 3:2 frame.
   */
  stageRatio?: (item: T) => number | undefined;
  /** Extra links after the date, e.g. Code or Source. */
  renderMeta?: (item: T) => React.ReactNode;
  /** Show a Reset control that remounts the stage. */
  resettable?: boolean;
};

/**
 * Moving between items slides the content sideways inside the panel, the
 * way a pager does: the new item enters from the side you are heading to
 * while the old one leaves the other way, both with a short blur.
 */
const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 72, opacity: 0, filter: "blur(10px)" }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", visualDuration: 0.42, bounce: 0 },
      opacity: { duration: 0.28 },
      filter: { duration: 0.32 },
    },
  },
  exit: (direction: number) => ({
    x: direction * -72,
    opacity: 0,
    filter: "blur(10px)",
    transition: {
      x: { type: "spring", visualDuration: 0.36, bounce: 0 },
      opacity: { duration: 0.2 },
      filter: { duration: 0.2 },
    },
  }),
};

function IconButton({
  ref,
  label,
  onClick,
  disabled,
  children,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm ring-1 ring-line backdrop-blur transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-muted"
    >
      {children}
    </button>
  );
}

export function GalleryModal<T extends GalleryItem>({
  item,
  direction,
  older,
  newer,
  onClose,
  onNavigate,
  renderStage,
  renderMeta,
  stageRatio,
  resettable = false,
}: Props<T>) {
  const [run, setRun] = useState(0);
  /** The tile this popup grew out of. It shrinks back into that tile on close, wherever you navigated. */
  const [origin] = useState(item.slug);
  const closeButton = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  /** False once the popup is closing: it must stop catching clicks meant for the grid. */
  const present = useIsPresent();
  const ratio = stageRatio?.(item);
  const paragraphs =
    item.notes
      ?.split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);

  /** A new item starts at the top rather than inheriting the last one's scroll. */
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [item.slug]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft" && older) onNavigate(older.slug, -1);
      else if (event.key === "ArrowRight" && newer) onNavigate(newer.slug, 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [older, newer, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`item-title-${item.slug}`}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 ${present ? "" : "pointer-events-none"}`}
    >
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-xl dark:bg-black/60"
      />
      <motion.div
        layoutId={`tile-${origin}`}
        layout
        transition={spring}
        style={{
          borderRadius: 28,
          // A panel with its own stage ratio hugs the media, so a tall shot
          // narrows the panel instead of growing past the viewport.
          maxWidth: ratio ? `min(48rem, calc(72vh * ${ratio}))` : undefined,
        }}
        className={`relative flex max-h-full w-full flex-col overflow-hidden bg-surface shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] ring-1 ring-line ${
          ratio ? "" : "max-w-3xl"
        }`}
      >
        <div ref={scroller} className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={item.slug}
              data-slide="content"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div
                style={ratio ? { aspectRatio: ratio } : undefined}
                className={`relative shrink-0 overflow-hidden bg-stage ${ratio ? "" : "aspect-[4/3] sm:aspect-[3/2]"}`}
              >
                {renderStage(item, run)}
              </div>
              <div className="px-5 pb-16 pt-4 sm:px-7 sm:pb-16 sm:pt-5">
                <h2 id={`item-title-${item.slug}`} className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.description}</p>
                {paragraphs.length ? (
                  <div className="mt-5 flex max-w-prose flex-col gap-3 text-[15px] leading-relaxed text-ink/85">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                <p className="mt-6 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  {renderMeta?.(item)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls float over the panel, so scrolling never takes them away. */}
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          {resettable ? (
            <IconButton label="Reset" onClick={() => setRun((n) => n + 1)}>
              <Reset size={15} />
            </IconButton>
          ) : null}
          <IconButton ref={closeButton} label="Close" onClick={onClose}>
            <Close size={15} />
          </IconButton>
        </div>
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <IconButton label={older ? `Older: ${older.title}` : "Nothing older"} onClick={() => older && onNavigate(older.slug, -1)} disabled={!older}>
            <ArrowLeft size={15} />
          </IconButton>
          <IconButton label={newer ? `Newer: ${newer.title}` : "Nothing newer"} onClick={() => newer && onNavigate(newer.slug, 1)} disabled={!newer}>
            <ArrowRight size={15} />
          </IconButton>
        </div>
      </motion.div>
    </div>
  );
}
