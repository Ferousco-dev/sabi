"use client";
import { CSSProperties, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedParagraph({ text, className = "", style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.2"] });
  const chars = text.split("");

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {chars.map((char, i) => {
        const s = Math.max(0, i / chars.length - 0.06);
        const e = Math.min(1, i / chars.length + 0.1);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [s, e], [0.15, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="inline">
            {char}
          </motion.span>
        );
      })}
    </p>
  );
}
