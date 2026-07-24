import type { CSSProperties } from "react";

/**
 * Tiny inline trend line. The stroke draws itself in on mount via a CSS
 * dash animation (defined once in globals.css as `.spark-draw`), and the area
 * fill fades up beneath it. Purely presentational, so it is aria-hidden; the
 * metric it illustrates is already stated in text beside it.
 */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  stroke = "var(--teal-600)",
  fill = "var(--teal-50)",
  style,
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  // Small vertical inset so the peak/trough are not clipped by the stroke width.
  const pad = 3;
  const usable = height - pad * 2;

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = pad + usable - ((value - min) / span) * usable;
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <path d={area} fill={fill} className="spark-fill" />
      <path
        d={line}
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="spark-draw"
      />
    </svg>
  );
}
