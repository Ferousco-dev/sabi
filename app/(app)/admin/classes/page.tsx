"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus, Users, Columns3, ChevronRight } from "lucide-react";
import { getClasses, createClass, getSections, createSection, type ClassItem, type Section } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

type Tab = "classes" | "sections";

export default function ClassesPage() {
  const [tab, setTab] = useState<Tab>("classes");

  // Classes tab
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  // Sections tab
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [sectionClassId, setSectionClassId] = useState<number | null>(null);
  const [sectionName, setSectionName] = useState("");

  const load = () => getClasses().then((res) => {
    if (res.ok && res.data) {
      setClasses(res.data.classes);
      if (sectionClassId === null && res.data.classes.length > 0) setSectionClassId(res.data.classes[0].id);
    }
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sectionClassId) return;
    getSections(sectionClassId).then((res) => {
      if (res.ok && res.data) setSections(res.data.sections);
    });
  }, [sectionClassId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    await createClass({ name: name.trim() });
    setName("");
    await load();
    setAdding(false);
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!sectionClassId || !sectionName.trim()) return;
    setSaving(true);
    await createSection({ class_id: sectionClassId, name: sectionName.trim() });
    setSectionName("");
    const res = await getSections(sectionClassId);
    if (res.ok && res.data) setSections(res.data.sections);
    setSaving(false);
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
        <select value={sectionClassId ?? ""} onChange={(e) => setSectionClassId(Number(e.target.value))} aria-label="Class"
          style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
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
                <Link key={c.id} href={`/admin/classes/${c.id}`} className="stat-card" style={{ textDecoration: "none", display: "block", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-xs)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <GraduationCap size={20} style={{ color: "var(--teal)" }} />
                    </span>
                    <ChevronRight size={18} style={{ color: "var(--gray-300)" }} aria-hidden="true" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", marginBottom: 8 }}>{c.name}</div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12.5, color: "var(--text-subtle)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Users size={14} aria-hidden="true" /> {c.student_count ?? 0}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Columns3 size={14} aria-hidden="true" /> {c.section_count ?? 0} sections</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
          <Card title="Add a section">
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
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Section {s.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <Users size={13} /> {s.student_count ?? 0} students
                    </div>
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
