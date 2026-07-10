import type { CSSProperties, ReactNode } from "react";

type SectionHeaderProps = {
  /** Small gold uppercase label above the heading. */
  eyebrow?: string;
  /** Main heading. Pass a string, or JSX to style a serif-italic fragment. */
  heading: ReactNode;
  /** Optional supporting line under the heading. */
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** Heading level for correct document outline (default h2). */
  as?: "h1" | "h2" | "h3";
  style?: CSSProperties;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  heading,
  subtitle,
  align = "left",
  as: Heading = "h2",
  style,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={className}
      style={{
        textAlign: align,
        maxWidth: centered ? 640 : undefined,
        marginInline: centered ? "auto" : undefined,
        ...style,
      }}
    >
      {eyebrow && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--gold)",
            marginBottom: 16,
          }}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        style={{
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "var(--teal)",
          fontFamily: "var(--font-display)",
          textWrap: "balance",
        }}
      >
        {heading}
      </Heading>
      {subtitle && (
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            marginTop: 16,
            maxWidth: centered ? 520 : 560,
            marginInline: centered ? "auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
