"use client";
import type { ReactNode } from "react";
import { Search } from "lucide-react";

/**
 * Shared toolbar controls for the management list screens (Students, Teachers,
 * and so on) so search boxes, filter selects, and bulk-action buttons look and
 * behave the same everywhere instead of being restyled per page.
 */

export function SearchInput({
  value,
  onChange,
  placeholder,
  label = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flex: "1 1 240px",
        minWidth: 0,
        height: 40,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        background: "var(--bg-subtle)",
      }}
    >
      <Search size={16} strokeWidth={1.9} style={{ color: "var(--text-subtle)", flexShrink: 0 }} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-sans)" }}
      />
    </label>
  );
}

export function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Each option: the stored value and its visible label. */
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      style={{
        height: 40,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        background: "var(--bg)",
        fontSize: 14,
        color: "var(--text)",
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function BulkButton({
  icon,
  children,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 34,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        background: "var(--bg)",
        fontSize: 13,
        fontWeight: 600,
        color: danger ? "#B42318" : "var(--text-muted)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/** Wrapper for the toolbar row above a table. */
export function TableToolbar({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, borderBottom: "1px solid var(--border)", alignItems: "center" }}>
      {children}
    </div>
  );
}

/** Right-aligned result count for the toolbar. */
export function ResultCount({ shown, total }: { shown: number; total: number }) {
  return (
    <span style={{ fontSize: 13, color: "var(--text-subtle)", marginLeft: "auto", whiteSpace: "nowrap" }}>
      {shown} of {total}
    </span>
  );
}
