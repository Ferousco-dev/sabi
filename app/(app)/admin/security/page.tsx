"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { Save, Check } from "lucide-react";
import { updateSecuritySettings } from "@/app/lib/api/schools";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Button } from "@/app/components/ui/Button";

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
    <div style={{ maxWidth: 680 }}>
      <PageHeader
        title="Security Settings"
        subtitle="Configure school-wide security policies."
        actions={
          <Button
            variant={saved ? "gold" : "primary"}
            onClick={handleSave}
            disabled={saving}
            icon={saved ? <Check size={16} /> : <Save size={16} />}
          >
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </Button>
        }
      />

      <Card padded={false}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 13.5, color: "var(--text-subtle)", marginTop: 2 }}>Require 2FA for all staff accounts</div>
          </div>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            role="switch"
            aria-checked={twoFactor}
            aria-label="Two-factor authentication"
            style={{ flexShrink: 0, width: 48, height: 26, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer", background: twoFactor ? "var(--teal)" : "var(--gray-300)", transition: "background 0.2s", position: "relative" }}
          >
            <span style={{ position: "absolute", top: 3, left: twoFactor ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
          </button>
        </div>

        <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>Password Policy</div>
          <div style={{ fontSize: 13.5, color: "var(--text-subtle)", marginBottom: 10 }}>Minimum password strength requirement</div>
          <select value={passPolicy} onChange={(e) => setPassPolicy(e.target.value)}
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
            <option value="standard">Standard (8+ chars)</option>
            <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
            <option value="very_strong">Very Strong (16+ chars, mixed case, numbers, symbols)</option>
          </select>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 4 }}>Session Timeout</div>
          <div style={{ fontSize: 13.5, color: "var(--text-subtle)", marginBottom: 10 }}>Auto-logout after inactivity (minutes)</div>
          <input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", width: 120, color: "var(--text)", fontFamily: "var(--font-sans)" }} />
        </div>
      </Card>
    </div>
  );
}
