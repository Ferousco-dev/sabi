"use client";
import { useEffect, useState } from "react";
import { Bell, Save, Eye, Monitor, Zap } from "lucide-react";
import { getStudentSettings, updateStudentSettings } from "@/app/lib/api/student";

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<any>({ notifications: { email: true, sms: false, push: true }, accessibility: { high_contrast: false, large_text: false, reduce_motion: false } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStudentSettings().then((res) => {
      if (res.ok && res.data) setSettings(res.data.settings);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    await updateStudentSettings({ notifications: settings.notifications, accessibility: settings.accessibility });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleNotification(key: keyof typeof settings.notifications) {
    setSettings((s: any) => ({ ...s, notifications: { ...s.notifications, [key]: !s.notifications[key] } }));
  }
  function toggleAccessibility(key: keyof typeof settings.accessibility) {
    setSettings((s: any) => ({ ...s, accessibility: { ...s.accessibility, [key]: !s.accessibility[key] } }));
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading settings…</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Settings</h1>
        <button onClick={handleSave} disabled={saving} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: saved ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Save size={16} /> {saved ? "Saved!" : saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", marginBottom: 24 }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Bell size={18} color="var(--teal)" />
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Notifications</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(settings.notifications).map(([key, val]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 0" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-700)", textTransform: "capitalize" }}>{key}</span>
                <button onClick={() => toggleNotification(key)} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", background: val ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
                  <span style={{ position: "absolute", top: 2, left: val ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Eye size={18} color="var(--teal)" />
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Accessibility</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(settings.accessibility).map(([key, val]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 0" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-700)", textTransform: "capitalize" }}>{key.replace("_", " ")}</span>
                <button onClick={() => setSettings((s: any) => ({ ...s, accessibility: { ...s.accessibility, [key]: !s.accessibility[key] } }))} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", background: val ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
                  <span style={{ position: "absolute", top: 2, left: val ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                </button>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Account Security</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", fontSize: 14, fontWeight: 500, color: "var(--gray-700)", cursor: "pointer", textAlign: "left" }}>
            <Zap size={16} color="var(--teal)" /> Change Password
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", fontSize: 14, fontWeight: 500, color: "var(--gray-700)", cursor: "pointer", textAlign: "left" }}>
            <Zap size={16} color="var(--teal)" /> Manage Sessions
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", fontSize: 14, fontWeight: 500, color: "#B42318", cursor: "pointer", textAlign: "left" }}>
            <Zap size={16} color="#B42318" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}