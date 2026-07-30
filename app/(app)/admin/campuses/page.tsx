"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Building2, Trash2, MapPin } from "lucide-react";
import { getCampuses, createCampus, deleteCampus, type Campus } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import { useConfirm } from "@/app/components/ui/confirm";

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", display: "block" as const, marginBottom: 6 };
const inputStyle = { height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)", background: "var(--bg)" };

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const confirm = useConfirm();

  const load = () => getCampuses().then((res) => {
    if (res.ok && res.data) setCampuses(res.data.campuses);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await createCampus({ name: name.trim(), address: address.trim() || undefined });
    setName(""); setAddress("");
    await load();
    setSaving(false);
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
    await deleteCampus(id);
    load();
  }

  if (loading) return <LoadingPage />;

  const valid = !!name.trim();

  return (
    <>
      <PageHeader title="Campuses" subtitle="Manage the physical campuses that make up your school." actions={<Badge tone="teal">{campuses.length} campuses</Badge>} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20, maxWidth: 860 }}>
        <Card title="Add a campus">
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
                      <MapPin size={12} /> {c.address ?? "No address"}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.id)} aria-label={`Delete ${c.name}`} style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#B42318", flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
