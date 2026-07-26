"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Bell, Save, Eye, KeyRound, Monitor, Trash2 } from "lucide-react";
import { getStudentSettings, updateStudentSettings } from "@/app/lib/api/student";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} aria-label={label}
      style={{ position: "relative", width: 46, height: 26, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer", background: on ? "var(--teal)" : "var(--gray-300)", transition: "background 0.18s ease", flexShrink: 0 }}>
      <span aria-hidden="true" style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.18s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px" } as const;

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

  if (loading) return <LoadingPage />;

  const securityItems = [
    { label: "Change password", Icon: KeyRound, danger: false },
    { label: "Manage sessions", Icon: Monitor, danger: false },
    { label: "Delete account", Icon: Trash2, danger: true },
  ];

  const notifications: [string, boolean][] = Object.entries(settings.notifications);
  const accessibility: [string, boolean][] = Object.entries(settings.accessibility);

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader
        title="Settings"
        subtitle="Manage notifications, accessibility, and account security."
        actions={
          <button onClick={handleSave} disabled={saving}
            style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: saved ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
            {saved ? "Saved!" : saving ? <LoadingSpinner size={16} color="#fff" /> : <><Save size={16} /> Save</>}
          </button>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card padded={false} title={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Bell size={16} color="var(--teal)" /> Notifications</span>}>
          {notifications.map(([key, val], i) => (
            <div key={key} style={{ ...row, borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--gray-900)", textTransform: "capitalize" }}>{key}</span>
              <Switch on={val} onClick={() => toggleNotification(key as any)} label={key} />
            </div>
          ))}
        </Card>

        <Card padded={false} title={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Eye size={16} color="var(--teal)" /> Accessibility</span>}>
          {accessibility.map(([key, val], i) => (
            <div key={key} style={{ ...row, borderBottom: i < accessibility.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--gray-900)", textTransform: "capitalize" }}>{key.replace("_", " ")}</span>
              <Switch on={val} onClick={() => toggleAccessibility(key as any)} label={key.replace("_", " ")} />
            </div>
          ))}
        </Card>

        <Card padded={false} title="Account security">
          {securityItems.map(({ label, Icon, danger }, i) => (
            <button key={label} style={{ ...row, width: "100%", background: "transparent", border: "none", borderBottom: i < securityItems.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14.5, fontWeight: 500, color: danger ? "#B42318" : "var(--gray-900)" }}>
                <Icon size={16} color={danger ? "#B42318" : "var(--teal)"} /> {label}
              </span>
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}
