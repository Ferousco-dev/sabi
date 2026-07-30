"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { ShieldCheck, Monitor, LogOut, History, ScrollText } from "lucide-react";
import Link from "next/link";
import { getSecuritySessions, revokeSecuritySession, type DeviceSession } from "@/app/lib/api/schools";
import { useResource } from "@/app/lib/useResource";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";
import { useConfirm } from "@/app/components/ui/confirm";

function relative(iso: string | null): string {
  if (!iso) return "Never used";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return d.toLocaleDateString();
}

export default function SecurityPage() {
  const { data, loading, refresh } = useResource("admin:security-sessions", async () => {
    const res = await getSecuritySessions();
    return { sessions: res.ok && res.data ? res.data.sessions : ([] as DeviceSession[]) };
  });
  const sessions = data?.sessions ?? [];
  const [revoking, setRevoking] = useState<number | null>(null);
  const confirm = useConfirm();

  async function handleRevoke(s: DeviceSession) {
    const ok = await confirm({
      title: "Sign out this session?",
      message: `This device will be signed out immediately${s.user_name ? ` for ${s.user_name}` : ""} and will need to sign in again.`,
      confirmLabel: "Sign out session",
      tone: "danger",
    });
    if (!ok) return;
    setRevoking(s.id);
    const res = await revokeSecuritySession(s.id);
    if (res.ok) await refresh();
    setRevoking(null);
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 820 }}>
      <PageHeader
        title="Security"
        subtitle="Active sign-in sessions across your school, and where to review security activity."
      />

      <Card padded={false} style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={18} style={{ color: "var(--teal)" }} aria-hidden="true" />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Active sessions</div>
            <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>Each is a device currently signed in. Revoke any you don&apos;t recognise.</div>
          </div>
        </div>

        {sessions.length === 0 ? (
          <EmptyState Icon={Monitor} title="No active sessions" description="Signed-in devices for your school will appear here." />
        ) : (
          sessions.map((s) => (
            <div key={s.id} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {s.user_name ? initials(s.user_name) : <Monitor size={16} />}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.user_name ?? "Unknown user"}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--text-subtle)" }}>Last active {relative(s.last_used_at)} · since {new Date(s.created_at).toLocaleDateString()}</span>
                </span>
              </span>
              <button onClick={() => handleRevoke(s)} disabled={revoking === s.id}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, border: "1px solid #FECDCA", background: "#FEF3F2", color: "#B42318", cursor: revoking === s.id ? "default" : "pointer", fontFamily: "var(--font-sans)", opacity: revoking === s.id ? 0.6 : 1, flexShrink: 0 }}>
                {revoking === s.id ? <LoadingSpinner size={14} /> : <LogOut size={14} strokeWidth={2} aria-hidden="true" />}
                Sign out
              </button>
            </div>
          ))
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <Link href="/admin/login-history" style={{ textDecoration: "none" }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><History size={18} style={{ color: "var(--teal)" }} /></span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>Login history</div>
                <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>Recent sign-ins across your school</div>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/audit-logs" style={{ textDecoration: "none" }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ScrollText size={18} style={{ color: "var(--teal)" }} /></span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>Audit logs</div>
                <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>Who changed what, and when</div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
