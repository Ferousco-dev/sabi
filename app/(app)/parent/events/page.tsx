"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getSchoolEvents } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Event = { id: number; title: string; date: string; description?: string; type: string };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolEvents().then((res) => {
      if (res.ok && res.data) setEvents(res.data.events);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <>
      <PageHeader title="School events" subtitle="Upcoming events, holidays, and important dates." />

      {events.length === 0 ? (
        <Card><EmptyState Icon={CalendarDays} title="No events scheduled" description="Upcoming school events and holidays appear here." /></Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", marginBottom: 12, letterSpacing: "-0.01em" }}>Upcoming</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {upcoming.map((e) => (
                  <div key={e.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "15px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: "var(--teal)" }}>{new Date(e.date).getDate()}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase" }}>{new Date(e.date).toLocaleDateString("en-US", { month: "short" })}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{e.title}</span>
                        {e.type && <Badge tone="teal">{e.type}</Badge>}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-subtle)", marginTop: 3 }}>{new Date(e.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                      {e.description && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>{e.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <details>
              <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--text-subtle)", cursor: "pointer", marginBottom: 12 }}>Past events ({past.length})</summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {past.map((e) => (
                  <div key={e.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "13px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", gap: 12 }}>
                    <CalendarDays size={18} style={{ color: "var(--gray-300)", flexShrink: 0 }} aria-hidden="true" />
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{e.title}</div>
                      <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{new Date(e.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </>
  );
}
