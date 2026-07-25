"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Bell, ArrowRight, Baby } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getChildren, getAlertPreferences, type Child, type AlertPreferences } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Button } from "@/app/components/ui/Button";

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

  if (loading) return <LoadingPage />;

  const alertsOn = (alerts?.sms_enabled ? 1 : 0) + (alerts?.email_enabled ? 1 : 0);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName}`}
        subtitle="Stay updated on your children's progress"
        actions={<Button variant="outline" href="/parent/children" icon={<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}>Manage children</Button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="dash-rise"><StatCard label="Linked children" value={children.length} Icon={Baby} /></div>
        <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Alert channels on" value={alertsOn} Icon={Bell} /></div>
      </div>

      {children.length === 0 ? (
        <Card>
          <EmptyState
            Icon={Users}
            title="No children linked yet"
            description="Link your child's account using their school email to track progress, attendance, and grades."
            action={<Button href="/parent/children">Link a child</Button>}
          />
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {children.map((child) => (
            <Card key={child.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span aria-hidden="true" style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                  {child.name[0]?.toUpperCase()}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{child.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-subtle)" }}>{child.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <Link href={`/parent/results/${child.id}`} style={linkStyle}>Results <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>
                <Link href={`/parent/children/${child.id}`} style={linkStyle}>Profile <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13.5,
  fontWeight: 600,
  color: "var(--teal)",
  textDecoration: "none",
};
