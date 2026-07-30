"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { BookText, BookOpen, Building, Users } from "lucide-react";
import { getSubjects, createSubject, getDepartments, createDepartment, type Subject, type Department } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

type Tab = "subjects" | "departments";

export default function SubjectsPage() {
  const [tab, setTab] = useState<Tab>("subjects");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Subject form
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [deptId, setDeptId] = useState<number | undefined>(undefined);

  // Department form
  const [savingDept, setSavingDept] = useState(false);
  const [deptName, setDeptName] = useState("");

  const load = () => Promise.all([getSubjects(), getDepartments()]).then(([s, d]) => {
    if (s.ok && s.data) setSubjects(s.data.subjects);
    if (d.ok && d.data) setDepartments(d.data.departments);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    setSaving(true);
    await createSubject({ name: name.trim(), code: code.trim(), department_id: deptId });
    setName(""); setCode(""); setDeptId(undefined);
    await load();
    setSaving(false);
  }

  async function handleAddDept(e: React.FormEvent) {
    e.preventDefault();
    if (!deptName.trim()) return;
    setSavingDept(true);
    await createDepartment({ name: deptName.trim() });
    setDeptName("");
    await load();
    setSavingDept(false);
  }

  if (loading) return <LoadingPage />;

  const valid = name.trim() && code.trim();
  const validDept = !!deptName.trim();

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "subjects", label: "Subjects", count: subjects.length },
    { key: "departments", label: "Departments", count: departments.length },
  ];

  return (
    <>
      <PageHeader
        title="Subjects & departments"
        subtitle="Subjects taught at your school, organized by department."
        actions={<Badge tone="teal">{tab === "subjects" ? `${subjects.length} subjects` : `${departments.length} departments`}</Badge>}
      />

      <div role="tablist" aria-label="Curriculum view" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} role="tab" aria-selected={active} onClick={() => setTab(t.key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "subjects" ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
          <Card title="Add a subject">
            <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 180px" }}>
                <label style={labelStyle}>Subject name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mathematics" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <div style={{ flex: "0 1 120px" }}>
                <label style={labelStyle}>Code</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MTH" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <div style={{ flex: "1 1 160px" }}>
                <label style={labelStyle}>Department</label>
                <select value={deptId ?? ""} onChange={(e) => setDeptId(e.target.value ? Number(e.target.value) : undefined)} style={{ ...inputStyle, width: "100%", cursor: "pointer" }}>
                  <option value="">None</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add subject"}
              </button>
            </form>
          </Card>

          {subjects.length === 0 ? (
            <Card><EmptyState Icon={BookText} title="No subjects" description="Add the subjects taught at your school to organize curriculum." /></Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {subjects.map((s) => (
                <div key={s.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BookText size={20} color="var(--teal)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{s.name} <span style={{ fontSize: 12, color: "var(--text-subtle)", fontWeight: 400 }}>({s.code})</span></div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <BookOpen size={13} /> {s.department_name ?? "No department"} · {s.class_count} classes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
          <Card title="Add a department">
            <form onSubmit={handleAddDept} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 220px" }}>
                <label style={labelStyle}>Department name</label>
                <input value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder="e.g. Science Department" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <button type="submit" disabled={!validDept || savingDept} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !validDept || savingDept ? "not-allowed" : "pointer", opacity: !validDept || savingDept ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                {savingDept ? <LoadingSpinner size={15} color="#fff" /> : "Add department"}
              </button>
            </form>
          </Card>

          {departments.length === 0 ? (
            <Card><EmptyState Icon={Building} title="No departments" description="Categorize your subjects and teachers into departments." /></Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {departments.map((d) => (
                <div key={d.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building size={20} color="var(--teal)" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{d.name}</div>
                      {d.head_teacher_name && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Head: {d.head_teacher_name}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge tone="neutral"><BookOpen size={13} /> {d.subject_count} subjects</Badge>
                    <Badge tone="neutral"><Users size={13} /> {d.teacher_count} teachers</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
