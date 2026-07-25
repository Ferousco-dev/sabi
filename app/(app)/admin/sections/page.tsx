"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Columns3, Plus, Users } from "lucide-react";
import { getClasses, getSections, createSection, type ClassItem, type Section } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function SectionsPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
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
    await createSection({ class_id: classId, name: name.trim() });
    setName("");
    const res = await getSections(classId);
    if (res.ok && res.data) setSections(res.data.sections);
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Sections</h1>
        <select value={classId ?? ""} onChange={(e) => setClassId(Number(e.target.value))}
          style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Section Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. A" style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Section
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sections.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Columns3 size={20} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Section {s.name}</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 3 }}>
                  <Users size={13} /> {s.student_count ?? 0} students
                </div>
              </div>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <EmptyState
            icon={Columns3}
            title="No sections"
            description="Create sections (like A, B, or Gold, Silver) for this class."
          />
        )}
      </div>
    </div>
  );
}

