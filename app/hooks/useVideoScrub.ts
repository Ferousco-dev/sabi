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

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      if (!vid.duration) return;
      const target = Math.max(
        0,
        Math.min(vid.duration, vid.currentTime + (delta / window.innerWidth) * sensitivity * vid.duration)
      );
      if (seeking.current) { pendingSeek.current = target; }
      else { vid.currentTime = target; seeking.current = true; }
    };

    vid.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      vid.removeEventListener("seeked", onSeeked);
    };
  }, [onSeeked, sensitivity]);

  return videoRef;
}
