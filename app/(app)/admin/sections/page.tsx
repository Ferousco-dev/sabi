"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Columns3, Users } from "lucide-react";
import { getClasses, getSections, createSection, type ClassItem, type Section } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

export default function SectionsPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classId, setClassId] = useState<number | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    getClasses().then((res) => {
      if (res.ok && res.data && res.data.classes.length > 0) {
        setClasses(res.data.classes);
        setClassId(res.data.classes[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!classId) return;
    getSections(classId).then((res) => {
      if (res.ok && res.data) setSections(res.data.sections);
    });
  }, [classId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || !name.trim()) return;
    setSaving(true);
    await createSection({ class_id: classId, name: name.trim() });
    setName("");
    const res = await getSections(classId);
    if (res.ok && res.data) setSections(res.data.sections);
    setSaving(false);
  }

  if (loading) return <LoadingPage />;

  const valid = !!classId && !!name.trim();

  return (
    <>
      <PageHeader
        title="Sections"
        subtitle="Split each class into sections and track their sizes."
        actions={
          <select value={classId ?? ""} onChange={(e) => setClassId(Number(e.target.value))} aria-label="Class"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a section">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Section name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. A" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
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
    </>
  );
}
