"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { UserPlus, Search, Users } from "lucide-react";
import { getEnrollments, getClasses, type Enrollment, type ClassItem } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([getClasses(), getEnrollments()]).then(([c, e]) => {
      if (c.ok && c.data) setClasses(c.data.classes);
      if (e.ok && e.data) setEnrollments(e.data.enrollments);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getEnrollments(classId).then((res) => {
      if (res.ok && res.data) setEnrollments(res.data.enrollments);
    });
  }, [classId]);

  const filtered = enrollments.filter((e) =>
    e.student_name.toLowerCase().includes(query.toLowerCase()) ||
    e.class_name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <LoadingPage />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Enrollments</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{enrollments.length} total</p>
        </div>
        <select value={classId ?? ""} onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : undefined)}
          style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enrollments…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments found"
          description={query ? "No students match your search criteria." : "Students enrolled in classes will appear here."}
        />
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Student</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Class</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Section</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Session</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{e.student_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{e.class_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{e.section_name ?? "—"}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{e.session_name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(e.enrolled_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

