"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { UserPlus, Phone, User, Users } from "lucide-react";
import { getEmergencyContacts, addEmergencyContact, type EmergencyContact } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [adding, setAdding] = useState(false);

  const load = () => getEmergencyContacts().then((res) => {
    if (res.ok && res.data) setContacts(res.data.contacts);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !relationship.trim()) return;
    setAdding(true);
    const res = await addEmergencyContact({ name: name.trim(), phone: phone.trim(), relationship: relationship.trim(), is_primary: isPrimary });
    if (res.ok) { setName(""); setPhone(""); setRelationship(""); setIsPrimary(false); load(); }
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Emergency Contacts</h1>
      <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 20 }}>People to contact in case of emergency</p>

      <form onSubmit={handleAdd} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 14 }}>Add Emergency Contact</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Relationship</label>
            <input value={relationship} onChange={(e) => setRelationship(e.target.value)} style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--teal)" }} />
            <label style={{ fontSize: 13, color: "var(--gray-600)" }}>Primary contact</label>
          </div>
        </div>
        <button type="submit" disabled={adding} style={{ marginTop: 16, height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", opacity: adding ? 0.65 : 1, display: "flex", alignItems: "center", gap: 6 }}>
          {adding ? <LoadingSpinner size={16} color="#fff" /> : <><UserPlus size={16} /> Add Contact</>}
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {contacts.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{c.name[0]}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--gray-400)", display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                  <Phone size={13} /> {c.phone} · {c.relationship}
                </div>
              </div>
            </div>
            {c.is_primary && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--teal)", background: "var(--teal-50)", padding: "2px 8px", borderRadius: 999 }}>Primary</span>}
          </div>
        ))}
        {contacts.length === 0 && (
          <EmptyState
            icon={Users}
            title="No emergency contacts"
            description="Add trusted contacts who can be reached in case of an emergency."
          />
        )}
      </div>
    </div>
  );
}