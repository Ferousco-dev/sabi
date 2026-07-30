"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Send, Users, Check } from "lucide-react";
import { getUsers, inviteUser, setUserStatus, type AppUser, type UserStatus } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge, type BadgeTone } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SearchInput, TableToolbar, ResultCount } from "@/app/components/dashboard/table-controls";
import { initials } from "@/app/lib/dashboard";

const ROLES = [
  { key: "school_admin", label: "School Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" },
  { key: "creator", label: "Creator" },
];

// School-appropriate lifecycle statuses (no ban/suspend in the UI).
const STATUS_OPTIONS: UserStatus[] = ["active", "graduated", "transferred", "expelled", "inactive"];
const STATUS_TONE: Record<string, BadgeTone> = {
  active: "success",
  graduated: "teal",
  transferred: "warning",
  expelled: "danger",
  inactive: "neutral",
  suspended: "danger",
};
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export default function InvitationsPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  async function changeStatus(u: AppUser, next: UserStatus) {
    if (next === u.status) return;
    setSavingId(u.id);
    const res = await setUserStatus(u.id, next);
    if (res.ok) setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    setSavingId(null);
  }

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
  const canSubmit = name.trim() && email.trim();

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Invite staff, teachers, and members to your school platform."
        actions={<Badge tone="teal">{users.length} users</Badge>}
      />

      <Card title="Invite a user" style={{ marginBottom: 20 }}>
        <form onSubmit={handleInvite} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 160px" }}>
            <label htmlFor="inv-name" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Name</label>
            <input id="inv-name" value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label htmlFor="inv-email" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Email</label>
            <input id="inv-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"
              style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
          </div>
          <div style={{ flex: "0 1 180px" }}>
            <label htmlFor="inv-role" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Role</label>
            <select id="inv-role" value={role} onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", fontFamily: "var(--font-sans)", color: "var(--text)" }}>
              {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={sending || !canSubmit}
            style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: status === "sent" ? "#0E8345" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: sending || !canSubmit ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: sending || !canSubmit ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
            {sending ? <LoadingSpinner size={15} color="#fff" /> : status === "sent" ? <Check size={16} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            {sending ? "Inviting…" : status === "sent" ? "Invited" : "Invite user"}
          </button>
        </form>
        {status === "error" && <p style={{ fontSize: 13, color: "#B42318", marginTop: 10 }}>Failed to send invitation. Please try again.</p>}
      </Card>

      <Card padded={false}>
        <TableToolbar>
          <SearchInput value={query} onChange={setQuery} placeholder="Search users…" />
          <ResultCount shown={filtered.length} total={users.length} />
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState
            Icon={Users}
            title="No users yet"
            description={query ? "No users match your search." : "Invite staff and teachers to join your school platform."}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr>{["Name", "Email", "Role", "Status", "Change status", "Created"].map((h, i) => (
                  <th key={i} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{initials(u.name)}</span>
                        <span style={{ fontWeight: 600, color: "var(--gray-900)" }}>{u.name}</span>
                      </span>
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={{ ...tdStyle, textTransform: "capitalize" }}>{u.role.replace("_", " ")}</td>
                    <td style={tdStyle}>
                      <Badge tone={STATUS_TONE[u.status] ?? "neutral"} dot>
                        {cap(u.status)}
                      </Badge>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <select
                          value={STATUS_OPTIONS.includes(u.status as UserStatus) ? u.status : ""}
                          onChange={(e) => changeStatus(u, e.target.value as UserStatus)}
                          disabled={savingId === u.id}
                          aria-label={`Change status for ${u.name}`}
                          style={{ height: 34, padding: "0 10px", fontSize: 13, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", fontFamily: "var(--font-sans)", color: "var(--text)", cursor: savingId === u.id ? "default" : "pointer" }}
                        >
                          {!STATUS_OPTIONS.includes(u.status as UserStatus) && <option value="">{cap(u.status)}</option>}
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
                        </select>
                        {savingId === u.id && <LoadingSpinner size={14} />}
                      </span>
                    </td>
                    <td style={tdStyle}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

const thStyle = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
