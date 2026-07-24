"use client";
import { useEffect, useState } from "react";
import { Building, Plus, BookOpen, Users } from "lucide-react";
import { getDepartments, createDepartment, type Department } from "@/app/lib/api/schools";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const load = () => getDepartments().then((res) => {
    if (res.ok && res.data) setDepartments(res.data.departments);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createDepartment({ name: name.trim() });
    setName("");
    load();
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading departments…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Departments</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Department Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Science Department" style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Department
        </button>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {departments.map((d) => (
          <div key={d.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building size={20} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{d.name}</div>
                {d.head_teacher_name && <div style={{ fontSize: 13, color: "var(--gray-500)" }}>Head: {d.head_teacher_name}</div>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--gray-500)", paddingLeft: 56 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}><BookOpen size={13} /> {d.subject_count} subjects</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={13} /> {d.teacher_count} teachers</span>
            </div>
          </div>
        ))}
        {departments.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No departments created yet.</p>}
      </div>
    </div>
  );
}
