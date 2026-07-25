"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Building2, Plus, Trash2, MapPin } from "lucide-react";
import { getCampuses, createCampus, deleteCampus, type Campus } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const load = () => getCampuses().then((res) => {
    if (res.ok && res.data) setCampuses(res.data.campuses);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createCampus({ name: name.trim(), address: address.trim() || undefined });
    setName(""); setAddress("");
    load();
  }

  async function handleDelete(id: number) {
    await deleteCampus(id);
    load();
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Campuses</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Campus Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Campus
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {campuses.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={20} color="var(--teal)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.name} {c.is_main ? <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "var(--teal)", borderRadius: 999, padding: "2px 8px", marginLeft: 8 }}>Main</span> : null}</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <MapPin size={12} /> {c.address ?? "No address"}
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(c.id)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-400)" }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {campuses.length === 0 && (
          <EmptyState
            icon={Building2}
            title="No campuses yet"
            description="Add your school campuses to manage them individually."
          />
        )}
      </div>
    </div>
  );
}

