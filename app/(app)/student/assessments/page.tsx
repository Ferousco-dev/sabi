"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import { getUpcomingAssessments, type UpcomingAssessment } from "@/app/lib/api/student";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

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
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Upcoming Assessments</h1>

      {assessments.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No upcoming assessments"
          description="You don't have any exams or tests scheduled at the moment."
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {assessments.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={22} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "var(--gray-400)", display: "flex", gap: 12, marginTop: 2 }}>
                  <span>{a.subject}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={13} /> {a.duration ?? "—"}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(170,133,46,0.1)", color: "var(--gold)", textTransform: "capitalize" }}>{a.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}