"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { BookText, Plus, Building } from "lucide-react";
import { getSubjects, createSubject, getDepartments, type Subject, type Department } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [deptId, setDeptId] = useState<number | undefined>(undefined);

  const load = () => Promise.all([getSubjects(), getDepartments()]).then(([s, d]) => {
    if (s.ok && s.data) setSubjects(s.data.subjects);
    if (d.ok && d.data) setDepartments(d.data.departments);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    await createSubject({ name: name.trim(), code: code.trim(), department_id: deptId });
    setName(""); setCode(""); setDeptId(undefined);
    load();
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Subjects</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Subject Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mathematics" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 180 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MTH" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 100 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Department</label>
          <select value={deptId ?? ""} onChange={(e) => setDeptId(e.target.value ? Number(e.target.value) : undefined)}
            style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff", width: 160 }}>
            <option value="">None</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Subject
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subjects.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookText size={20} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{s.name} <span style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 400 }}>({s.code})</span></div>
                <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{s.department_name ?? "No department"} · {s.class_count} classes</div>
              </div>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <EmptyState
            icon={BookText}
            title="No subjects"
            description="Add the subjects taught at your school to organize curriculum."
          />
        )}
      </div>
    </div>
  );
}

