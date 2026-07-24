"use client";
import { useEffect, useState } from "react";
import { Shield, Save } from "lucide-react";
import { updateSecuritySettings } from "@/app/lib/api/schools";

export default function SecurityPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [passPolicy, setPassPolicy] = useState("standard");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateSecuritySettings({
      two_factor_enabled: twoFactor,
      password_policy: passPolicy,
      session_timeout: Number(sessionTimeout),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Security Settings</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>Configure school-wide security policies</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ height: 42, padding: "0 18px", borderRadius: 8, background: saved ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Save size={16} /> {saved ? "Saved!" : saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Require 2FA for all staff accounts</div>
          </div>
          <button onClick={() => setTwoFactor(!twoFactor)}
            style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: twoFactor ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
            <span style={{ position: "absolute", top: 3, left: twoFactor ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
          </button>
        </div>

        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>Password Policy</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 10 }}>Minimum password strength requirement</div>
          <select value={passPolicy} onChange={(e) => setPassPolicy(e.target.value)}
            style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
            <option value="standard">Standard (8+ chars)</option>
            <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
            <option value="very_strong">Very Strong (16+ chars, mixed case, numbers, symbols)</option>
          </select>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>Session Timeout</div>
          <div style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 10 }}>Auto-logout after inactivity (minutes)</div>
          <input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}
            style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 100 }} />
        </div>
      </div>
    </div>
  );
}
