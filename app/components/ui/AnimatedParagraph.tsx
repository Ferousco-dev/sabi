"use client";
import { CSSProperties, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  style?: CSSProperties;
}

// One word = one hook, called at the top level of its own component. This fixes
// the Rules-of-Hooks violation (useTransform was called inside a .map) and cuts
// the node/subscription count from ~274 chars to ~45 words.
function AnimatedWord({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return (
    <motion.span className="inline" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export function AnimatedParagraph({ text, className = "", style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const words = text.split(" ");

  // Respect prefers-reduced-motion: no scroll-linked fade, just static text.
  if (reduce) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((w, i) => {
        const s = Math.max(0, i / words.length - 0.1);
        const e = Math.min(1, i / words.length + 0.12);
        return (
          <AnimatedWord key={i} progress={scrollYProgress} start={s} end={e}>
            {i < words.length - 1 ? w + " " : w}
          </AnimatedWord>
        );
      })}
    </p>
  );
}
