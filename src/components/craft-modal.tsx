"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useIsPresent, type Variants } from "motion/react";
import type { CraftEntry } from "@/crafts/types";
import { formatDate } from "@/lib/format";
import { spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { CraftStage } from "./craft-stage";
import { ArrowLeft, ArrowRight, ArrowUpRight, Close, Reset } from "./icons";

type Props = {
  craft: CraftEntry;
  /** +1 when moving to a newer craft, -1 to an older one. Sets the slide direction. */
  direction: 1 | -1;
  older?: CraftEntry;
  newer?: CraftEntry;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

/**
 * Moving between crafts slides the content sideways inside the panel, the
 * way a pager does: the new craft enters from the side you are heading to
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

export function CraftModal({ craft, direction, older, newer, onClose, onNavigate }: Props) {
  const [run, setRun] = useState(0);
  /** The tile this popup grew out of. It shrinks back into that tile on close, wherever you navigated. */
  const [origin] = useState(craft.slug);
  const closeButton = useRef<HTMLButtonElement>(null);
  /** False once the popup is closing: it must stop catching clicks meant for the grid. */
  const present = useIsPresent();
  const paragraphs =
    craft.notes
      ?.split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft" && older) onNavigate(older.slug);
      else if (event.key === "ArrowRight" && newer) onNavigate(newer.slug);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [older, newer, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`craft-title-${craft.slug}`}
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
        layoutId={`craft-${origin}`}
        layout
        transition={spring}
        style={{ borderRadius: 28 }}
        className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden bg-surface shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] ring-1 ring-line"
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-stage sm:aspect-[3/2]">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={craft.slug}
              data-slide="stage"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <CraftStage slug={craft.slug} eager runKey={run} padding={32} className="absolute inset-0" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute right-3 top-3 flex gap-2">
            <IconButton label="Reset" onClick={() => setRun((n) => n + 1)}>
              <Reset size={15} />
            </IconButton>
            <IconButton ref={closeButton} label="Close" onClick={onClose}>
              <Close size={15} />
            </IconButton>
          </div>
        </div>

        <div className="relative overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={craft.slug}
              data-slide="text"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              className="px-5 pb-5 pr-28 pt-4 sm:px-7 sm:pb-7 sm:pr-32 sm:pt-5"
            >
              <h2 id={`craft-title-${craft.slug}`} className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
                {craft.title}
              </h2>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{craft.description}</p>
              {paragraphs.length ? (
                <div className="mt-5 flex max-w-prose flex-col gap-3 text-[15px] leading-relaxed text-ink/85">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              <p className="mt-6 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
                <time dateTime={craft.date}>{formatDate(craft.date)}</time>
                {site.repo ? (
                  <a
                    href={`${site.repo}/tree/main/src/crafts/${craft.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
                  >
                    Code
                    <ArrowUpRight size={12} />
                  </a>
                ) : null}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="absolute right-5 top-4 flex gap-2 sm:right-7 sm:top-5">
            <IconButton label={older ? `Older: ${older.title}` : "No older craft"} onClick={() => older && onNavigate(older.slug)} disabled={!older}>
              <ArrowLeft size={15} />
            </IconButton>
            <IconButton label={newer ? `Newer: ${newer.title}` : "No newer craft"} onClick={() => newer && onNavigate(newer.slug)} disabled={!newer}>
              <ArrowRight size={15} />
            </IconButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
