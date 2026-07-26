"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getParentNotifications } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Notification = { id: number; title: string; message: string; type: string; read: boolean; created_at: string };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    getParentNotifications().then((res) => {
      if (res.ok && res.data) setNotifications(res.data.notifications);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const unread = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const tabs: { key: "all" | "unread"; label: string; count: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unread },
  ];

  return (
    <>
      <PageHeader title="Notifications" subtitle="Updates and alerts about your children." />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map((t) => {
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label} <span style={{ opacity: 0.75 }}>· {t.count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState Icon={Bell} title="No notifications" description={filter === "unread" ? "You have no unread notifications." : "Your notification history is empty."} /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((n) => (
            <div key={n.id} style={{ background: "var(--bg)", border: `1px solid ${n.read ? "var(--border)" : "var(--teal)"}`, borderRadius: "var(--radius-lg)", padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "var(--gray-300)" : "var(--teal)", marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{n.title}</div>
                <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 6 }}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
