"use client";
import { useState } from "react";

/**
 * A labelled on/off switch row used in the profile and settings screens.
 * Semantically a switch (role, aria-checked) so it is keyboard and screen
 * reader friendly.
 */
export function ToggleRow({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{hint}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        style={{ position: "relative", width: 42, height: 24, borderRadius: "var(--radius-full)", border: "none", background: on ? "var(--teal)" : "var(--gray-300)", cursor: "pointer", transition: "background 0.18s ease", flexShrink: 0 }}
      >
        <span aria-hidden="true" style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "var(--radius-full)", background: "#fff", transition: "left 0.18s cubic-bezier(0.16,1,0.3,1)" }} />
      </button>
    </div>
  );
}
