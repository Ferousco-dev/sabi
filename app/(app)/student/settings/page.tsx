"use client";
import { useEffect, useState } from "react";
import { Bell, Eye, Zap } from "lucide-react";
import { getStudentSettings, updateStudentSettings } from "@/app/lib/api/student";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: true });
  const [accessibility, setAccessibility] = useState({ high_contrast: false, large_text: false, reduce_motion: false });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStudentSettings().then((res) => {
      if (res.ok && res.data) {
        setNotifications(res.data.settings.notifications);
        setAccessibility(res.data.settings.accessibility);
      }
      setLoading(false);
    });
  }, []);

  async function save() {
    await updateStudentSettings({ notifications, accessibility });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading settings…</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Settings</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>Manage your preferences</p>
        </div>
        <button onClick={save} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: saved ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={20} color="var(--teal)" /> Notifications
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "sms", label: "SMS Alerts", desc: "Get urgent alerts via SMS" },
            { key: "push", label: "Push Notifications", desc: "App push notifications" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{desc}</div>
              </div>
              <button onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: notifications[key as keyof typeof notifications] ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
                <span style={{ position: "absolute", top: 3, left: notifications[key as keyof typeof notifications] ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-xs)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Eye size={20} color="var(--teal)" /> Accessibility
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "high_contrast", label: "High Contrast", desc: "Increase color contrast" },
            { key: "large_text", label: "Large Text", desc: "Increase font sizes" },
            { key: "reduce_motion", label: "Reduce Motion", desc: "Minimize animations" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{desc}</div>
              </div>
              <button onClick={() => setAccessibility((p) => ({ ...p, [key]: !p[key] }))}
                style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: accessibility[key as keyof typeof accessibility] ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
                <span style={{ position: "absolute", top: 3, left: accessibility[key as keyof typeof accessibility] ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}