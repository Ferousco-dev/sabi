"use client";
import { useEffect, useState } from "react";
import { BarChart3, Users, BookOpen, CalendarCheck } from "lucide-react";
import { getStudents, getAttendance, getTimetable } from "@/app/lib/api/schools";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [todayPresent, setTodayPresent] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    Promise.all([getStudents(), getAttendance(), getTimetable()]).then(([s, a, t]) => {
      if (s.ok && s.data) setStudentCount(s.data.students.length);
      if (a.ok && a.data) {
        setTodayPresent(a.data.attendance.filter((r) => r.status === "present").length);
        setTodayTotal(a.data.attendance.length);
      }
      if (t.ok && t.data) setClassCount(t.data.timetable.length);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading analytics…</div>;

  const metrics = [
    { icon: Users, label: "Total Students", value: studentCount, change: "+12 this term" },
    { icon: CalendarCheck, label: "Today's Attendance", value: todayTotal > 0 ? `${Math.round((todayPresent / todayTotal) * 100)}%` : "—", change: `${todayPresent}/${todayTotal} present` },
    { icon: BookOpen, label: "Classes Today", value: classCount, change: "Across all levels" },
    { icon: BarChart3, label: "Avg. Class Size", value: classCount > 0 && studentCount > 0 ? Math.round(studentCount / classCount) : "—", change: "Students per class" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map(({ icon: Icon, label, value, change }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color="var(--teal)" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: "var(--teal)", marginTop: 6, fontWeight: 500 }}>{change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
