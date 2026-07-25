"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { getChildren, linkChild, type Child } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const load = () => getChildren().then((res) => {
    if (res.ok && res.data) setChildren(res.data.children);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLinking(true);
    setLinkError(null);
    const res = await linkChild(email.trim());
    setLinking(false);
    if (res.ok) { setEmail(""); load(); }
    else setLinkError(res.data && "error" in res.data ? (res.data as any).error : "Could not link child.");
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/parent" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--teal)", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to dashboard
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>My Children</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Link a Child</h2>
        {linkError && <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 12 }}>{linkError}</div>}
        <form onSubmit={handleLink} style={{ display: "flex", gap: 10 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@school.edu.ng"
            style={{ flex: 1, height: 42, padding: "0 14px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 8, outline: "none" }} />
          <button type="submit" disabled={linking || !email.trim()}
            style={{ height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", opacity: linking ? 0.65 : 1 }}>
          {linking ? <LoadingSpinner size={16} color="#fff" /> : "Link Child"}
          </button>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children.length === 0 && (
          <EmptyState
            icon={Users}
            title="No children linked"
            description="Link your child's school account using their school email."
          />
        )}
        {children.map((c) => (
          <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{c.name[0]}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--gray-400)" }}>{c.email}</div>
              </div>
            </div>
            <Link href={`/student/progress?student_id=${c.id}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", textDecoration: "none" }}>View Progress</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
