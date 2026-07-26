"use client";
import { useId } from "react";

export type AreaPoint = { label: string; value: number };

/**
 * Smooth area + line chart for a single series. Draws a soft teal gradient-free
 * fill (flat tint) under a curved line, with subtle gridlines, x labels, and a
 * peak marker. The line animates in via the shared `.spark-draw` keyframe. Fully
 * responsive (scales to its container width via viewBox). Accessible: the data
 * is summarised for screen readers.
 */
export function AreaChart({
  data,
  height = 220,
  caption,
}: {
  data: AreaPoint[];
  height?: number;
  caption: string;
}) {
  const gid = useId().replace(/:/g, "");
  const W = 720;
  const H = height;
  const padX = 8;
  const padTop = 16;
  const padBottom = 28;
  const usableH = H - padTop - padBottom;

  if (data.length < 2) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-subtle)", fontSize: 14 }}>
        Not enough data to chart yet.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = (W - padX * 2) / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = padTop + usableH - (d.value / max) * usableH;
    return [x, y] as const;
  });

  // Catmull-Rom -> cubic bezier for a smooth curve.
  const line = pts.map(([x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [x0, y0] = pts[i - 1];
    const cx = (x0 + x) / 2;
    return `C ${cx} ${y0} ${cx} ${y} ${x} ${y}`;
  }).join(" ");
  const area = `${line} L ${pts[pts.length - 1][0]} ${H - padBottom} L ${pts[0][0]} ${H - padBottom} Z`;

  const peakIdx = data.reduce((mi, d, i, arr) => (d.value > arr[mi].value ? i : mi), 0);
  const gridYs = [0, 0.5, 1].map((t) => padTop + usableH * t);

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label={caption} style={{ display: "block", overflow: "visible" }}>
        {gridYs.map((y, i) => (
          <line key={i} x1={padX} x2={W - padX} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} strokeDasharray={i === gridYs.length - 1 ? "0" : "4 5"} />
        ))}
        <path d={area} fill={`var(--teal-50)`} className="spark-fill" />
        <path d={line} fill="none" stroke="var(--teal)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="spark-draw" style={{ strokeDasharray: 1200, strokeDashoffset: 1200, animation: "spark-draw 1.2s cubic-bezier(0.16,1,0.3,1) forwards" }} />
        {/* peak marker */}
        <circle cx={pts[peakIdx][0]} cy={pts[peakIdx][1]} r={4.5} fill="#fff" stroke="var(--teal)" strokeWidth={2.5} className="spark-fill" />
        {/* x labels */}
        {data.map((d, i) => (
          <text key={i} x={pts[i][0]} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--text-subtle)" style={{ fontFamily: "var(--font-sans)" }}>
            {d.label}
          </text>
        ))}
      </svg>
      <figcaption className="sr-only">{caption}. Values: {data.map((d) => `${d.label} ${d.value}`).join(", ")}.</figcaption>
    </figure>
  );
}
