"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { getAlertPreferences, updateAlertPreferences, type AlertPreferences } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAlertPreferences().then((res) => {
      if (res.ok && res.data) setAlerts(res.data.alerts);
    }).finally(() => setLoading(false));
  }, []);

  async function toggleSms() {
    if (!alerts) return;
    setSaving(true);
    await updateAlertPreferences({ sms_enabled: !alerts.sms_enabled });
    setAlerts((a) => a ? { ...a, sms_enabled: !a.sms_enabled } : a);
    setSaving(false);
  }

  async function toggleEmail() {
    if (!alerts) return;
    setSaving(true);
    await updateAlertPreferences({ email_enabled: !alerts.email_enabled });
    setAlerts((a) => a ? { ...a, email_enabled: !a.email_enabled } : a);
    setSaving(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 560 }}>
      <Link href="/parent" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to dashboard
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Alert Preferences</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 24 }}>Choose how you receive updates about your children.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>SMS Alerts</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Receive attendance and grade alerts via SMS</div>
          </div>
          <button onClick={toggleSms} disabled={saving}
            style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: alerts?.sms_enabled ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", top: 3, left: alerts?.sms_enabled ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {saving && <LoadingSpinner size={10} color={alerts?.sms_enabled ? "var(--teal)" : "var(--gray-400)"} />}
            </span>
          </button>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Email Alerts</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Receive updates via email</div>
          </div>
          <button onClick={toggleEmail} disabled={saving}
            style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: alerts?.email_enabled ? "var(--teal)" : "var(--gray-200)", transition: "background 0.2s", position: "relative" }}>
            <span style={{ position: "absolute", top: 3, left: alerts?.email_enabled ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
