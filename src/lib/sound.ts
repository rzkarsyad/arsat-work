/**
 * UI sounds for arsat.work: a soft "bloop" when something opens, its falling
 * twin when it closes, and a quieter bloop when stepping between items.
 *
 * Everything is synthesized with Web Audio, so there are no files to load.
 * The audio context is created on the first sound, which always happens
 * inside a click or key press, because browsers refuse to start audio
 * before the visitor has interacted with the page.
 */

type Kind = "open" | "close" | "step";

const STORAGE_KEY = "arsat:sound-muted";
const MASTER = 0.7;
/** Holding an arrow key repeats navigation; keep the steps from stacking. */
const STEP_GAP_MS = 70;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let lastStep = 0;
let muted: boolean | null = null;
const listeners = new Set<() => void>();

// ---------- mute preference ----------

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  if (muted === null) {
    try {
      muted = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Private windows can refuse storage; the choice still holds for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeMuted(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---------- synthesis ----------

type Tone = {
  type: OscillatorType;
  from: number;
  to: number;
  over: number;
  peak: number;
  attack: number;
  decay: number;
  lowpass: number;
};

function tone(ctx: BaseAudioContext, out: AudioNode, t: number, o: Tone, level: number) {
  const osc = ctx.createOscillator();
  osc.type = o.type;
  osc.frequency.setValueAtTime(o.from, t);
  osc.frequency.exponentialRampToValueAtTime(o.to, t + o.over);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = o.lowpass;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.peak * level), t + o.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + o.attack + o.decay);

  osc.connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + o.attack + o.decay + 0.02);
}

const BLOOP: Tone = { type: "sine", from: 230, to: 540, over: 0.055, peak: 0.26, attack: 0.006, decay: 0.15, lowpass: 2400 };
const BLOOP_SHEEN: Tone = { type: "sine", from: 460, to: 1080, over: 0.055, peak: 0.04, attack: 0.006, decay: 0.08, lowpass: 3000 };
const BLOOP_CLOSE: Tone = { type: "sine", from: 540, to: 230, over: 0.06, peak: 0.18, attack: 0.005, decay: 0.12, lowpass: 2400 };

const RECIPES: Record<Kind, (ctx: BaseAudioContext, out: AudioNode, t: number) => void> = {
  open(ctx, out, t) {
    tone(ctx, out, t, BLOOP, 1);
    tone(ctx, out, t, BLOOP_SHEEN, 1);
  },
  close(ctx, out, t) {
    tone(ctx, out, t, BLOOP_CLOSE, 1);
  },
  step(ctx, out, t) {
    tone(ctx, out, t, BLOOP, 0.55);
    tone(ctx, out, t, BLOOP_SHEEN, 0.55);
  },
};

/** Plays a UI sound. Silent when muted, on the server, or where Web Audio is missing. */
export function playSound(kind: Kind) {
  if (typeof window === "undefined" || isMuted()) return;
  if (kind === "step") {
    const now = performance.now();
    if (now - lastStep < STEP_GAP_MS) return;
    lastStep = now;
  }
  const Ctx =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  try {
    if (!context || !master) {
      context = new Ctx();
      master = context.createGain();
      master.gain.value = MASTER;
      master.connect(context.destination);
    }
    // A suspended clock does not advance, so a sound scheduled just ahead still lands after resume.
    if (context.state === "suspended") void context.resume();
    RECIPES[kind](context, master, context.currentTime + 0.005);
  } catch {
    // Sound is a nicety; it must never break the click that triggered it.
  }
}
