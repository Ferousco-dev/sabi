"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { UserPlus, Phone, Users } from "lucide-react";
import { getEmergencyContacts, addEmergencyContact, type EmergencyContact } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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

  const disabled = adding || !name.trim() || !phone.trim() || !relationship.trim();

  return (
    <>
      <PageHeader title="Emergency contacts" subtitle="People to reach in case of an emergency." />

      <Card title="Add a contact" style={{ marginBottom: 20, maxWidth: 640 }}>
        <form onSubmit={handleAdd}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></Field>
            <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} type="tel" inputMode="tel" /></Field>
            <Field label="Relationship"><input value={relationship} onChange={(e) => setRelationship(e.target.value)} style={inputStyle} placeholder="e.g. Aunt" /></Field>
          </div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--teal)" }} />
            <span style={{ fontSize: 13.5, color: "var(--text-muted)" }}>Set as primary contact</span>
          </label>
          <div style={{ marginTop: 16 }}>
            <button type="submit" disabled={disabled}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              {adding ? <LoadingSpinner size={15} color="#fff" /> : <UserPlus size={16} strokeWidth={2.1} aria-hidden="true" />} Add contact
            </button>
          </div>
        </form>
      </Card>

      {contacts.length === 0 ? (
        <Card><EmptyState Icon={Users} title="No emergency contacts" description="Add trusted contacts who can be reached in an emergency." /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
          {contacts.map((c) => (
            <div key={c.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{c.name[0]?.toUpperCase()}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Phone size={13} aria-hidden="true" /> {c.phone} · {c.relationship}
                  </div>
                </div>
              </div>
              {c.is_primary && <Badge tone="teal">Primary</Badge>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: 42,
  padding: "0 14px",
  fontSize: 14,
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  fontFamily: "var(--font-sans)",
} as const;
