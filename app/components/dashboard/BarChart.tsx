import { Fragment } from "react";

export type Bar = { label: string; value: number; max: number; caption?: string };

/**
 * Small vertical bar chart for weekly/periodic figures. Bars grow up on mount
 * (CSS scaleY, transform-origin bottom) with a short per-bar stagger, and the
 * exact value sits above each bar so the chart is readable without hover. A
 * visually-hidden table gives screen readers the same numbers.
 */
export function BarChart({
  bars,
  unit = "",
  height = 160,
  caption,
}: {
  bars: Bar[];
  unit?: string;
  height?: number;
  caption: string;
}) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${bars.length}, 1fr)`,
          gap: 12,
          alignItems: "end",
          height,
        }}
      >
        {bars.map((bar, i) => {
          const pct = Math.max(0, Math.min(1, bar.value / (bar.max || 1)));
          return (
            <div key={bar.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", fontVariantNumeric: "tabular-nums" }}>
                {bar.value.toLocaleString("en-NG")}
                {unit}
              </span>
              <div style={{ position: "relative", width: "100%", maxWidth: 40, flex: 1, display: "flex", alignItems: "flex-end" }}>
                <div style={{ position: "absolute", inset: 0, background: "var(--gray-100)", borderRadius: "var(--radius-xs)" }} />
                <div
                  className="bar-grow"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: `${pct * 100}%`,
                    minHeight: 4,
                    background: "var(--teal)",
                    borderRadius: "var(--radius-xs)",
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{bar.label}</span>
            </div>
          );
        })}
      </div>

      <figcaption className="sr-only">
        {caption}.
        <table>
          <tbody>
            {bars.map((bar) => (
              <Fragment key={bar.label}>
                <tr>
                  <th scope="row">{bar.label}</th>
                  <td>
                    {bar.value}
                    {unit} of {bar.max}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
