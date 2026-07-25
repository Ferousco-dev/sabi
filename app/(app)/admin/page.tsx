"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Users, BookOpen, CalendarCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudents, getAttendance, getTimetable, type Student, type AttendanceRecord, type TimetableEntry } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudents(), getAttendance(), getTimetable()]).then(([s, a, t]) => {
      if (s.ok && s.data) setStudents(s.data.students);
      if (a.ok && a.data) setAttendance(a.data.attendance);
      if (t.ok && t.data) setTimetable(t.data.timetable);
    }).finally(() => setLoading(false));
  }, []);

  const present = attendance.filter((a) => a.status === "present").length;
  const total = attendance.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title={`Welcome, ${firstName}`} subtitle="School overview for today" />

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

      <Card title="Enrolled students" padded={false}>
        {students.length === 0 ? (
          <EmptyState Icon={Users} title="No students yet" description="Enrolled students will appear here once they are registered." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>
                  {["Student", "Email", "Enrolled"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
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
