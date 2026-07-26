"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus, Users, Columns3, ChevronRight } from "lucide-react";
import { getClasses, createClass, type ClassItem } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => getClasses().then((res) => {
    if (res.ok && res.data) setClasses(res.data.classes);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    await createClass({ name: name.trim() });
    setName("");
    await load();
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Classes" subtitle="Organise students into classes and sections." actions={<Badge tone="teal">{classes.length} classes</Badge>} />

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
  );
}
