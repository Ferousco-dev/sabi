"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Calendar, AlertTriangle } from "lucide-react";
import { getSchoolEvents } from "@/app/lib/api/parent";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolEvents().then((res) => {
      if (res.ok && res.data) setEvents(res.data.events);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>School Events</h1>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Upcoming Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map((e) => (
              <div key={e.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={20} color="var(--teal)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>{new Date(e.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                  {e.description && <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 4 }}>{e.description}</div>}
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-400)", textTransform: "capitalize", marginTop: 6, display: "inline-block" }}>{e.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <details>
          <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-500)", cursor: "pointer", marginBottom: 12 }}>Past Events ({past.length})</summary>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {past.map((e) => (
              <div key={e.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={20} color="var(--gray-300)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: "var(--gray-500)" }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{new Date(e.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {events.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No events scheduled"
          description="Upcoming school events and holidays will appear here."
        />
      )}
    </div>
  );
}