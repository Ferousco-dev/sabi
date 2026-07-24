"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, BookOpen, GraduationCap } from "lucide-react";
import { getTeachers, type Teacher } from "@/app/lib/api/schools";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getTeachers().then((res) => {
      if (res.ok && res.data) setTeachers(res.data.teachers);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) || t.email.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading teachers…</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Teachers</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{teachers.length} total</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search teachers…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <Users size={40} style={{ color: "var(--gray-300)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--gray-500)" }}>{query ? "No matching teachers." : "No teachers found."}</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Email</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Department</th>
                <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Subjects</th>
                <th style={{ textAlign: "center", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Classes</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <Link href={`/admin/teachers/${t.id}`} style={{ fontSize: 14, fontWeight: 500, color: "var(--teal)", textDecoration: "none" }}>{t.name}</Link>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{t.email}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{t.department_name ?? "—"}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textAlign: "center" }}>{t.subject_count}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textAlign: "center" }}>{t.class_count}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: t.status === "active" ? "#ECFDF3" : "#FEF3F2", color: t.status === "active" ? "#0E8345" : "#B42318", textTransform: "capitalize" }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

