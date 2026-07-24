"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { getChildren, getAlertPreferences, type Child, type AlertPreferences } from "@/app/lib/api/parent";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [alerts, setAlerts] = useState<AlertPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getChildren(), getAlertPreferences()]).then(([c, a]) => {
      if (c.ok && c.data) setChildren(c.data.children);
      if (a.ok && a.data) setAlerts(a.data.alerts);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading dashboard…</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "var(--gray-500)" }}>Stay updated on your children&apos;s progress</p>
      </div>

      {children.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "40px", textAlign: "center", boxShadow: "var(--shadow-xs)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--gray-900)", marginBottom: 8 }}>No children linked yet</h2>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20, maxWidth: 400, marginInline: "auto" }}>
            Link your child&apos;s account using their school email to start tracking their progress, attendance, and grades.
          </p>
          <Link href="/parent/children" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 20px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Link a Child
          </Link>
        </div>
      )}

      {children.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
          {children.map((child) => (
            <div key={child.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "20px", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
                  {child.name[0]}
                </span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>{child.name}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{child.email}</div>
                </div>
              </div>
              <Link href={`/student/progress?student_id=${child.id}`} style={{ display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>
                View Progress
              </Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "20px", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Alert Preferences</h2>
          <Link href="/parent/alerts" style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>Configure</Link>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "var(--gray-600)" }}>
            SMS alerts: <strong style={{ color: alerts?.sms_enabled ? "#0E8345" : "var(--gray-400)" }}>{alerts?.sms_enabled ? "On" : "Off"}</strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--gray-600)" }}>
            Email alerts: <strong style={{ color: alerts?.email_enabled ? "#0E8345" : "var(--gray-400)" }}>{alerts?.email_enabled ? "On" : "Off"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
