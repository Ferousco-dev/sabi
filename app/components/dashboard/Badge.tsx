import type { CSSProperties, ReactNode } from "react";

/**
 * Small status badge. Pill radius is allowed here because it is a tiny badge,
 * the one place the design system permits it. Tones map to semantic meaning,
 * not decoration: color is always paired with a text label.
 */
export type BadgeTone = "neutral" | "teal" | "success" | "warning" | "danger";

const TONES: Record<BadgeTone, CSSProperties> = {
  neutral: { background: "var(--gray-100)", color: "var(--gray-700)" },
  teal: { background: "var(--teal-50)", color: "var(--teal)" },
  success: { background: "#ECFDF3", color: "#067647" },
  warning: { background: "#FFFAEB", color: "#B54708" },
  danger: { background: "#FEF3F2", color: "#B42318" },
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  style,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  /** Leading status dot in the tone's text color. */
  dot?: boolean;
  style?: CSSProperties;
}) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.6,
        whiteSpace: "nowrap",
        ...t,
        ...style,
      }}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: t.color }}
        />
      )}
      {children}
    </span>
  );
}
