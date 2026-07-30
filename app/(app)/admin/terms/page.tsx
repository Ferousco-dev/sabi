"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { ListOrdered, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { getAcademicSessions, getTerms, createTerm, setCurrentTerm, updateTerm, deleteTerm, type AcademicSession, type Term } from "@/app/lib/api/schools";
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

export default function TermsPage() {
  const { data: sessionsData, loading: sessionsLoading } = useResource("admin:sessions", getAcademicSessions);
  const sessions: AcademicSession[] = sessionsData?.ok && sessionsData.data ? sessionsData.data.sessions : [];

  const [sessionId, setSessionId] = useState<number | null>(null);

  // Pick the current session once sessions arrive.
  useEffect(() => {
    if (sessionId == null && sessions.length > 0) {
      const current = sessions.find((s) => s.is_current);
      setSessionId(current ? current.id : sessions[0].id);
    }
  }, [sessions, sessionId]);

  const { data: termsData, loading: termsLoading, refresh } = useResource(
    `admin:terms:${sessionId ?? "none"}`,
    () => (sessionId ? getTerms(sessionId) : Promise.resolve(null)),
  );
  const terms: Term[] = termsData && termsData.ok && termsData.data ? termsData.data.terms : [];

  const confirm = useConfirm();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editing, setEditing] = useState<Term | null>(null);
  const [eName, setEName] = useState("");
  const [eStart, setEStart] = useState("");
  const [eEnd, setEEnd] = useState("");
  const [saveEditing, setSaveEditing] = useState(false);
  const [editError, setEditError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!sessionId || !name.trim() || !startDate || !endDate) return;
    if (endDate < startDate) { setAddError("End date must be on or after the start date."); return; }
    setSaving(true);
    const res = await createTerm({ session_id: sessionId, name: name.trim(), start_date: startDate, end_date: endDate });
    setSaving(false);
    if (!res.ok) { setAddError("Could not create term."); return; }
    setName(""); setStartDate(""); setEndDate("");
    refresh();
  }

  async function handleSetCurrent(id: number) {
    const res = await setCurrentTerm(id);
    if (res.ok) refresh();
  }

  function openEdit(t: Term) {
    setEditing(t);
    setEName(t.name);
    setEStart(t.start_date?.slice(0, 10) ?? "");
    setEEnd(t.end_date?.slice(0, 10) ?? "");
    setEditError("");
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditError("");
    if (!editing || !sessionId || !eName.trim() || !eStart || !eEnd) return;
    if (eEnd < eStart) { setEditError("End date must be on or after the start date."); return; }
    setSaveEditing(true);
    const res = await updateTerm(editing.id, { session_id: sessionId, name: eName.trim(), start_date: eStart, end_date: eEnd });
    setSaveEditing(false);
    if (!res.ok) { setEditError("Could not save changes."); return; }
    setEditing(null);
    refresh();
  }

  async function handleDelete(t: Term) {
    const ok = await confirm({ title: "Delete term", message: `Delete “${t.name}”? This cannot be undone.`, tone: "danger", confirmLabel: "Delete" });
    if (!ok) return;
    const res = await deleteTerm(t.id);
    if (res.ok) refresh();
  }

  if (sessionsLoading || (sessionId != null && termsLoading)) return <LoadingPage />;

  const valid = !!sessionId && !!name.trim() && !!startDate && !!endDate;
  const editValid = !!eName.trim() && !!eStart && !!eEnd;

  return (
    <>
      <PageHeader
        title="Terms"
        subtitle="Define the terms that make up each academic session."
        actions={
          <select value={sessionId ?? ""} onChange={(e) => setSessionId(Number(e.target.value))} aria-label="Academic session"
            style={{ height: 40, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", cursor: "pointer" }}>
            {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a term">
          {addError && <div role="alert" style={errorBox}>{addError}</div>}
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 160px" }}>
              <label style={labelStyle}>Term name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. First Term" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>Start</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "0 1 150px" }}>
              <label style={labelStyle}>End</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add term"}
            </button>
          </form>
          {startDate && endDate && endDate < startDate && <p style={{ fontSize: 12.5, color: "#B42318", marginTop: 10 }}>End date must be on or after the start date.</p>}
        </Card>

        {terms.length === 0 ? (
          <Card><EmptyState Icon={ListOrdered} title="No terms" description="Define terms (like First Term, Second Term) for the selected session." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {terms.map((t) => (
              <div key={t.id} className="stat-card" style={{ background: "var(--bg)", border: `1px solid ${t.is_current ? "var(--teal)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: t.is_current ? "var(--teal)" : "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ListOrdered size={20} color={t.is_current ? "#fff" : "var(--teal)"} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
                      {t.name} {t.is_current ? <Badge tone="teal" dot>Current</Badge> : null}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{new Date(t.start_date).toLocaleDateString()} – {new Date(t.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {!t.is_current && (
                    <button onClick={() => handleSetCurrent(t.id)} style={{ height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid var(--teal)", background: "var(--teal-50)", color: "var(--teal)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: "var(--font-sans)" }}>
                      <CheckCircle2 size={14} /> Set current
                    </button>
                  )}
                  <button onClick={() => openEdit(t)} aria-label={`Edit ${t.name}`} title="Edit" style={rowBtn}>
                    <Pencil size={15} color="var(--text-muted)" />
                  </button>
                  <button onClick={() => handleDelete(t)} aria-label={`Delete ${t.name}`} title="Delete" style={rowBtn}>
                    <Trash2 size={15} color="#B42318" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit term">
        {editError && <div role="alert" style={errorBox}>{editError}</div>}
        <form onSubmit={handleEdit}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="et-name" style={labelStyle}>Term name</label>
              <input id="et-name" value={eName} onChange={(e) => setEName(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="et-start" style={labelStyle}>Start date</label>
              <input id="et-start" type="date" value={eStart} onChange={(e) => setEStart(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="et-end" style={labelStyle}>End date</label>
              <input id="et-end" type="date" value={eEnd} onChange={(e) => setEEnd(e.target.value)} style={fieldStyle} />
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
