"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { getAlertPreferences, updateAlertPreferences, type AlertPreferences } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"sms" | "email" | null>(null);

  useEffect(() => {
    getAlertPreferences().then((res) => {
      if (res.ok && res.data) setAlerts(res.data.alerts);
    }).finally(() => setLoading(false));
  }, []);

  async function toggle(channel: "sms" | "email") {
    if (!alerts) return;
    setSaving(channel);
    const key = channel === "sms" ? "sms_enabled" : "email_enabled";
    const next = !alerts[key];
    await updateAlertPreferences({ [key]: next });
    setAlerts((a) => (a ? { ...a, [key]: next } : a));
    setSaving(null);
  }

  if (loading) return <LoadingPage />;

  const rows = [
    { key: "sms" as const, on: !!alerts?.sms_enabled, label: "SMS alerts", hint: "Receive attendance and grade alerts by text message." },
    { key: "email" as const, on: !!alerts?.email_enabled, label: "Email alerts", hint: "Receive updates and summaries by email." },
  ];

  return (
    <>
      <PageHeader title="Alert preferences" subtitle="Choose how you receive updates about your children." />

      <Card padded={false} style={{ maxWidth: 620 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 20px", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{r.label}</div>
              <div style={{ fontSize: 13, color: "var(--text-subtle)", marginTop: 2 }}>{r.hint}</div>
            </div>
            <button onClick={() => toggle(r.key)} disabled={saving === r.key} role="switch" aria-checked={r.on} aria-label={r.label}
              style={{ position: "relative", width: 46, height: 26, borderRadius: "var(--radius-full)", border: "none", cursor: saving === r.key ? "default" : "pointer", background: r.on ? "var(--teal)" : "var(--gray-300)", transition: "background 0.18s ease", flexShrink: 0 }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 3, left: r.on ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.18s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {saving === r.key && <LoadingSpinner size={10} />}
              </span>
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
