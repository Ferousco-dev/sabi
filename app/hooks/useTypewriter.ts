"use client";
import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 36, startDelay = 900) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      // Reset inside the async callback (not synchronously in the effect body)
      // so we don't trigger a cascading render on every dependency change.
      setDisplayed("");
      setDone(false);
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);

  return { displayed, done };
}
