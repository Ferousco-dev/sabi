/**
 * Shared layout constants for the dashboard shell. Kept in one place so the
 * sidebar, topbar, and content offsets stay in agreement (no magic numbers
 * scattered across components).
 */

export const SIDEBAR_WIDTH = 264;
export const TOPBAR_HEIGHT = 64;
/** Below this width the sidebar becomes an off-canvas drawer. */
export const SIDEBAR_BREAKPOINT = 1024;

/** Format a whole number with thousands separators (locale-aware, en-NG). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-NG").format(n);
}

/** Compact initials for an avatar fallback, e.g. "Amara Okeke" to "AO". */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
