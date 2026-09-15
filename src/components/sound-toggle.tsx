"use client";

import { useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted } from "@/lib/sound";
import { SoundOff, SoundOn } from "./icons";

/** Footer switch for the interface sounds. The choice is remembered per visitor. */
export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label="Mute sounds"
      aria-pressed={muted}
      title={muted ? "Sounds off" : "Sounds on"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
    >
      {muted ? <SoundOff size={15} /> : <SoundOn size={15} />}
    </button>
  );
}
