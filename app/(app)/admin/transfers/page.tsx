"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ArrowRight, Users, Check } from "lucide-react";
import { getStudents, getClasses, transferStudent, type Student, type ClassItem } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

export default function TransfersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [newClassId, setNewClassId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStudents(), getClasses()]).then(([s, c]) => {
      if (s.ok && s.data) setStudents(s.data.students);
      if (c.ok && c.data) setClasses(c.data.classes);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase()));

  async function handleTransfer() {
    if (!selected || !newClassId) return;
    setStatus("transferring");
    const res = await transferStudent(selected, newClassId);
    setStatus(res.ok ? "done" : "error");
    setTimeout(() => { setStatus(null); setSelected(null); setNewClassId(null); }, 2000);
  }

  if (loading) return <LoadingPage />;

  const selectedStudent = students.find((s) => s.id === selected);

  return (
    <>
      <PageHeader title="Student Transfers" subtitle="Move a student from one class to another." />

      <div style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 20 }}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search students…" />
        </div>

        {filtered.length === 0 ? (
          <Card><EmptyState Icon={Users} title="No students found" description={query ? "No students match your search." : "Students will appear here once added."} /></Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {filtered.map((s) => {
              const isSel = selected === s.id;
              return (
                <button key={s.id} type="button" onClick={() => setSelected(s.id)}
                  style={{ textAlign: "left", background: "var(--bg)", border: `1.5px solid ${isSel ? "var(--teal)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "14px 16px", boxShadow: "var(--shadow-xs)", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 12 }}>
                  <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(s.name)}</span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--gray-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                    <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}{s.class_name ? ` · ${s.class_name}` : ""}</span>
                  </span>
                  {isSel && <Check size={18} style={{ color: "var(--teal)", flexShrink: 0 }} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        )}

        {selected && (
          <Card title="Transfer to new class" style={{ marginTop: 20 }}>
            {selectedStudent && (
              <p style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 14 }}>
                Moving <strong style={{ color: "var(--gray-900)" }}>{selectedStudent.name}</strong>{selectedStudent.class_name ? ` from ${selectedStudent.class_name}` : ""}.
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <select value={newClassId ?? ""} onChange={(e) => setNewClassId(Number(e.target.value))}
                style={{ flex: "1 1 200px", height: 42, padding: "0 14px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", fontFamily: "var(--font-sans)", color: "var(--text)" }}>
                <option value="">Select class…</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleTransfer} disabled={!newClassId || status !== null}
                style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: status === "done" ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: !newClassId || status !== null ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: !newClassId || status !== null ? 0.65 : 1, fontFamily: "var(--font-sans)" }}>
                {status === "transferring" ? <LoadingSpinner size={15} color="#fff" /> : status === "done" ? <Check size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                {status === "transferring" ? "Transferring…" : status === "done" ? "Transferred" : "Transfer"}
              </button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
