"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Users, BookOpen, TrendingUp, Clock, FileText, Download } from "lucide-react";
import { getEnrollmentReport, getTeacherWorkloadReport, getUserActivityReport } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ReportsPage() {
  const [enrollment, setEnrollment] = useState<any[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("enrollment");

  useEffect(() => {
    Promise.all([getEnrollmentReport(), getTeacherWorkloadReport(), getUserActivityReport()]).then(([e, w, a]) => {
      if (e.ok && e.data) setEnrollment(e.data.report);
      if (w.ok && w.data) setWorkload(w.data.report);
      if (a.ok && a.data) setActivity(a.data.report);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Reports</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["enrollment", "workload", "activity"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ height: 34, padding: "0 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1.5px solid ${tab === t ? "var(--teal)" : "var(--border)"}`, background: tab === t ? "var(--teal-50)" : "#fff", color: tab === t ? "var(--teal)" : "var(--gray-600)", cursor: "pointer", textTransform: "capitalize" }}>
              {t} Report
            </button>
          ))}
        </div>
      </div>

      {tab === "enrollment" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Class</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Section</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Students</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Teachers</th>
            </tr></thead>
            <tbody>
              {enrollment.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{r.class_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{r.section_name ?? "—"}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right", fontWeight: 600 }}>{r.student_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right", fontWeight: 600 }}>{r.teacher_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "workload" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Teacher</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Subjects</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Classes</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Hours</th>
            </tr></thead>
            <tbody>
              {workload.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{r.teacher_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right" }}>{r.subject_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right" }}>{r.class_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right" }}>{r.total_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "activity" && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "var(--gray-50)" }}>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Role</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Logins</th>
              <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Last Active</th>
            </tr></thead>
            <tbody>
              {activity.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{r.user_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textTransform: "capitalize" }}>{r.role}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-900)", textAlign: "right" }}>{r.login_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{r.last_active ? new Date(r.last_active).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

