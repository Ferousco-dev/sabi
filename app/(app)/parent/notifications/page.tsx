"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Calendar, Bell, Search } from "lucide-react";
import { getParentNotifications } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    getParentNotifications().then((res) => {
      if (res.ok && res.data) setNotifications(res.data.notifications);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Notifications</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "unread"].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1.5px solid ${filter === f ? "var(--teal)" : "var(--border)"}`, background: filter === f ? "var(--teal-50)" : "#fff", color: filter === f ? "var(--teal)" : "var(--gray-600)", cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={filter === "unread" ? "You have no unread notifications." : "Your notification history is empty."}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((n, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${n.read ? "var(--border)" : "var(--teal)"}`, borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "flex-start", gap: 12, opacity: n.read ? 0.85 : 1 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "var(--gray-300)" : "var(--gold)", marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{n.title}</div>
              <div style={{ fontSize: 13, color: "var(--gray-600)", marginTop: 2 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 6 }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}