"use client";
import { initials } from "../../lib/dashboard";
import type { Child } from "../../data/mock/parent";

/**
 * Tab strip for choosing which linked child a parent screen is showing. Shared
 * by the parent overview and report-card screens so the control stays identical.
 */
export function ChildSwitcher({
  children,
  activeId,
  onSelect,
}: {
  children: Child[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Select a child" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
      {children.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(c.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "10px 16px 10px 12px",
              borderRadius: "var(--radius-lg)",
              border: `1.5px solid ${active ? "var(--teal)" : "var(--border)"}`,
              background: active ? "var(--teal-50)" : "var(--bg)",
              boxShadow: active ? "none" : "var(--shadow-xs)",
              cursor: "pointer",
              minHeight: 56,
              fontFamily: "var(--font-sans)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: "var(--radius-full)",
                background: active ? "var(--teal)" : "var(--gray-100)",
                color: active ? "#fff" : "var(--text-muted)",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(c.name)}
              {c.unreadAlerts > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: "var(--radius-full)",
                    background: "var(--gold)",
                    color: "var(--teal)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid var(--bg)",
                  }}
                >
                  {c.unreadAlerts}
                </span>
              )}
            </span>
            <span style={{ textAlign: "left", lineHeight: 1.25 }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{c.name}</span>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--text-subtle)" }}>{c.className}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
