"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ArrowRight, Users, Search } from "lucide-react";
import { getStudents, getClasses, transferStudent, type Student, type ClassItem } from "@/app/lib/api/schools";

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

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Student Transfers</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>Move a student from one class to another</p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: `1px solid ${selected === s.id ? "var(--teal)" : "var(--border)"}`, borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", cursor: "pointer" }}
            onClick={() => setSelected(s.id)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{s.email} {s.class_name ? `· ${s.class_name}` : ""}</div>
              </div>
              {selected === s.id && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)" }}>Selected</span>}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20, boxShadow: "var(--shadow-xs)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Transfer to New Class</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select value={newClassId ?? ""} onChange={(e) => setNewClassId(Number(e.target.value))}
              style={{ flex: 1, height: 42, padding: "0 14px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 8, outline: "none", background: "#fff" }}>
              <option value="">Select class…</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={handleTransfer} disabled={!newClassId || status !== null}
              style={{ height: 42, padding: "0 18px", borderRadius: 8, background: status === "done" ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: !newClassId || status !== null ? 0.65 : 1 }}>
              <ArrowRight size={16} /> {status === "transferring" ? "Transferring…" : status === "done" ? "Transferred ✓" : "Transfer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

