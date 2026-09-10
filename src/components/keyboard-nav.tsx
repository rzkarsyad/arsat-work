"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function KeyboardNav({ older, newer }: { older?: string; newer?: string }) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "ArrowLeft" && older) router.push(`/${older}`);
      else if (event.key === "ArrowRight" && newer) router.push(`/${newer}`);
      else if (event.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [older, newer, router]);

  return null;
}
