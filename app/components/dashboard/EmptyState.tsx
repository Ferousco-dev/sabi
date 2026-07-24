import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Friendly empty state: an icon, a short explanation, and (optionally) the
 * action that would create the first item. Used wherever a list can be empty so
 * the user is guided instead of facing blank space.
 */
export function EmptyState({
  Icon,
  title,
  description,
  action,
}: {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "48px 24px",
        gap: 6,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: "var(--gray-50)",
          border: "1px solid var(--border)",
          marginBottom: 8,
        }}
      >
        <Icon size={22} strokeWidth={1.8} style={{ color: "var(--text-subtle)" }} />
      </span>
      <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "var(--gray-900)" }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", maxWidth: "42ch" }}>{description}</p>
      )}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}
