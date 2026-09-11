"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate as animateValue, motion, useAnimate, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { sendInquiry, type InquiryState } from "@/app/actions/inquiry";
import { foldAndFly } from "@/lib/paper-plane";
import { site } from "@/lib/site";
import { Close, Plane } from "./icons";

/** Real paper: fibres, a little roughness, faint crumples. WebGL, loaded only with the letter. */
const PaperTexture = dynamic(() => import("@paper-design/shaders-react").then((m) => m.PaperTexture), { ssr: false });

const field =
  "w-full border-0 border-b border-(--paper-line) bg-transparent px-0 py-1.5 text-[15px] outline-none focus-visible:outline-none focus:border-(--paper-ink)";

function Letter({ onSent, onClose }: { onSent: () => void; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(sendInquiry, null);
  const [scope, animate] = useAnimate();
  /** Once the server has accepted the letter, the writing is fixed. */
  const sealed = state?.ok === true;
  /** React resets the form after every action; on failure, the letter keeps what was written. */
  const kept = state && state.ok === false ? state.values : undefined;
  const reduceMotion = useReducedMotion();
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    first.current?.focus({ preventScroll: true });
  }, []);

  const stage = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  /**
   * The paper texture is a WebGL shader, but it only needs to draw once: its
   * first frame is baked into the sheet's background and the canvas is let go,
   * so nothing renders per frame and every folded clone carries the same paper.
   */
  const [texture, setTexture] = useState<string | null>(null);
  useEffect(() => {
    if (texture) return;
    let cancelled = false;
    let tries = 0;
    const grab = () => {
      if (cancelled) return;
      const canvas = sheet.current?.querySelector("canvas");
      if (canvas) {
        try {
          const url = canvas.toDataURL("image/png");
          // A canvas that has not drawn yet encodes to a tiny transparent PNG.
          if (url.length > 20000) {
            setTexture(url);
            return;
          }
        } catch {
          return;
        }
      }
      if (++tries < 90) requestAnimationFrame(grab);
    };
    requestAnimationFrame(grab);
    return () => {
      cancelled = true;
    };
  }, [texture]);

  /** Size of the lifted corner, in px. It breathes while the letter is open, as if in a draught. */
  const curl = useMotionValue(0);
  const curlClip = useMotionTemplate`polygon(0 0, 100% 0, 100% calc(100% - ${curl}px), calc(100% - ${curl}px) 100%, 0 100%)`;
  const curlSize = useMotionTemplate`${curl}px`;

  useEffect(() => {
    if (reduceMotion) {
      curl.set(40);
      return;
    }
    const lift = animateValue(curl, 42, { duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.35 });
    const breathe = animateValue(curl, [42, 52, 38, 56, 44, 42], { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.25 });
    return () => {
      lift.stop();
      breathe.stop();
    };
  }, [curl, reduceMotion]);

  useEffect(() => {
    if (!state || state.ok !== true) return;
    let cancelled = false;
    (async () => {
      try {
        if (!reduceMotion) {
          // The writing lifts off the page and the corner settles flat, then it folds.
          await Promise.all([
            animate("[data-part=fields]", { opacity: 0, y: -4 }, { duration: 0.2 }),
            animateValue(curl, 0, { duration: 0.3, ease: [0.4, 0, 0.2, 1] }),
          ]);
        }
        if (stage.current && sheet.current) await foldAndFly(stage.current, sheet.current, { reduceMotion: !!reduceMotion });
      } catch (error) {
        // The letter was accepted; a hiccup in the flourish must not strand it.
        console.error("[inquiry] send animation failed", error);
      }
      if (!cancelled) onSent();
    })();
    return () => {
      cancelled = true;
    };
  }, [state, animate, onSent, reduceMotion, curl]);

  useEffect(() => {
    if (state && state.ok === false) animate(scope.current, { x: [0, -7, 7, -5, 5, 0] }, { duration: 0.4 });
  }, [state, animate, scope]);

  return (
    <div className="w-full max-w-[420px]" style={{ perspective: 1400 }}>
      <motion.div
        ref={scope}
        initial={{ opacity: 0, y: 56, rotateX: 18, rotate: -1.5, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.18 } }}
        transition={{ type: "spring", visualDuration: 0.62, bounce: 0.16 }}
        className="letter relative"
      >
        {/* The sheet. Its clones are what fold; the writing sits on top. */}
        <motion.div
          ref={sheet}
          data-part="sheet"
          style={{ clipPath: curlClip, ...(texture ? { backgroundImage: `url(${texture})`, backgroundSize: "100% 100%", backgroundBlendMode: "normal" } : {}) }}
          className="paper pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]"
        >
          {texture ? null : (
          <PaperTexture
            className="absolute inset-0 h-full w-full"
            colorBack="#fcf9f2"
            colorFront="#e4dccb"
            contrast={0.22}
            roughness={0.3}
            fiber={0.2}
            fiberSize={0.18}
            crumples={0.06}
            crumpleSize={0.4}
            folds={0.05}
            foldCount={2}
            drops={0.14}
            seed={12}
            scale={0.9}
            webGlContextAttributes={{ preserveDrawingBuffer: true }}
          />
          )}
          {/* The lifted corner: the paper's back, lit along its curved edge, with its shadow on the page. */}
          <motion.div data-part="curl" style={{ width: curlSize, height: curlSize }} className="absolute bottom-0 right-0">
            <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)", background: "linear-gradient(135deg, rgba(0,0,0,0.16), rgba(0,0,0,0.04) 55%, rgba(0,0,0,0) 62%)" }} />
            <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)", background: "radial-gradient(120% 120% at 100% 100%, #d8cfbd 0%, #ece5d6 38%, #fbf8f1 62%, #ffffff 100%)", filter: "drop-shadow(-1px -1px 1px rgba(0,0,0,0.12))" }} />
          </motion.div>
        </motion.div>
        {/* The sheet's soft edge, drawn behind it so the curl can cut into it. */}
        <div aria-hidden className="paper-edge pointer-events-none absolute inset-0 -z-10 rounded-[10px]" />
        {/* Where the folding and the flight happen, in front of the sheet. */}
        <div ref={stage} data-part="stage" className="pointer-events-none absolute inset-0 z-20 text-canvas" style={{ perspective: 1400, transformStyle: "preserve-3d" }} />

        <form action={formAction} data-part="fields" className="relative z-10 px-7 pb-7 pt-6 text-[var(--paper-ink)]" aria-busy={pending}>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--paper-muted)]">To</p>
            <p className="mt-0.5 text-[15px] font-medium">{site.author}</p>
          </div>
          <div className="mt-7 flex flex-col gap-4">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--paper-muted)]">From</span>
              <input ref={first} name="name" required maxLength={80} autoComplete="name" placeholder="Your name" className={field} disabled={sealed} defaultValue={kept?.name} />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--paper-muted)]">Email</span>
              <input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className={field} disabled={sealed} defaultValue={kept?.email} />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--paper-muted)]">Message</span>
              <textarea
                name="message"
                required
                maxLength={2000}
                rows={5}
                placeholder="What are you working on?"
                className="ruled mt-1 w-full resize-none border-0 bg-transparent px-0 text-[15px] outline-none focus-visible:outline-none"
                disabled={sealed}
                defaultValue={kept?.message}
              />
            </label>
            {/* Honeypot: hidden from people, tempting to bots. */}
            <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p aria-live="polite" className="min-h-[1.25rem] text-[13px] text-[#b23a2a]">
              {state && state.ok === false ? state.error : null}
            </p>
            <button
              type="submit"
              disabled={pending || sealed}
              className="shrink-0 rounded-full bg-(color:--paper-ink) px-5 py-2 text-[13px] font-medium text-[#fbf8f1] transition-opacity disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>

        {sealed ? null : (
          <button
            type="button"
            data-part="close"
            onClick={onClose}
            aria-label="Close"
            className="absolute -right-3 -top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted shadow-md ring-1 ring-line transition-colors hover:text-ink"
          >
            <Close size={14} />
          </button>
        )}
      </motion.div>
    </div>
  );
}

/** The header link, the letter it opens, and the toast that follows a sent letter. */
export function Inquiry() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-ink"
      >
        Collab with me
      </button>

      <AnimatePresence>
        {open ? (
          <div role="dialog" aria-modal="true" aria-label="Send an inquiry" className="no-scrollbar fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8">
            <motion.button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-xl dark:bg-black/60"
            />
            <Letter
              key="letter"
              onClose={() => setOpen(false)}
              onSent={() => {
                setOpen(false);
                setToast(true);
              }}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.18 } }}
            transition={{ type: "spring", visualDuration: 0.45, bounce: 0.22 }}
            onClick={() => setToast(false)}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2.5 pl-3.5 pr-5 text-[13px] text-canvas shadow-xl"
          >
            <Plane size={16} />
            <span>
              <span className="font-medium">Sent.</span> I’ll get back to you as soon as possible.
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
