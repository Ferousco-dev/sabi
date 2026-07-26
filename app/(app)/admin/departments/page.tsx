"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Building, BookOpen, Users } from "lucide-react";
import { getDepartments, createDepartment, type Department } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const load = () => getDepartments().then((res) => {
    if (res.ok && res.data) setDepartments(res.data.departments);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await createDepartment({ name: name.trim() });
    setName("");
    await load();
    setSaving(false);
  }

  if (loading) return <LoadingPage />;

  const valid = !!name.trim();

  return (
    <>
      <PageHeader title="Departments" subtitle="Group subjects and teachers into departments." actions={<Badge tone="teal">{departments.length} departments</Badge>} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a department">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Department name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Science Department" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add department"}
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
    </>
  );
}
