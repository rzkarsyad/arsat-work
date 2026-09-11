"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { sendInquiry } from "@/app/actions/inquiry";
import { spring } from "@/lib/motion";
import { Close, Mail } from "./icons";

const subscribe = () => () => {};

/** The header's "Get in touch" link and the dialog it opens. */
export function Contact() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      {/* An envelope on phones, where the header has no room for the words; the text from sm up. */}
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Get in touch"
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 sm:w-auto sm:px-3 sm:hover:bg-transparent dark:sm:hover:bg-transparent"
      >
        <Mail className="sm:hidden" />
        <span className="hidden text-[13px] sm:inline">Get in touch</span>
      </button>
      {mounted
        ? createPortal(
            <AnimatePresence>{open ? <ContactDialog key="contact" onClose={close} /> : null}</AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

function ContactDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
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
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.18, ease: "easeOut" } }}
        transition={spring}
        className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl bg-surface p-6 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] ring-1 ring-line sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-[20px] font-medium tracking-tight text-ink">
              Get in touch
            </h2>
            <p className="mt-1 text-[14px] text-muted">Have a project in mind? Send a note and I’ll reply by email.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
          >
            <Close />
          </button>
        </div>
        <ContactForm onDone={onClose} />
      </motion.div>
    </div>
  );
}

const INPUT =
  "mt-1.5 block w-full rounded-lg border border-line-strong bg-canvas px-3 py-2 text-[15px] text-ink placeholder:text-muted/60";
const BUTTON =
  "inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60";

function ContactForm({ onDone }: { onDone: () => void }) {
  const [state, action] = useActionState(sendInquiry, null);
  const first = useRef<HTMLInputElement>(null);
  // React resets the form after the action; on failure the action hands the writing back.
  const kept = state && !state.ok ? state.values : undefined;

  useEffect(() => {
    first.current?.focus();
  }, []);

  if (state?.ok) {
    return (
      <div className="mt-6">
        <p role="status" className="text-[15px] leading-[1.5] text-ink">
          Sent. I’ll get back to you as soon as possible.
        </p>
        <button type="button" onClick={onDone} className={`${BUTTON} mt-5`}>
          Done
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="relative mt-5 space-y-4">
      <label className="block text-[13px] text-muted">
        Name
        <input ref={first} name="name" type="text" required maxLength={80} autoComplete="name" defaultValue={kept?.name} className={INPUT} />
      </label>
      <label className="block text-[13px] text-muted">
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" defaultValue={kept?.email} className={INPUT} />
      </label>
      <label className="block text-[13px] text-muted">
        Message
        <textarea name="message" required maxLength={2000} rows={5} defaultValue={kept?.message} className={`${INPUT} resize-none`} />
      </label>
      {/* Honeypot: off screen and out of the tab order; anything typed here marks the note as spam. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <SubmitButton />
        {state && !state.ok ? (
          <p role="alert" className="text-[13px] text-accent">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={BUTTON}>
      {pending ? "Sending…" : "Send"}
    </button>
  );
}
