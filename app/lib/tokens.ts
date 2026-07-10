/**
 * SabiHub design tokens (TypeScript mirror of the CSS custom properties in
 * app/globals.css). Import these in components instead of hardcoding hex values
 * so colors stay in one place and autocomplete works.
 *
 * Prefer the `var(--…)` CSS variables inside `style={{}}` where possible; use
 * these constants when you need the raw value in JS (e.g. computing a gradient,
 * an SVG fill, or a Framer Motion animation target).
 */

export const color = {
  teal:      "#013D47",
  tealDark:  "#012830",
  tealMid:   "#024F5E",
  gold:      "#AA852E",
  goldDark:  "#8C6E26",
  goldLight: "#D4A94A",
  cream:     "#F0EEE6",
  creamDark: "#E5E2D8",
  ink:       "#0D1F23",

  /** Body copy on cream backgrounds. */
  textSecondary: "#4A6065",
  /** Supporting / caption text, clears WCAG AA on white. */
  textMuted:     "#6B7A7D",

  white: "#FFFFFF",
} as const;

export const border = {
  hairline: "rgba(1, 61, 71, 0.12)",
  soft:     "rgba(1, 61, 71, 0.08)",
} as const;

export const radius = {
  sm:   8,
  md:   12,
  lg:   20,
  pill: 999,
} as const;

/** 4px base spacing scale. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const font = {
  display: "var(--font-display)",
  serif:   "var(--font-serif)",
} as const;

/** Minimum accessible touch target (px), Apple HIG / Material. */
export const TOUCH_MIN = 44;

export type ColorToken = keyof typeof color;
