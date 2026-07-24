"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus, Users, BookOpen, ChevronRight } from "lucide-react";
import { getClasses, createClass, type ClassItem } from "@/app/lib/api/schools";

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const load = () => getClasses().then((res) => {
    if (res.ok && res.data) setClasses(res.data.classes);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createClass({ name: name.trim() });
    setName("");
    load();
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading classes…</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)" }}>Classes</h1>
          <p style={{ fontSize: 14, color: "var(--gray-500)", marginTop: 2 }}>{classes.length} total</p>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Class Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. JSS 1" style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Class
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {classes.map((c) => (
          <Link key={c.id} href={`/admin/classes/${c.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={20} color="var(--teal)" />
                </div>
                <ChevronRight size={18} style={{ color: "var(--gray-300)" }} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", marginBottom: 8 }}>{c.name}</div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--gray-500)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={13} /> {c.student_count ?? 0}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><BookOpen size={13} /> {c.section_count ?? 0} sections</span>
              </div>
            </div>
          </Link>
        ))}
        {classes.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32, gridColumn: "1 / -1" }}>No classes created yet.</p>}
      </div>
    </div>
  );
}
