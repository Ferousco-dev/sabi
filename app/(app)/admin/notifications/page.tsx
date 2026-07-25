"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { getNotificationLogs, type NotificationLog } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationLogs().then((res) => {
      if (res.ok && res.data) setNotifications(res.data.notifications);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Notification Tracking</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
        {notifications.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No notifications logged"
            description="A history of all sent notifications will appear here."
          />
        )}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Channel</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Title</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Sent</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{n.user_name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textTransform: "capitalize" }}>{n.channel}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{n.title}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: n.status === "sent" ? "#ECFDF3" : "#FEF3F2", textTransform: "capitalize", color: n.status === "sent" ? "#0E8345" : "#B42318" }}>{n.status}</span>
                </td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(n.sent_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
