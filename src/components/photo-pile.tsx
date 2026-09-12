"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/about/photos";
import { spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { ArrowUpRight } from "./icons";
import { Stamp } from "./stamp";

/** Where each stamp lies, back to front: a lean in degrees and offsets in % of the pile's width. */
const SLOTS = [
  { rotate: -14, left: 0, top: 2 },
  { rotate: 9, left: 44, top: 14 },
  { rotate: -5, left: 16, top: 40 },
];
const STAMP_WIDTH = 52; // % of the pile's width; the stamp is 4:5

type Origin = { index: number; cx: number; cy: number; width: number; viaKeyboard: boolean };

const subscribe = () => () => {};

/**
 * A few stamps dropped on the page. Drag one around (it comes to the front),
 * hover to pick it out of the pile, click to open it large with a tilt and a
 * sheen that follow the pointer.
 */
export function PhotoPile({ photos, className = "" }: { photos: Photo[]; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<Origin | null>(null);
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const dragged = useRef(false);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const bringForward = (i: number) => setOrder((current) => [...current.filter((x) => x !== i), i]);

  const openStamp = (i: number, el: HTMLElement, viaKeyboard: boolean) => {
    const rect = el.getBoundingClientRect();
    setHovered(null);
    setOpen({ index: i, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, width: el.offsetWidth, viaKeyboard });
  };

  return (
    <div className={className}>
      <div ref={container} data-pile className="relative aspect-[5/6] w-full">
        {photos.map((photo, i) => {
          const slot = SLOTS[i % SLOTS.length];
          const dimmed = hovered !== null && hovered !== i;
          const away = open?.index === i;
          return (
            <motion.div
              key={photo.src.src}
              drag
              dragConstraints={container}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={() => {
                dragged.current = true;
                bringForward(i);
              }}
              onDragEnd={() => {
                window.setTimeout(() => (dragged.current = false), 0);
              }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
              onTap={() => {
                if (dragged.current) return;
                const el = slots.current[i];
                if (!el) return;
                bringForward(i);
                openStamp(i, el, false);
              }}
              initial={{ rotate: slot.rotate * 1.6 }}
              animate={{ rotate: slot.rotate }}
              transition={{ ...spring, delay: entered ? 0 : i * 0.09 }}
              style={{
                position: "absolute",
                left: `${slot.left}%`,
                top: `${slot.top}%`,
                width: `${STAMP_WIDTH}%`,
                zIndex: order.indexOf(i) + 1,
                touchAction: "none",
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                ref={(el) => {
                  slots.current[i] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open ${photo.title}`}
                data-stamp-slot={i}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openStamp(i, e.currentTarget, true);
                  }
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: away ? 0 : 1,
                  y: 0,
                  scale: hovered === i ? 1.05 : 1,
                  filter: dimmed ? "blur(6px)" : "blur(0px)",
                }}
                transition={{ ...spring, delay: entered ? 0 : i * 0.09 }}
                className="relative rounded-sm"
              >
                <Stamp photo={photo} sizes="(min-width: 1024px) 13rem, 45vw" />
                <AnimatePresence>
                  {hovered === i && !open ? (
                    <motion.span
                      data-tooltip
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.16 }}
                      style={{ rotate: -slot.rotate }}
                      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1c1b19] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
                    >
                      {photo.title}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <a
        href={site.links.instagram}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 rounded-sm text-[12px] text-muted transition-colors hover:text-ink"
      >
        More on Instagram
        <ArrowUpRight size={12} />
      </a>
      {mounted
        ? createPortal(
            <AnimatePresence
              onExitComplete={() => {
                // Escape switches the browser into keyboard mode, which would
                // paint a focus ring on a stamp the pointer opened; hand focus
                // back only to keyboard users.
                const el = open ? slots.current[open.index] : null;
                if (el && open?.viaKeyboard) el.focus({ preventScroll: true });
                else el?.blur();
                setOpen(null);
                setClosing(false);
              }}
            >
              {open && !closing ? (
                <StampOverlay
                  key={open.index}
                  photo={photos[open.index]}
                  origin={open}
                  rotate={SLOTS[open.index % SLOTS.length].rotate}
                  onClose={() => setClosing(true)}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

/** The opened stamp: flies in from where it lay, tilts and shimmers with the pointer, flies back on close. */
function StampOverlay({ photo, origin, rotate, onClose }: { photo: Photo; origin: Origin; rotate: number; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [size] = useState(() => {
    const width = Math.min(window.innerWidth * 0.78, window.innerHeight * 0.62 * 0.8);
    return { width, x: origin.cx - window.innerWidth / 2, y: origin.cy - window.innerHeight / 2, scale: origin.width / width };
  });
  const tiltX = useSpring(useMotionValue(0), { stiffness: 140, damping: 18, mass: 0.6 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 140, damping: 18, mass: 0.6 });
  const sheenX = useSpring(useMotionValue(50), { stiffness: 140, damping: 20 });
  const sheenY = useSpring(useMotionValue(40), { stiffness: 140, damping: 20 });
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.85), rgba(255,255,255,0) 58%)`;
  const iridescence = useMotionTemplate`linear-gradient(calc(${sheenX} * 1.8deg), rgba(255,120,190,0.16), rgba(120,220,255,0.16) 45%, rgba(255,230,120,0.16))`;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const px = event.clientX / window.innerWidth;
      const py = event.clientY / window.innerHeight;
      tiltY.set((px - 0.5) * 22);
      tiltX.set((0.5 - py) * 22);
      sheenX.set(px * 100);
      sheenY.set(py * 100);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointermove", onMove);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onMove);
    };
  }, [onClose, reduceMotion, tiltX, tiltY, sheenX, sheenY]);

  const flight = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: size.x, y: size.y, scale: size.scale, rotate },
        animate: { x: 0, y: 0, scale: 1, rotate: 0 },
        exit: { x: size.x, y: size.y, scale: size.scale, rotate, transition: { ...spring, visualDuration: 0.34 } },
      };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      data-stamp-overlay
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-[#161513]/92 backdrop-blur-xl"
      />
      <motion.div
        data-open-stamp
        {...flight}
        transition={spring}
        style={{ width: size.width, rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
        className="relative"
      >
        <Stamp photo={photo} sizes="80vw">
          <motion.div aria-hidden="true" data-sheen className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light" style={{ background: sheen }} />
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50 mix-blend-color-dodge" style={{ background: iridescence }} />
        </Stamp>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.25 } }}
        exit={{ opacity: 0 }}
        className="absolute bottom-8 left-0 right-0 text-center text-[12px] tracking-wide text-white/55"
      >
        Click anywhere or press Esc
      </motion.p>
    </div>
  );
}
