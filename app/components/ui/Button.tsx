"use client";
import type { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "gold" | "outline";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, CSSProperties> = {
  // Deep teal, the default page action.
  primary: { background: "var(--teal)", color: "#fff", border: "none" },
  // Gold, the secondary "creator" action; teal text for AA contrast on gold.
  gold: { background: "var(--gold)", color: "var(--teal)", border: "none" },
  // Quiet outline on cream/white surfaces.
  outline: {
    background: "#fff",
    color: "var(--teal)",
    border: "1px solid var(--border)",
  },
};

const SIZES: Record<Size, CSSProperties> = {
  // Both clear the 44px touch-target minimum.
  md: { fontSize: 14, padding: "13px 26px", minHeight: 44 },
  lg: { fontSize: 15, padding: "16px 32px", minHeight: 52 },
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Icon rendered after the label (e.g. <ArrowRight size={16} />). */
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: CSSProperties;
  className?: string;
};

type AsButton = CommonProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type AsLink = CommonProps & {
  /** Renders an <a>. Use for mailto:/external or in-page anchors. */
  href: string;
};

type ButtonProps = AsButton | AsLink;

function baseStyle(p: ButtonProps): CSSProperties {
  const variant = p.variant ?? "primary";
  const size = p.size ?? "md";
  const disabled = "href" in p ? false : p.disabled;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: p.fullWidth ? "100%" : undefined,
    textDecoration: "none",
    transition: "opacity 0.18s ease",
    ...VARIANTS[variant],
    ...SIZES[size],
    ...p.style,
  };
}

// Hover = subtle opacity dip. Keyboard focus is handled globally by
// :focus-visible in globals.css, so no per-button focus wiring needed.
const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.opacity = "0.88";
};
const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.opacity = "1";
};

export function Button(props: ButtonProps) {
  const content = (
    <>
      {props.children}
      {props.icon}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <a
        href={props.href}
        className={props.className}
        style={baseStyle(props)}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {content}
      </a>
    );
  }

  const { onClick, type = "button", disabled } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={props.className}
      style={baseStyle(props)}
      onMouseEnter={(e) => !disabled && hoverIn(e)}
      onMouseLeave={hoverOut}
    >
      {content}
    </button>
  );
}
