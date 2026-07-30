"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { BarChart3, Users, BookOpen, CalendarCheck } from "lucide-react";
import {
  getStudents,
  getAttendance,
  getTimetable,
  getEnrollmentReport,
  getTeacherWorkloadReport,
  getUserActivityReport,
} from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

type TopTab = "overview" | "reports";
type ReportTab = "enrollment" | "workload" | "activity";

const REPORT_TABS: { key: ReportTab; label: string }[] = [
  { key: "enrollment", label: "Enrollment" },
  { key: "workload", label: "Workload" },
  { key: "activity", label: "Activity" },
];

export default function AnalyticsPage() {
  const [topTab, setTopTab] = useState<TopTab>("overview");

  // Overview (analytics tiles)
  const [studentCount, setStudentCount] = useState(0);
  const [todayPresent, setTodayPresent] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Reports
  const [enrollment, setEnrollment] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportTab, setReportTab] = useState<ReportTab>("enrollment");

  useEffect(() => {
    Promise.all([getStudents(), getAttendance(), getTimetable()])
      .then(([students, attendance, timetable]) => {
        setStudentCount(students.ok && students.data ? students.data.students.length : 0);
        setTodayPresent(
          attendance.ok && attendance.data
            ? attendance.data.attendance.filter((r: any) => r.status === "present").length
            : 0,
        );
        setTodayTotal(attendance.ok && attendance.data ? attendance.data.attendance.length : 0);
        setClassCount(timetable.ok && timetable.data ? timetable.data.timetable.length : 0);
      })
      .finally(() => setOverviewLoading(false));
  }, []);

  useEffect(() => {
    Promise.all([getEnrollmentReport(), getTeacherWorkloadReport(), getUserActivityReport()])
      .then(([e, w, a]) => {
        if (e.ok && e.data) setEnrollment(e.data.report);
        if (w.ok && w.data) setWorkload(w.data.report);
        if (a.ok && a.data) setActivity(a.data.report);
      })
      .finally(() => setReportsLoading(false));
  }, []);

  const metrics = [
    { icon: Users, label: "Total Students", value: String(studentCount), change: "+12 this term" },
    { icon: CalendarCheck, label: "Today's Attendance", value: todayTotal > 0 ? `${Math.round((todayPresent / todayTotal) * 100)}%` : "—", change: `${todayPresent}/${todayTotal} present` },
    { icon: BookOpen, label: "Classes Today", value: String(classCount), change: "Across all levels" },
    { icon: BarChart3, label: "Avg. Class Size", value: classCount > 0 && studentCount > 0 ? String(Math.round(studentCount / classCount)) : "—", change: "Students per class" },
  ];

  const topTabs: { key: TopTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <>
      <PageHeader title="Analytics & reports" subtitle="A snapshot of enrollment, attendance, and class activity, plus detailed reports across the school." />

      <div role="tablist" aria-label="Analytics view" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {topTabs.map((t) => {
          const active = topTab === t.key;
          return (
            <button key={t.key} role="tab" aria-selected={active} onClick={() => setTopTab(t.key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {topTab === "overview" ? (
        overviewLoading ? (
          <LoadingPage />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {metrics.map(({ icon: Icon, label, value, change }, i) => (
              <div
                key={label}
                className="dash-rise stat-card"
                style={{
                  animationDelay: `${i * 70}ms`,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xs)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-subtle)" }}>{label}</span>
                  <span
                    aria-hidden="true"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", flexShrink: 0 }}
                  >
                    <Icon size={18} strokeWidth={1.9} style={{ color: "var(--teal)" }} />
                  </span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: 12.5, color: "var(--teal)", fontWeight: 600 }}>{change}</div>
              </div>
            ))}
          </div>
        )
      ) : reportsLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {REPORT_TABS.map((t) => {
              const active = reportTab === t.key;
              return (
                <button key={t.key} onClick={() => setReportTab(t.key)}
                  style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
                  {t.label}
                </button>
              );
            })}
          </div>

          {reportTab === "enrollment" && (
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

          {reportTab === "workload" && (
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

          {reportTab === "activity" && (
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
