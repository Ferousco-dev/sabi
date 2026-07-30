"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus, Users, Columns3, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { getClasses, createClass, updateClass, deleteClass, getSections, createSection, updateSection, deleteSection, type ClassItem, type Section } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Modal } from "@/app/components/ui/Modal";
import { useConfirm } from "@/app/components/ui/confirm";
import { useResource } from "@/app/lib/useResource";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block" as const, marginBottom: 6 };
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const iconBtnStyle = { width: 34, height: 34, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as const;

type Tab = "classes" | "sections";

export default function ClassesPage() {
  const [tab, setTab] = useState<Tab>("classes");
  const confirm = useConfirm();

  // Classes tab (cached)
  const { data: classesData, loading, refresh } = useResource("admin:classes", getClasses);
  const classes = classesData?.ok && classesData.data ? classesData.data.classes : [];
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Sections tab
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [sectionClassId, setSectionClassId] = useState<number | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [sectionError, setSectionError] = useState<string | null>(null);

  // Edit modals
  const [editClass, setEditClass] = useState<ClassItem | null>(null);
  const [editClassName, setEditClassName] = useState("");
  const [savingClass, setSavingClass] = useState(false);
  const [editClassError, setEditClassError] = useState<string | null>(null);

  const [editSection, setEditSection] = useState<Section | null>(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [savingSection, setSavingSection] = useState(false);
  const [editSectionError, setEditSectionError] = useState<string | null>(null);

  // Default the section-tab class selector once classes load.
  useEffect(() => {
    if (sectionClassId === null && classes.length > 0) setSectionClassId(classes[0].id);
  }, [classes, sectionClassId]);

  const loadSections = (classId: number) => getSections(classId).then((res) => {
    if (res.ok && res.data) setSections(res.data.sections);
  });

  useEffect(() => {
    if (!sectionClassId) { setSections([]); return; }
    loadSections(sectionClassId);
  }, [sectionClassId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true); setAddError(null);
    const res = await createClass({ name: name.trim() });
    setAdding(false);
    if (res.ok && res.data?.success) {
      setName("");
      refresh();
    } else {
      setAddError("Could not add class. Please try again.");
    }
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!sectionClassId || !sectionName.trim()) return;
    setSaving(true); setSectionError(null);
    const res = await createSection({ class_id: sectionClassId, name: sectionName.trim() });
    setSaving(false);
    if (res.ok && res.data?.success) {
      setSectionName("");
      await loadSections(sectionClassId);
      refresh(); // section_count on class cards changes
    } else {
      setSectionError("Could not add section. Please try again.");
    }
  }

  function openEditClass(c: ClassItem) {
    setEditClass(c); setEditClassName(c.name); setEditClassError(null);
  }

  async function handleUpdateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!editClass || !editClassName.trim()) return;
    setSavingClass(true); setEditClassError(null);
    const res = await updateClass(editClass.id, { name: editClassName.trim() });
    setSavingClass(false);
    if (res.ok && res.data?.success) {
      setEditClass(null);
      refresh();
    } else {
      setEditClassError("Could not save changes. Please try again.");
    }
  }

  async function handleDeleteClass(c: ClassItem) {
    if (!(await confirm({ title: `Delete ${c.name}?`, message: "The class and its sections will be permanently removed. This cannot be undone.", confirmLabel: "Delete", tone: "danger" }))) return;
    const res = await deleteClass(c.id);
    if (res.ok && res.data?.success) {
      if (sectionClassId === c.id) setSectionClassId(null);
      refresh();
    } else {
      window.alert("Could not delete the class. Please try again.");
    }
  }

  function openEditSection(s: Section) {
    setEditSection(s); setEditSectionName(s.name); setEditSectionError(null);
  }

  async function handleUpdateSection(e: React.FormEvent) {
    e.preventDefault();
    if (!editSection || !editSectionName.trim()) return;
    setSavingSection(true); setEditSectionError(null);
    const res = await updateSection(editSection.id, { class_id: editSection.class_id, name: editSectionName.trim() });
    setSavingSection(false);
    if (res.ok && res.data?.success) {
      const target = editSection.class_id;
      setEditSection(null);
      await loadSections(target);
    } else {
      setEditSectionError("Could not save changes. Please try again.");
    }
  }

  async function handleDeleteSection(s: Section) {
    if (!(await confirm({ title: `Delete Section ${s.name}?`, message: "This section will be permanently removed. This cannot be undone.", confirmLabel: "Delete", tone: "danger" }))) return;
    const res = await deleteSection(s.id);
    if (res.ok && res.data?.success) {
      await loadSections(s.class_id);
      refresh(); // section_count on class cards changes
    } else {
      window.alert("Could not delete the section. Please try again.");
    }
  }

  if (loading) return <LoadingPage />;

  const sectionValid = !!sectionClassId && !!sectionName.trim();

  const tabs: { key: Tab; label: string }[] = [
    { key: "classes", label: "Classes" },
    { key: "sections", label: "Sections" },
  ];

  return (
    <>
      <PageHeader title="Classes" subtitle="Organise students into classes and sections." actions={tab === "classes" ? <Badge tone="teal">{classes.length} classes</Badge> : (
        classes.length > 0 ? (
          <select value={sectionClassId ?? ""} onChange={(e) => setSectionClassId(Number(e.target.value))} aria-label="Class"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        ) : null
      )} />

      <div role="tablist" aria-label="Classes view" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button key={key} role="tab" aria-selected={active} onClick={() => setTab(key)}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-full)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${active ? "var(--teal)" : "var(--border-strong)"}`, background: active ? "var(--teal)" : "var(--bg)", color: active ? "#fff" : "var(--text-muted)" }}>
              {label}
            </button>
          );
        })}
      </div>

      {tab === "classes" ? (
        <>
          <Card title="Add a class" style={{ marginBottom: 20 }}>
            {addError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 14 }}>{addError}</div>}
            <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 220px" }}>
                <label htmlFor="cls" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Class name</label>
                <input id="cls" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. JSS 1"
                  style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
              </div>
              <button type="submit" disabled={adding || !name.trim()}
                style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !name.trim() ? "not-allowed" : "pointer", opacity: adding || !name.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add class
              </button>
            </form>
          </Card>

          {classes.length === 0 ? (
            <Card><EmptyState Icon={GraduationCap} title="No classes yet" description="Add your first class like JSS 1 or Grade 10 above." /></Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {classes.map((c) => (
                <div key={c.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-xs)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <GraduationCap size={20} style={{ color: "var(--teal)" }} />
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button" onClick={() => openEditClass(c)} aria-label={`Edit ${c.name}`} style={iconBtnStyle}>
                        <Pencil size={15} style={{ color: "var(--text-subtle)" }} />
                      </button>
                      <button type="button" onClick={() => handleDeleteClass(c)} aria-label={`Delete ${c.name}`} style={{ ...iconBtnStyle, color: "#B42318" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <Link href={`/admin/classes/${c.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      {c.name}
                      <ChevronRight size={18} style={{ color: "var(--gray-300)" }} aria-hidden="true" />
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 12.5, color: "var(--text-subtle)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Users size={14} aria-hidden="true" /> {c.student_count ?? 0}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Columns3 size={14} aria-hidden="true" /> {c.section_count ?? 0} sections</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
          {classes.length === 0 ? (
            <Card><EmptyState Icon={GraduationCap} title="No classes yet" description="Create a class in the Classes tab first, then add sections like A, B, or Gold, Silver to it." /></Card>
          ) : (
            <>
              <Card title="Add a section">
                {sectionError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 14 }}>{sectionError}</div>}
                <form onSubmit={handleAddSection} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 220px" }}>
                    <label style={labelStyle}>Section name</label>
                    <input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="e.g. A" style={{ ...inputStyle, width: "100%" }} />
                  </div>
                  <button type="submit" disabled={!sectionValid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !sectionValid || saving ? "not-allowed" : "pointer", opacity: !sectionValid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                    {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add section"}
                  </button>
                </form>
              </Card>

              {sections.length === 0 ? (
                <Card><EmptyState Icon={Columns3} title="No sections" description="Create sections (like A, B, or Gold, Silver) for this class." /></Card>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                  {sections.map((s) => (
                    <div key={s.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Columns3 size={20} color="var(--teal)" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Section {s.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <Users size={13} /> {s.student_count ?? 0} students
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => openEditSection(s)} aria-label={`Edit section ${s.name}`} style={iconBtnStyle}>
                          <Pencil size={15} style={{ color: "var(--text-subtle)" }} />
                        </button>
                        <button type="button" onClick={() => handleDeleteSection(s)} aria-label={`Delete section ${s.name}`} style={{ ...iconBtnStyle, color: "#B42318" }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Modal open={!!editClass} onClose={() => setEditClass(null)} title="Edit class">
        {editClassError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{editClassError}</div>}
        <form onSubmit={handleUpdateClass}>
          <div>
            <label htmlFor="edit-cls" style={labelStyle}>Class name</label>
            <input id="edit-cls" value={editClassName} onChange={(e) => setEditClassName(e.target.value)} style={fieldStyle} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditClass(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={savingClass || !editClassName.trim()}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: savingClass || !editClassName.trim() ? "not-allowed" : "pointer", opacity: savingClass || !editClassName.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {savingClass ? <LoadingSpinner size={16} color="#fff" /> : null}
              {savingClass ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editSection} onClose={() => setEditSection(null)} title="Edit section">
        {editSectionError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{editSectionError}</div>}
        <form onSubmit={handleUpdateSection}>
          <div>
            <label htmlFor="edit-sec" style={labelStyle}>Section name</label>
            <input id="edit-sec" value={editSectionName} onChange={(e) => setEditSectionName(e.target.value)} style={fieldStyle} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditSection(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={savingSection || !editSectionName.trim()}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: savingSection || !editSectionName.trim() ? "not-allowed" : "pointer", opacity: savingSection || !editSectionName.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {savingSection ? <LoadingSpinner size={16} color="#fff" /> : null}
              {savingSection ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
