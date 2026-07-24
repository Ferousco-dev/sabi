import type { ReactNode } from "react";

/**
 * Standard page heading for a dashboard screen: title, optional subtitle, and a
 * right-aligned action slot (usually the one primary CTA for the page). Stacks
 * below the actions on narrow screens.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: "clamp(22px, 2.4vw, 26px)", fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14.5, color: "var(--text-muted)", marginTop: 4, maxWidth: "62ch" }}>{subtitle}</p>
        )}
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
