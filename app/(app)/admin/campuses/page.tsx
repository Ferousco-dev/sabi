"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { Building2, Trash2, MapPin, Pencil, Star } from "lucide-react";
import { getCampuses, createCampus, updateCampus, deleteCampus, type Campus } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import { Modal } from "@/app/components/ui/Modal";
import { useConfirm } from "@/app/components/ui/confirm";
import { useResource } from "@/app/lib/useResource";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const fieldStyle = { width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };
const iconBtnStyle = { width: 36, height: 36, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as const;

type EditForm = { name: string; address: string; city: string; state: string; phone: string; is_main: boolean };

export default function CampusesPage() {
  const { data, loading, refresh } = useResource("admin:campuses", getCampuses);
  const campuses = data?.ok && data.data ? data.data.campuses : [];

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const confirm = useConfirm();

  // Edit modal
  const [editing, setEditing] = useState<Campus | null>(null);
  const [form, setForm] = useState<EditForm>({ name: "", address: "", city: "", state: "", phone: "", is_main: false });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setAddError(null);
    const res = await createCampus({ name: name.trim(), address: address.trim() || undefined });
    setSaving(false);
    if (res.ok && res.data?.success) {
      setName(""); setAddress("");
      refresh();
    } else {
      setAddError("Could not add campus. Please try again.");
    }
  }

  async function handleDelete(id: number) {
    const campus = campuses.find((c) => c.id === id);
    const ok = await confirm({
      title: campus ? `Delete ${campus.name}?` : "Delete this campus?",
      message: "The campus and its association with your school will be permanently removed. This cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    const res = await deleteCampus(id);
    if (res.ok && res.data?.success) refresh();
    else window.alert("Could not delete the campus. Please try again.");
  }

  function openEdit(c: Campus) {
    setEditing(c);
    setForm({ name: c.name, address: c.address ?? "", city: c.city ?? "", state: c.state ?? "", phone: c.phone ?? "", is_main: c.is_main });
    setEditError(null);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !form.name.trim()) return;
    setSavingEdit(true); setEditError(null);
    const res = await updateCampus(editing.id, {
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      phone: form.phone.trim() || undefined,
      is_main: form.is_main,
    });
    setSavingEdit(false);
    if (res.ok && res.data?.success) {
      setEditing(null);
      refresh();
    } else {
      setEditError("Could not save changes. Please try again.");
    }
  }

  async function handleSetMain(c: Campus) {
    if (c.is_main) return;
    const res = await updateCampus(c.id, {
      name: c.name,
      address: c.address || undefined,
      city: c.city || undefined,
      state: c.state || undefined,
      phone: c.phone || undefined,
      is_main: true,
    });
    if (res.ok && res.data?.success) refresh();
    else window.alert("Could not set this campus as main. Please try again.");
  }

  if (loading) return <LoadingPage />;

  const valid = !!name.trim();

  return (
    <>
      <PageHeader title="Campuses" subtitle="Manage the physical campuses that make up your school." actions={<Badge tone="teal">{campuses.length} campuses</Badge>} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a campus">
          {addError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 14 }}>{addError}</div>}
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={labelStyle}>Campus name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Main Campus" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label style={labelStyle}>Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <button type="submit" disabled={!valid || saving} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !valid || saving ? "not-allowed" : "pointer", opacity: !valid || saving ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {saving ? <LoadingSpinner size={15} color="#fff" /> : "Add campus"}
            </button>
          </form>
        </Card>

        {campuses.length === 0 ? (
          <Card><EmptyState Icon={Building2} title="No campuses yet" description="Add your school campuses to manage them individually." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {campuses.map((c) => (
              <div key={c.id} className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={20} color="var(--teal)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", display: "flex", alignItems: "center", gap: 8 }}>
                      {c.name} {c.is_main ? <Badge tone="teal">Main</Badge> : null}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <MapPin size={12} /> {[c.address, c.city, c.state].filter(Boolean).join(", ") || "No address"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {!c.is_main && (
                    <button onClick={() => handleSetMain(c)} aria-label={`Set ${c.name} as main`} title="Set as main" style={iconBtnStyle}>
                      <Star size={15} style={{ color: "var(--text-subtle)" }} />
                    </button>
                  )}
                  <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} style={iconBtnStyle}>
                    <Pencil size={15} style={{ color: "var(--text-subtle)" }} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} aria-label={`Delete ${c.name}`} style={{ ...iconBtnStyle, color: "#B42318" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit campus">
        {editError && <div role="alert" style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 16 }}>{editError}</div>}
        <form onSubmit={handleUpdate}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label htmlFor="c-name" style={labelStyle}>Campus name <span style={{ color: "#B42318" }}>*</span></label>
              <input id="c-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="c-address" style={labelStyle}>Address</label>
              <input id="c-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={fieldStyle} />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 140px" }}>
                <label htmlFor="c-city" style={labelStyle}>City</label>
                <input id="c-city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} style={fieldStyle} />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <label htmlFor="c-state" style={labelStyle}>State</label>
                <input id="c-state" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} style={fieldStyle} />
              </div>
            </div>
            <div>
              <label htmlFor="c-phone" style={labelStyle}>Phone</label>
              <input id="c-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={fieldStyle} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: "var(--gray-900)", fontWeight: 500 }}>
              <input type="checkbox" checked={form.is_main} onChange={(e) => setForm((f) => ({ ...f, is_main: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--teal)", cursor: "pointer" }} />
              Set as main campus
            </label>
            {form.is_main && !editing?.is_main && (
              <p style={{ fontSize: 12.5, color: "var(--text-subtle)", margin: 0 }}>Marking this campus as main will remove the main status from any other campus.</p>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={() => setEditing(null)} style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, border: "1px solid var(--border-strong)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
            <button type="submit" disabled={savingEdit || !form.name.trim()}
              style={{ height: 42, padding: "0 20px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: savingEdit || !form.name.trim() ? "not-allowed" : "pointer", opacity: savingEdit || !form.name.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              {savingEdit ? <LoadingSpinner size={16} color="#fff" /> : null}
              {savingEdit ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
