"use client";

export const dynamic = "force-dynamic";
import { useMemo } from "react";
import { Users, BookOpen, CalendarCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { useResource } from "@/app/lib/useResource";
import { getStudents, getAttendance, getTimetable, type Student, type AttendanceRecord, type TimetableEntry } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { AreaChart, type AreaPoint } from "@/app/components/dashboard/AreaChart";
import { initials } from "@/app/lib/dashboard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Cumulative enrolment by month, from real enrolled_at dates (last 6 buckets). */
function enrolmentTrend(students: Student[]): AreaPoint[] {
  if (students.length === 0) return [];
  const byMonth = new Map<string, number>();
  for (const s of students) {
    const d = new Date(s.enrolled_at);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  const keys = [...byMonth.keys()].sort();
  let cum = 0;
  const points = keys.map((k) => {
    cum += byMonth.get(k)!;
    return { label: MONTHS[Number(k.split("-")[1])], value: cum };
  });
  return points.slice(-6);
}

const ATT = [
  { key: "present", label: "Present", color: "#12B76A" },
  { key: "late", label: "Late", color: "#F79009" },
  { key: "absent", label: "Absent", color: "#F04438" },
  { key: "excused", label: "Excused", color: "var(--teal-600)" },
] as const;

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, loading } = useResource("admin:overview", async () => {
    const [s, a, t] = await Promise.all([getStudents(), getAttendance(), getTimetable()]);
    return {
      students: s.ok && s.data ? s.data.students : ([] as Student[]),
      attendance: a.ok && a.data ? a.data.attendance : ([] as AttendanceRecord[]),
      timetable: t.ok && t.data ? t.data.timetable : ([] as TimetableEntry[]),
    };
  });
  const students = data?.students ?? [];
  const attendance = data?.attendance ?? [];
  const timetable = data?.timetable ?? [];

  const trend = useMemo(() => enrolmentTrend(students), [students]);
  const present = attendance.filter((a) => a.status === "present").length;
  const total = attendance.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const attCounts = (k: string) => attendance.filter((a) => a.status === k).length;

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} subtitle="Here is how your school is doing today." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        {[
          { key: "students", label: "Total students", value: students.length, Icon: Users },
          { key: "classes", label: "Today's classes", value: timetable.length, Icon: BookOpen },
          { key: "present", label: "Present today", value: present, Icon: UserCheck },
          { key: "rate", label: "Attendance rate", value: rate, suffix: "%", Icon: CalendarCheck },
        ].map((s, i) => (
          <div key={s.key} className="dash-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <StatCard label={s.label} value={s.value} suffix={s.suffix} Icon={s.Icon} />
          </div>
        ))}
      </div>

      {/* Hero: enrolment trend + attendance breakdown. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch", marginBottom: 20 }}>
        <div style={{ flex: "2 1 420px", minWidth: 0 }}>
          <Card title="Enrolment trend">
            {trend.length < 2 ? (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-subtle)", fontSize: 14, textAlign: "center", padding: 20 }}>
                Enrolment will chart here as students join over time.
              </div>
            ) : (
              <AreaChart data={trend} caption="Cumulative student enrolment by month" />
            )}
          </Card>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <Card title="Attendance today">
            {total > 0 && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <AttendanceRing rate={rate} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ATT.map((a) => {
                const count = attCounts(a.key);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={a.key}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
                        <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "var(--radius-full)", background: a.color }} />
                        {a.label}
                      </span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: "var(--radius-full)", background: "var(--gray-100)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: a.color, borderRadius: "var(--radius-full)" }} />
                    </div>
                  </div>
                );
              })}
              {total === 0 && <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", paddingTop: 8 }}>No attendance recorded yet today.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card title="Enrolled students" padded={false}>
        {students.length === 0 ? (
          <EmptyState Icon={Users} title="No students yet" description="Enrolled students will appear here once they are registered." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>{["Student", "Email", "Enrolled"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {initials(s.name)}
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</span>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "var(--text-subtle)" }}>{s.email}</td>
                    <td style={{ ...tdStyle, color: "var(--text-subtle)" }}>{new Date(s.enrolled_at).toLocaleDateString()}</td>
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

/** A compact SVG donut showing today's attendance rate (present + late). */
function AttendanceRing({ rate }: { rate: number }) {
  const size = 128, stroke = 12, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, rate)) / 100) * circ;
  const tone = rate >= 90 ? "#12B76A" : rate >= 75 ? "#F79009" : "#F04438";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Attendance rate ${rate} percent`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 26, fontWeight: 700, fill: "var(--gray-900)", fontVariantNumeric: "tabular-nums" }}>{rate}%</text>
      <text x="50%" y="64%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fontWeight: 600, fill: "var(--text-subtle)", letterSpacing: "0.04em", textTransform: "uppercase" }}>present</text>
    </svg>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
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
