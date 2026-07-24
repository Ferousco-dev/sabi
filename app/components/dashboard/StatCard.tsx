import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CountUp } from "./CountUp";
import { Sparkline } from "./Sparkline";
import { formatNumber } from "../../lib/dashboard";

export type Delta = {
  /** Signed percentage change, e.g. 4.2 or -1.8. */
  value: number;
  /** Context for the change, e.g. "vs last term". */
  label: string;
};

/**
 * A single overview metric: label, animated value, trend delta, and a small
 * sparkline. Direction is shown with an arrow icon and color, never color
 * alone, so it reads without relying on hue.
 */
export function StatCard({
  label,
  value,
  suffix,
  Icon,
  delta,
  trend,
  decimals = false,
}: {
  label: string;
  value: number;
  /** Unit appended after the number, e.g. "%". */
  suffix?: string;
  Icon: LucideIcon;
  delta?: Delta;
  /** Series for the sparkline; omit to hide it. */
  trend?: number[];
  /** Render the value with one decimal place (for rates). */
  decimals?: boolean;
}) {
  const up = (delta?.value ?? 0) >= 0;
  const deltaColor = up ? "#067647" : "#B42318";
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight;
  const fmt = decimals
    ? (n: number) => n.toLocaleString("en-NG", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : formatNumber;

  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xs)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-subtle)" }}>{label}</span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "var(--radius-sm)",
            background: "var(--teal-50)",
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={1.9} style={{ color: "var(--teal)" }} />
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <CountUp value={value} format={fmt} />
            {suffix && <span style={{ fontSize: 20, fontWeight: 600, color: "var(--text-muted)" }}>{suffix}</span>}
          </div>
        </div>
        {trend && <Sparkline data={trend} />}
      </div>

      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 600, color: deltaColor }}>
            <DeltaIcon size={14} strokeWidth={2.2} aria-hidden="true" />
            {Math.abs(delta.value).toFixed(1)}%
          </span>
          <span style={{ color: "var(--text-subtle)" }}>{delta.label}</span>
        </div>
      )}
    </div>
  );
}
