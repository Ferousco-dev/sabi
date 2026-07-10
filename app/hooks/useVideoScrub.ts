"use client";
import { useCallback, useEffect, useRef } from "react";

export function useVideoScrub(sensitivity = 0.7) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef(0);
  const pendingSeek = useRef<number | null>(null);
  const seeking = useRef(false);

  const onSeeked = useCallback(() => {
    seeking.current = false;
    if (pendingSeek.current !== null && videoRef.current) {
      videoRef.current.currentTime = pendingSeek.current;
      pendingSeek.current = null;
      seeking.current = true;
    }
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Only run on real pointer devices. On touch phones/tablets the scrub can't
    // fire (no mousemove), so the markup keeps preload="none" and the video is
    // never downloaded, the single biggest 2G/3G win. Also honour reduced-motion.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    // We deferred loading via preload="none"; on desktop, opt back in now.
    vid.preload = "auto";
    vid.load();

    let raf = 0;
    let nextTarget: number | null = null;

    // Coalesce seeks into one per animation frame so a fast mouse doesn't queue
    // hundreds of decoder seeks (the old code seeked on every mousemove event).
    const applySeek = () => {
      raf = 0;
      if (nextTarget === null) return;
      if (seeking.current) {
        pendingSeek.current = nextTarget;
      } else {
        vid.currentTime = nextTarget;
        seeking.current = true;
      }
      nextTarget = null;
    };

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      if (!vid.duration) return;
      nextTarget = Math.max(
        0,
        Math.min(vid.duration, vid.currentTime + (delta / window.innerWidth) * sensitivity * vid.duration)
      );
      if (!raf) raf = requestAnimationFrame(applySeek);
    };

    vid.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMove);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      vid.removeEventListener("seeked", onSeeked);
    };
  }, [onSeeked, sensitivity]);

  return videoRef;
}
