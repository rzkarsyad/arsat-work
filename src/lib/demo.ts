import { useEffect, useEffectEvent } from "react";

type Step = () => void | (() => void);

type Options = {
  /** Milliseconds between steps. Jittered ±15% per instance. */
  interval?: number;
  /** Milliseconds before the first step. */
  delay?: number;
};

/**
 * Runs a craft's self-demo step on a loose timer while `active` is true.
 *
 * The stage decides `active`: the craft is on screen, nobody is hovering it
 * or has just touched it, and the visitor has not asked for reduced motion.
 * A step may return a cleanup; it runs before the next step and when the demo
 * stops, so a half-finished gesture (a held press, a nudged button) is undone
 * the moment a real hand arrives. Timing is jittered per instance so a grid
 * of crafts never ticks in lockstep.
 */
export function useDemo(active: boolean, step: Step, { interval = 2400, delay = 900 }: Options = {}) {
  const run = useEffectEvent(step);

  useEffect(() => {
    if (!active) return;
    let undo: void | (() => void);
    let timer = 0;
    const jitter = 0.85 + Math.random() * 0.3;
    const tick = () => {
      undo?.();
      undo = run();
      timer = window.setTimeout(tick, interval * jitter);
    };
    timer = window.setTimeout(tick, delay + Math.random() * 700);
    return () => {
      window.clearTimeout(timer);
      undo?.();
    };
  }, [active, interval, delay]);
}
