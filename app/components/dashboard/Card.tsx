import type { CSSProperties, ReactNode } from "react";

/**
 * Base surface for dashboard content. White, hairline border, 12px radius, and
 * the softest shadow, the standard panel look. Optional header row keeps a
 * consistent title/action layout across every panel.
 */
export function Card({
  children,
  title,
  action,
  padded = true,
  style,
}: {
  children: ReactNode;
  title?: ReactNode;
  /** Right-aligned control in the header (e.g. a link or menu). */
  action?: ReactNode;
  /** Set false when the body manages its own padding (e.g. a table). */
  padded?: boolean;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xs)",
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || action) && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          {action}
        </header>
      )}
      <div style={{ padding: padded ? 20 : 0 }}>{children}</div>
    </section>
  );
}
