"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotificationLogs, type NotificationLog } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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
    <>
      <PageHeader title="Notification Tracking" subtitle="A history of every notification sent across channels." />

      <Card padded={false}>
        {notifications.length === 0 ? (
          <EmptyState Icon={Bell} title="No notifications logged" description="A history of all sent notifications will appear here." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Channel</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Sent</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{n.user_name}</td>
                    <td style={{ ...tdStyle, textTransform: "capitalize" }}>{n.channel}</td>
                    <td style={tdStyle}>{n.title}</td>
                    <td style={tdStyle}>
                      <Badge tone={n.status === "sent" ? "success" : "danger"} dot>
                        {n.status[0].toUpperCase() + n.status.slice(1)}
                      </Badge>
                    </td>
                    <td style={tdStyle}>{new Date(n.sent_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textAlign: "left" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
