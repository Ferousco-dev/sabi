"use client";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  /** First part, in the default text color. */
  lead: string;
  /** Second part, emphasised in the accent color. */
  accent: string;
  /** Accent color for the emphasised part (default brand teal). */
  accentColor?: string;
  style?: CSSProperties;
};

/**
 * Types the headline out on load, with a blinking caret. The full text is
 * rendered (invisibly) underneath to reserve height, so the layout never jumps
 * as characters appear. Honors prefers-reduced-motion (shows instantly).
 */
export function TypewriterHeading({ lead, accent, accentColor = "var(--teal)", style }: Props) {
  const full = lead + accent;
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // All setState happens inside async timers (never synchronously in the effect
    // body), so it stays lint-clean; each run cleans up its own timers and is safe
    // under React Strict Mode's mount/unmount/remount.
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const startTimer = setTimeout(() => {
      if (reduced) {
        setCount(full.length);
        setDone(true);
        return;
      }
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= full.length) {
          if (interval) clearInterval(interval);
          finishTimer = setTimeout(() => setDone(true), 1400);
        }
      }, 45);
    }, reduced ? 0 : 350);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [full]);

  const leadShown = lead.slice(0, Math.min(count, lead.length));
  const accentShown = accent.slice(0, Math.max(0, count - lead.length));

  return (
    <h1 aria-label={full} style={{ position: "relative", ...style }}>
      {/* reserves height so the line never jumps while typing */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{full}</span>
      {/* typed overlay */}
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        {leadShown}
        <span style={{ color: accentColor }}>{accentShown}</span>
        {!done && <span className="tw-caret" />}
      </span>
    </h1>
  );
}
