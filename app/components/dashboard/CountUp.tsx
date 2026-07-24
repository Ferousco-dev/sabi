"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Animates a number toward `value` using tabular figures so the width never
 * jitters mid-count. The first count runs from zero when the element scrolls
 * into view; after that, any change to `value` animates from the current
 * displayed number to the new one (so switching data sets updates correctly).
 * Honours prefers-reduced-motion by snapping to the value with no animation.
 */
export function CountUp({
  value,
  durationMs = 900,
  format = (n: number) => String(n),
}: {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRef(false);
  const from = useRef(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateTo = (target: number) => {
      if (reduce) {
        from.current = target;
        setDisplay(target);
        return;
      }
      const startValue = from.current;
      const startTime = performance.now();
      if (raf.current) cancelAnimationFrame(raf.current);
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setDisplay(Math.round(startValue + (target - startValue) * eased));
        if (t < 1) raf.current = requestAnimationFrame(tick);
        else from.current = target;
      };
      raf.current = requestAnimationFrame(tick);
    };

    if (inView.current) {
      // Already revealed; the value prop changed, so retarget the count.
      animateTo(value);
      return () => {
        if (raf.current) cancelAnimationFrame(raf.current);
      };
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !inView.current) {
            inView.current = true;
            animateTo(value);
            io.disconnect();
          }
        }),
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(display)}
    </span>
  );
}
