"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { getUpcomingAssessments, type UpcomingAssessment } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<UpcomingAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingAssessments().then((res) => {
      if (res.ok && res.data) setAssessments(res.data.assessments);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Upcoming assessments" subtitle="Exams and tests scheduled for your class." />

      {assessments.length === 0 ? (
        <Card><EmptyState Icon={CalendarDays} title="No upcoming assessments" description="You don't have any exams or tests scheduled right now." /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assessments.map((a) => (
            <div key={a.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <div aria-hidden="true" style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "var(--teal)" }}>{new Date(a.date).getDate()}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase" }}>{new Date(a.date).toLocaleDateString("en-US", { month: "short" })}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-subtle)", display: "flex", gap: 12, marginTop: 3, flexWrap: "wrap" }}>
                    <span>{a.subject}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={13} aria-hidden="true" /> {a.duration ?? "—"}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                {a.type && <Badge tone="warning">{a.type}</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
