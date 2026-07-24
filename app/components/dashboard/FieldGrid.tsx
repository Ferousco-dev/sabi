"use client";

export type FormField = { id: string; label: string; value: string; type?: string };

/**
 * Responsive grid of labelled text inputs, shared by the profile and settings
 * forms so every editable form looks and behaves the same.
 */
export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FormField[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      {fields.map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)", marginBottom: 7 }}>
            {f.label}
          </label>
          <input
            id={f.id}
            type={f.type ?? "text"}
            value={values[f.id] ?? ""}
            onChange={(e) => onChange(f.id, e.target.value)}
            style={{
              width: "100%",
              height: 42,
              padding: "0 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-strong)",
              background: "var(--bg)",
              fontSize: 14,
              color: "var(--text)",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
