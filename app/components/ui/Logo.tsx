import type { CSSProperties } from "react";

type LogoProps = {
  /** Box + wordmark size. */
  size?: "sm" | "md" | "lg";
  /** Wordmark color, teal on light surfaces, white on dark. */
  tone?: "dark" | "light";
  /** Hide the "SabiHub" wordmark, show the mark only. */
  markOnly?: boolean;
  style?: CSSProperties;
  className?: string;
};

const DIMS = {
  sm: { box: 28, img: 20, word: 15, radius: 7 },
  md: { box: 32, img: 24, word: 16, radius: 8 },
  lg: { box: 36, img: 28, word: 18, radius: 8 },
} as const;

export function Logo({
  size = "md",
  tone = "dark",
  markOnly = false,
  style,
  className,
}: LogoProps) {
  const d = DIMS[size];
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 10, ...style }}
    >
      <div
        style={{
          width: d.box,
          height: d.box,
          borderRadius: d.radius,
          background: "#fff",
          border: tone === "dark" ? "1px solid var(--border)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Alt is empty because the "SabiHub" wordmark beside it already names
            the brand; a duplicate label would be announced twice. */}
        <img
          src="/logo.png"
          alt={markOnly ? "SabiHub" : ""}
          style={{ width: d.img, height: d.img, objectFit: "contain" }}
        />
      </div>
      {!markOnly && (
        <span
          style={{
            fontWeight: 800,
            fontSize: d.word,
            letterSpacing: "-0.02em",
            color: tone === "dark" ? "var(--teal)" : "#fff",
            fontFamily: "var(--font-display)",
          }}
        >
          SabiHub
        </span>
      )}
    </div>
  );
}
