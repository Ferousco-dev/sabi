"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Send, Mail, Search, Users } from "lucide-react";
import { getUsers, inviteUser, type AppUser } from "@/app/lib/api/schools";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

const ROLES = [
  { key: "school_admin", label: "School Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" },
  { key: "creator", label: "Creator" },
];

export default function InvitationsPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = () => getUsers().then((res) => {
    if (res.ok && res.data) setUsers(res.data.users);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    setStatus(null);
    const res = await inviteUser({ name: name.trim(), email: email.trim(), role });
    setSending(false);
    if (res.ok) { setStatus("sent"); setName(""); setEmail(""); load(); setTimeout(() => setStatus(null), 2000); }
    else setStatus("error");
  }

  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()));

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>User Management</h1>

      <form onSubmit={handleInvite} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 160 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 200 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", background: "#fff" }}>
            {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={sending} style={{ height: 38, padding: "0 16px", borderRadius: 6, background: status === "sent" ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Send size={16} /> {sending ? "Inviting…" : status === "sent" ? "Invited ✓" : "Invite User"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, maxWidth: 400 }}>
        <Search size={17} style={{ color: "var(--gray-400)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)", background: "transparent" }} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users yet"
          description={query ? "No users match your search." : "Invite staff and teachers to join your school platform."}
        />
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Email</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Role</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Status</th>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "var(--gray-900)" }}>{u.name}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{u.email}</td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)", textTransform: "capitalize" }}>{u.role.replace("_", " ")}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: u.status === "active" ? "#ECFDF3" : "#FEF3F2", color: u.status === "active" ? "#0E8345" : "#B42318", textTransform: "capitalize" }}>{u.status}</span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "var(--gray-500)" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

