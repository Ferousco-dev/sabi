"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { Sun, Plus, CalendarDays, Pencil, Trash2 } from "lucide-react";
import { getHolidays, createHoliday, updateHoliday, deleteHoliday, type Holiday } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Modal } from "@/app/components/ui/Modal";
import { useConfirm } from "@/app/components/ui/confirm";
import { useResource } from "@/app/lib/useResource";

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block" as const, marginBottom: 6 };
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" } as const;
const iconBtnStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg)", cursor: "pointer" } as const;
const errorBoxStyle = { padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 } as const;

async function loadHolidays(): Promise<Holiday[]> {
  const res = await getHolidays();
  return res.ok && res.data ? res.data.holidays : [];
}

export default function HolidaysPage() {
  const confirm = useConfirm();
  const { data, loading, refresh } = useResource<Holiday[]>("admin:holidays", loadHolidays);
  const holidays = data ?? [];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setAdding(true); setAddError(null);
    const res = await createHoliday({ title: title.trim(), date, description: description.trim() || undefined });
    setAdding(false);
    if (res.ok) {
      setTitle(""); setDate(""); setDescription("");
      refresh();
    } else {
      setAddError("Could not add holiday. Please try again.");
    }
  }

  function openEdit(h: Holiday) {
    setEditing(h);
    setForm({ title: h.title, date: h.date, description: h.description ?? "" });
    setEditError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !form.title.trim() || !form.date) return;
    setSaving(true); setEditError(null);
    const res = await updateHoliday(editing.id, {
      title: form.title.trim(),
      date: form.date,
      description: form.description.trim() || undefined,
    });
    setSaving(false);
    if (res.ok) { setEditing(null); refresh(); }
    else setEditError("Could not update holiday. Please try again.");
  }

  async function handleDelete(h: Holiday) {
    const ok = await confirm({ title: `Delete ${h.title}?`, message: "This holiday will be removed from the calendar. This cannot be undone.", tone: "danger", confirmLabel: "Delete" });
    if (!ok) return;
    const res = await deleteHoliday(h.id);
    if (res.ok) refresh();
  }

  if (loading) return <LoadingPage />;

  const sorted = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming = sorted.filter((h) => new Date(h.date) >= new Date());
  const past = sorted.filter((h) => new Date(h.date) < new Date());
  const canSubmit = title.trim() && date;

  return (
    <>
      <PageHeader
        title="Holidays & Calendar"
        subtitle="Add public holidays and school breaks to the calendar."
        actions={<Badge tone="teal">{holidays.length} scheduled</Badge>}
      />

      <div style={{ maxWidth: 760 }}>
        <Card title="Add a holiday" style={{ marginBottom: 20 }}>
          {addError && <div role="alert" style={errorBoxStyle}>{addError}</div>}
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label htmlFor="hol-title" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Holiday</label>
              <input id="hol-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Independence Day"
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
            </div>
            <div style={{ flex: "0 1 160px" }}>
              <label htmlFor="hol-date" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Date</label>
              <input id="hol-date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)" }} />
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label htmlFor="hol-desc" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Description (optional)</label>
              <input id="hol-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
            </div>
            <button type="submit" disabled={adding || !canSubmit}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !canSubmit ? "not-allowed" : "pointer", opacity: adding || !canSubmit ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add holiday
            </button>
          </form>
        </Card>

        {holidays.length === 0 ? (
          <Card><EmptyState Icon={Sun} title="No holidays scheduled" description="Add public holidays or school breaks to the calendar above." /></Card>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", marginBottom: 12, letterSpacing: "-0.01em" }}>Upcoming holidays</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {upcoming.map((h) => (
                    <div key={h.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", gap: 14 }}>
                      <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Sun size={20} style={{ color: "var(--teal)" }} />
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{h.title}</div>
                        <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{new Date(h.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => openEdit(h)} aria-label={`Edit ${h.title}`} style={iconBtnStyle}>
                          <Pencil size={15} style={{ color: "var(--text-muted)" }} />
                        </button>
                        <button type="button" onClick={() => handleDelete(h)} aria-label={`Delete ${h.title}`} style={iconBtnStyle}>
                          <Trash2 size={15} style={{ color: "#D92D20" }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <details>
                <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer", marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <CalendarDays size={15} aria-hidden="true" /> Past holidays ({past.length})
                </summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {past.map((h) => (
                    <div key={h.id} style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: 13.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ flex: 1, minWidth: 0 }}>{h.title} · {new Date(h.date).toLocaleDateString()}</span>
                      <span style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => openEdit(h)} aria-label={`Edit ${h.title}`} style={iconBtnStyle}>
                          <Pencil size={15} style={{ color: "var(--text-muted)" }} />
                        </button>
                        <button type="button" onClick={() => handleDelete(h)} aria-label={`Delete ${h.title}`} style={iconBtnStyle}>
                          <Trash2 size={15} style={{ color: "#D92D20" }} />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit holiday">
        {editError && <div role="alert" style={errorBoxStyle}>{editError}</div>}
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="eh-title" style={labelStyle}>Holiday</label>
              <input id="eh-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="eh-date" style={labelStyle}>Date</label>
              <input id="eh-date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="eh-desc" style={labelStyle}>Description (optional)</label>
              <input id="eh-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={fieldStyle} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditing(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={saving || !form.title.trim() || !form.date}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving || !form.title.trim() || !form.date ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={16} color="#fff" /> : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
