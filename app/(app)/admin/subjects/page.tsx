"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { BookText, BookOpen, Building, Users, Pencil, Trash2 } from "lucide-react";
import { getSubjects, createSubject, updateSubject, deleteSubject, getDepartments, createDepartment, updateDepartment, deleteDepartment, getTeachers, type Subject, type Department, type Teacher } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import { Modal } from "@/app/components/ui/Modal";
import { useConfirm } from "@/app/components/ui/confirm";
import { useResource } from "@/app/lib/useResource";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const fieldStyle = { ...inputStyle, width: "100%" } as const;
const iconBtnStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg)", cursor: "pointer" } as const;
const errorBoxStyle = { padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 } as const;

type Tab = "subjects" | "departments";
type Bundle = { subjects: Subject[]; departments: Department[]; teachers: Teacher[] };

async function loadBundle(): Promise<Bundle> {
  const [s, d, t] = await Promise.all([getSubjects(), getDepartments(), getTeachers()]);
  return {
    subjects: s.ok && s.data ? s.data.subjects : [],
    departments: d.ok && d.data ? d.data.departments : [],
    teachers: t.ok && t.data ? t.data.teachers : [],
  };
}

export default function SubjectsPage() {
  const confirm = useConfirm();
  const { data, loading, refresh } = useResource<Bundle>("admin:subjects", loadBundle);
  const subjects = data?.subjects ?? [];
  const departments = data?.departments ?? [];
  const teachers = data?.teachers ?? [];

  const [tab, setTab] = useState<Tab>("subjects");

  // Subject create form
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [deptId, setDeptId] = useState<number | undefined>(undefined);

  // Department create form
  const [savingDept, setSavingDept] = useState(false);
  const [deptName, setDeptName] = useState("");

  // Subject edit modal
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [subjForm, setSubjForm] = useState({ name: "", code: "", department_id: "" });
  const [savingSubjEdit, setSavingSubjEdit] = useState(false);
  const [subjEditError, setSubjEditError] = useState<string | null>(null);

  // Department edit modal
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({ name: "", head_teacher_id: "" });
  const [savingDeptEdit, setSavingDeptEdit] = useState(false);
  const [deptEditError, setDeptEditError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    setSaving(true);
    const res = await createSubject({ name: name.trim(), code: code.trim(), department_id: deptId });
    setSaving(false);
    if (res.ok) {
      setName(""); setCode(""); setDeptId(undefined);
      refresh();
    }
  }

  async function handleAddDept(e: React.FormEvent) {
    e.preventDefault();
    if (!deptName.trim()) return;
    setSavingDept(true);
    const res = await createDepartment({ name: deptName.trim() });
    setSavingDept(false);
    if (res.ok) {
      setDeptName("");
      refresh();
    }
  }

  function openEditSubject(s: Subject) {
    setEditSubject(s);
    setSubjForm({ name: s.name, code: s.code, department_id: s.department_id ? String(s.department_id) : "" });
    setSubjEditError(null);
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!editSubject || !subjForm.name.trim() || !subjForm.code.trim()) return;
    setSavingSubjEdit(true); setSubjEditError(null);
    const res = await updateSubject(editSubject.id, {
      name: subjForm.name.trim(),
      code: subjForm.code.trim(),
      department_id: subjForm.department_id ? Number(subjForm.department_id) : undefined,
    });
    setSavingSubjEdit(false);
    if (res.ok) { setEditSubject(null); refresh(); }
    else setSubjEditError("Could not update subject. Please try again.");
  }

  async function handleDeleteSubject(s: Subject) {
    const ok = await confirm({ title: `Delete ${s.name}?`, message: "This subject will be removed. This cannot be undone.", tone: "danger", confirmLabel: "Delete" });
    if (!ok) return;
    const res = await deleteSubject(s.id);
    if (res.ok) refresh();
  }

  function openEditDept(d: Department) {
    setEditDept(d);
    setDeptForm({ name: d.name, head_teacher_id: "" });
    setDeptEditError(null);
  }

  async function handleSaveDept(e: React.FormEvent) {
    e.preventDefault();
    if (!editDept || !deptForm.name.trim()) return;
    setSavingDeptEdit(true); setDeptEditError(null);
    const res = await updateDepartment(editDept.id, {
      name: deptForm.name.trim(),
      head_teacher_id: deptForm.head_teacher_id ? Number(deptForm.head_teacher_id) : null,
    });
    setSavingDeptEdit(false);
    if (res.ok) { setEditDept(null); refresh(); }
    else setDeptEditError("Could not update department. Please try again.");
  }

  async function handleDeleteDept(d: Department) {
    const ok = await confirm({ title: `Delete ${d.name}?`, message: "This department will be removed. This cannot be undone.", tone: "danger", confirmLabel: "Delete" });
    if (!ok) return;
    const res = await deleteDepartment(d.id);
    if (res.ok) refresh();
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
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{s.name} <span style={{ fontSize: 12, color: "var(--text-subtle)", fontWeight: 400 }}>({s.code})</span></div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <BookOpen size={13} /> {s.department_name ?? "No department"} · {s.class_count} classes
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button type="button" onClick={() => openEditSubject(s)} aria-label={`Edit ${s.name}`} style={iconBtnStyle}>
                      <Pencil size={15} style={{ color: "var(--text-muted)" }} />
                    </button>
                    <button type="button" onClick={() => handleDeleteSubject(s)} aria-label={`Delete ${s.name}`} style={iconBtnStyle}>
                      <Trash2 size={15} style={{ color: "#D92D20" }} />
                    </button>
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
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{d.name}</div>
                      {d.head_teacher_name && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Head: {d.head_teacher_name}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button type="button" onClick={() => openEditDept(d)} aria-label={`Edit ${d.name}`} style={iconBtnStyle}>
                        <Pencil size={15} style={{ color: "var(--text-muted)" }} />
                      </button>
                      <button type="button" onClick={() => handleDeleteDept(d)} aria-label={`Delete ${d.name}`} style={iconBtnStyle}>
                        <Trash2 size={15} style={{ color: "#D92D20" }} />
                      </button>
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

      <Modal open={!!editSubject} onClose={() => setEditSubject(null)} title="Edit subject">
        {subjEditError && <div role="alert" style={errorBoxStyle}>{subjEditError}</div>}
        <form onSubmit={handleSaveSubject}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="es-name" style={labelStyle}>Subject name</label>
              <input id="es-name" value={subjForm.name} onChange={(e) => setSubjForm((f) => ({ ...f, name: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="es-code" style={labelStyle}>Code</label>
              <input id="es-code" value={subjForm.code} onChange={(e) => setSubjForm((f) => ({ ...f, code: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="es-dept" style={labelStyle}>Department</label>
              <select id="es-dept" value={subjForm.department_id} onChange={(e) => setSubjForm((f) => ({ ...f, department_id: e.target.value }))} style={{ ...fieldStyle, cursor: "pointer" }}>
                <option value="">None</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditSubject(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={savingSubjEdit || !subjForm.name.trim() || !subjForm.code.trim()}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: savingSubjEdit ? "not-allowed" : "pointer", opacity: savingSubjEdit || !subjForm.name.trim() || !subjForm.code.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {savingSubjEdit ? <LoadingSpinner size={16} color="#fff" /> : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editDept} onClose={() => setEditDept(null)} title="Edit department">
        {deptEditError && <div role="alert" style={errorBoxStyle}>{deptEditError}</div>}
        <form onSubmit={handleSaveDept}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="ed-name" style={labelStyle}>Department name</label>
              <input id="ed-name" value={deptForm.name} onChange={(e) => setDeptForm((f) => ({ ...f, name: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="ed-head" style={labelStyle}>Head teacher</label>
              <select id="ed-head" value={deptForm.head_teacher_id} onChange={(e) => setDeptForm((f) => ({ ...f, head_teacher_id: e.target.value }))} style={{ ...fieldStyle, cursor: "pointer" }}>
                <option value="">No head teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditDept(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={savingDeptEdit || !deptForm.name.trim()}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: savingDeptEdit ? "not-allowed" : "pointer", opacity: savingDeptEdit || !deptForm.name.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {savingDeptEdit ? <LoadingSpinner size={16} color="#fff" /> : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
