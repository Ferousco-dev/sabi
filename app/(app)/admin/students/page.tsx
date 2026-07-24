"use client";
import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { getStudents, type Student } from "@/app/lib/api/schools";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getStudents().then((res) => {
      if (res.ok && res.data) setStudents(res.data.students);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading students…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Students</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>{students.length} enrolled</p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)" }} />
      </div>

      {filtered.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Users size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>{query ? "No matching students." : "No students enrolled."}</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Email</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{s.name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{s.email}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(s.enrolled_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
