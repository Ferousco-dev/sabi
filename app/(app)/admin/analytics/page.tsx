import { Suspense } from "react";
import { BarChart3, Users, BookOpen, CalendarCheck } from "lucide-react";
import { getStudents, getAttendance, getTimetable } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";

export const dynamic = "force-dynamic";

async function AnalyticsContent() {
  const [students, attendance, timetable] = await Promise.all([
    getStudents(),
    getAttendance(),
    getTimetable(),
  ]);

  const studentCount = students.ok && students.data ? students.data.students.length : 0;
  const todayPresent = attendance.ok && attendance.data ? attendance.data.attendance.filter((r: any) => r.status === "present").length : 0;
  const todayTotal = attendance.ok && attendance.data ? attendance.data.attendance.length : 0;
  const classCount = timetable.ok && timetable.data ? timetable.data.timetable.length : 0;

  const metrics = [
    { icon: Users, label: "Total Students", value: String(studentCount), change: "+12 this term" },
    { icon: CalendarCheck, label: "Today's Attendance", value: todayTotal > 0 ? `${Math.round((todayPresent / todayTotal) * 100)}%` : "—", change: `${todayPresent}/${todayTotal} present` },
    { icon: BookOpen, label: "Classes Today", value: String(classCount), change: "Across all levels" },
    { icon: BarChart3, label: "Avg. Class Size", value: classCount > 0 && studentCount > 0 ? String(Math.round(studentCount / classCount)) : "—", change: "Students per class" },
  ];

  return (
    <>
      <PageHeader title="Analytics" subtitle="A snapshot of enrollment, attendance, and class activity across the school." />
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
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AnalyticsContent />
    </Suspense>
  );
}
