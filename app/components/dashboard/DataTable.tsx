"use client";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  /** Cell content. Defaults to String(row[key]) when omitted. */
  render?: (row: T) => ReactNode;
  /** Value used for sorting this column; omit to make the column unsortable. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  nowrap?: boolean;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

/**
 * Generic, accessible data table: client-side sorting with aria-sort, optional
 * row selection with a select-all header and a bulk-action bar, a sticky header,
 * horizontal scroll on narrow screens, and an empty state. Search and filtering
 * stay with the parent, which passes already-filtered `rows`.
 */
export function DataTable<T>({
  columns,
  rows,
  rowId,
  selectable = false,
  bulkActions,
  empty,
  minWidth = 720,
}: {
  columns: Column<T>[];
  rows: T[];
  rowId: (row: T) => string;
  selectable?: boolean;
  /** Rendered in the bar shown when one or more rows are selected. Receives the selected ids. */
  bulkActions?: (selectedIds: string[], clear: () => void) => ReactNode;
  empty: ReactNode;
  minWidth?: number;
}) {
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sort, columns]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const allVisibleIds = sorted.map(rowId);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));
  const someSelected = allVisibleIds.some((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) allVisibleIds.forEach((id) => next.delete(id));
      else allVisibleIds.forEach((id) => next.add(id));
      return next;
    });
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clear = () => setSelected(new Set());

  if (rows.length === 0) return <>{empty}</>;

  return (
    <div>
      {selectable && selected.size > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--teal-50)",
          }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--teal)" }}>
            {selected.size} selected
          </span>
          <div style={{ flex: 1 }} />
          {bulkActions?.(Array.from(selected), clear)}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth }}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ ...thStyle, width: 44, paddingRight: 0 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = !allSelected && someSelected;
                    }}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                    style={checkboxStyle}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sort?.key === col.key;
                const ariaSort = isSorted ? (sort!.dir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th
                    key={col.key}
                    aria-sort={col.sortValue ? ariaSort : undefined}
                    style={{ ...thStyle, textAlign: col.align ?? "left" }}
                  >
                    {col.sortValue ? (
                      <button type="button" onClick={() => toggleSort(col.key)} style={sortButtonStyle}>
                        {col.header}
                        {isSorted ? (
                          sort!.dir === "asc" ? (
                            <ArrowUp size={13} strokeWidth={2.4} aria-hidden="true" />
                          ) : (
                            <ArrowDown size={13} strokeWidth={2.4} aria-hidden="true" />
                          )
                        ) : (
                          <ChevronsUpDown size={13} strokeWidth={2} style={{ color: "var(--gray-400)" }} aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const id = rowId(row);
              const isSel = selected.has(id);
              return (
                <tr key={id} style={{ background: isSel ? "var(--teal-50)" : "transparent" }}>
                  {selectable && (
                    <td style={{ ...tdStyle, width: 44, paddingRight: 0 }}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleOne(id)}
                        aria-label={`Select row ${id}`}
                        style={checkboxStyle}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        ...tdStyle,
                        textAlign: col.align ?? "left",
                        whiteSpace: col.nowrap ? "nowrap" : undefined,
                      }}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
  position: "sticky" as const,
  top: 0,
  background: "var(--bg)",
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle" as const,
};

const sortButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  font: "inherit",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  color: "var(--text-subtle)",
};

const checkboxStyle = {
  width: 16,
  height: 16,
  accentColor: "var(--teal)",
  cursor: "pointer",
};
