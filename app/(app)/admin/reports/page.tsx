"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { getEnrollmentReport, getTeacherWorkloadReport, getUserActivityReport } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type Tab = "enrollment" | "workload" | "activity";
const TABS: { key: Tab; label: string }[] = [
  { key: "enrollment", label: "Enrollment" },
  { key: "workload", label: "Workload" },
  { key: "activity", label: "Activity" },
];

export default function ReportsPage() {
  const [enrollment, setEnrollment] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("enrollment");

  useEffect(() => {
    Promise.all([getEnrollmentReport(), getTeacherWorkloadReport(), getUserActivityReport()]).then(([e, w, a]) => {
      if (e.ok && e.data) setEnrollment(e.data.report);
      if (w.ok && w.data) setWorkload(w.data.report);
      if (a.ok && a.data) setActivity(a.data.report);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Reports" subtitle="Enrollment, teacher workload, and user activity across the school." />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "enrollment" && (
        enrollment.length === 0 ? (
          <Card><EmptyState Icon={BarChart3} title="No enrollment data" description="Class enrollment figures will appear here once classes are populated." /></Card>
        ) : (
          <Card padded={false}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Class</th>
                    <th style={thStyle}>Section</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Students</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Teachers</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollment.map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{r.class_name}</td>
                      <td style={tdStyle}>{r.section_name ?? "—"}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "var(--gray-900)" }}>{r.student_count}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: "var(--gray-900)" }}>{r.teacher_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {tab === "workload" && (
        workload.length === 0 ? (
          <Card><EmptyState Icon={BarChart3} title="No workload data" description="Teacher workload figures will appear here once timetables are assigned." /></Card>
        ) : (
          <Card padded={false}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Teacher</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Subjects</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Classes</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {workload.map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{r.teacher_name}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.subject_count}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.class_count}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.total_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {tab === "activity" && (
        activity.length === 0 ? (
          <Card><EmptyState Icon={BarChart3} title="No activity data" description="User login and activity figures will appear here." /></Card>
        ) : (
          <Card padded={false}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Role</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Logins</th>
                    <th style={thStyle}>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{r.user_name}</td>
                      <td style={{ ...tdStyle, textTransform: "capitalize" }}>{r.role}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.login_count}</td>
                      <td style={tdStyle}>{r.last_active ? new Date(r.last_active).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}
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
