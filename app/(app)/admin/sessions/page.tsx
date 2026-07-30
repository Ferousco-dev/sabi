"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { CalendarDays, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { getAcademicSessions, createAcademicSession, setCurrentSession, updateAcademicSession, deleteAcademicSession, type AcademicSession } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import { Modal } from "@/app/components/ui/Modal";
import { useResource } from "@/app/lib/useResource";
import { useConfirm } from "@/app/components/ui/confirm";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const fieldStyle = { ...inputStyle, width: "100%" };
const errorBox = { padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 };
const rowBtn = { height: 36, width: 36, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-sans)" } as const;

export default function SessionsPage() {
  const { data, loading, refresh } = useResource("admin:sessions", getAcademicSessions);
  const sessions: AcademicSession[] = data?.ok && data.data ? data.data.sessions : [];

  const confirm = useConfirm();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editing, setEditing] = useState<AcademicSession | null>(null);
  const [eName, setEName] = useState("");
  const [eStart, setEStart] = useState("");
  const [eEnd, setEEnd] = useState("");
  const [saveEditing, setSaveEditing] = useState(false);
  const [editError, setEditError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!name.trim() || !startDate || !endDate) return;
    if (endDate < startDate) { setAddError("End date must be on or after the start date."); return; }
    setSaving(true);
    const res = await createAcademicSession({ name: name.trim(), start_date: startDate, end_date: endDate });
    setSaving(false);
    if (!res.ok) { setAddError("Could not create session."); return; }
    setName(""); setStartDate(""); setEndDate("");
    refresh();
  }

  async function handleSetCurrent(id: number) {
    const res = await setCurrentSession(id);
    if (res.ok) refresh();
  }

  function openEdit(s: AcademicSession) {
    setEditing(s);
    setEName(s.name);
    setEStart(s.start_date?.slice(0, 10) ?? "");
    setEEnd(s.end_date?.slice(0, 10) ?? "");
    setEditError("");
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditError("");
    if (!editing || !eName.trim() || !eStart || !eEnd) return;
    if (eEnd < eStart) { setEditError("End date must be on or after the start date."); return; }
    setSaveEditing(true);
    const res = await updateAcademicSession(editing.id, { name: eName.trim(), start_date: eStart, end_date: eEnd });
    setSaveEditing(false);
    if (!res.ok) { setEditError("Could not save changes."); return; }
    setEditing(null);
    refresh();
  }

  async function handleDelete(s: AcademicSession) {
    const ok = await confirm({ title: "Delete session", message: `Delete “${s.name}”? This cannot be undone.`, tone: "danger", confirmLabel: "Delete" });
    if (!ok) return;
    const res = await deleteAcademicSession(s.id);
    if (res.ok) refresh();
  }

  if (loading) return <LoadingPage />;

  const valid = !!name.trim() && !!startDate && !!endDate;
  const editValid = !!eName.trim() && !!eStart && !!eEnd;

  return (
    <>
      <PageHeader title="Academic sessions" subtitle="Set up the academic years that drive terms and enrollments." actions={<Badge tone="teal">{sessions.length} sessions</Badge>} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a session">
          {addError && <div role="alert" style={errorBox}>{addError}</div>}
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 160px" }}>
              <label style={labelStyle}>Session name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2024/2025" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add session"}
            </button>
          </form>
          {startDate && endDate && endDate < startDate && <p style={{ fontSize: 12.5, color: "#B42318", marginTop: 10 }}>End date must be on or after the start date.</p>}
        </Card>

        {sessions.length === 0 ? (
          <Card><EmptyState Icon={CalendarDays} title="No sessions created" description="Define your academic sessions to start managing terms and enrollments." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map((s) => (
              <div key={s.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${s.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: s.is_current ? "var(--teal)" : "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CalendarDays size={20} color={s.is_current ? "#fff" : "var(--teal)"} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
                      {s.name} {s.is_current ? <Badge tone="teal" dot>Current</Badge> : null}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{new Date(s.start_date).toLocaleDateString()} – {new Date(s.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {!s.is_current && (
                    <button onClick={() => handleSetCurrent(s.id)} style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: "var(--font-sans)" }}>
                      <CheckCircle2 size={14} /> Set current
                    </button>
                  )}
                  <button onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`} title="Edit" style={rowBtn}>
                    <Pencil size={15} color="var(--text-muted)" />
                  </button>
                  <button onClick={() => handleDelete(s)} aria-label={`Delete ${s.name}`} title="Delete" style={rowBtn}>
                    <Trash2 size={15} color="#B42318" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit session">
        {editError && <div role="alert" style={errorBox}>{editError}</div>}
        <form onSubmit={handleEdit}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="es-name" style={labelStyle}>Session name</label>
              <input id="es-name" value={eName} onChange={(e) => setEName(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="es-start" style={labelStyle}>Start date</label>
              <input id="es-start" type="date" value={eStart} onChange={(e) => setEStart(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="es-end" style={labelStyle}>End date</label>
              <input id="es-end" type="date" value={eEnd} onChange={(e) => setEEnd(e.target.value)} style={fieldStyle} />
            </div>
            {eStart && eEnd && eEnd < eStart && <p style={{ fontSize: 12.5, color: "#B42318" }}>End date must be on or after the start date.</p>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditing(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={!editValid || saveEditing} style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: !editValid || saveEditing ? "not-allowed" : "pointer", opacity: !editValid || saveEditing ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saveEditing ? <LoadingSpinner size={16} color="#fff" /> : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
