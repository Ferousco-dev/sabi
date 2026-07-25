"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { TrendingUp, Users, BookOpen, CalendarCheck } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudents, getAttendance, getTimetable, type Student, type AttendanceRecord, type TimetableEntry } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";

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

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "var(--gray-500)" }}>School overview for today</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: Users, label: "Total Students", value: students.length, color: "var(--teal)" },
          { icon: BookOpen, label: "Today's Classes", value: timetable.length, color: "var(--gold)" },
          { icon: CalendarCheck, label: "Present Today", value: total > 0 ? `${Math.round((present / total) * 100)}%` : "—", color: "#0E8345" },
          { icon: TrendingUp, label: "Attendance Rate", value: total > 0 ? `${present}/${total}` : "—", color: "var(--teal)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {students.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>Enrolled Students</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--gray-50)" }}>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{s.name}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{s.email}</td>
                    <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(s.enrolled_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
