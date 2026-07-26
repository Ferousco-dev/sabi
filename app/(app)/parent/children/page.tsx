"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Users, ArrowRight } from "lucide-react";
import { getChildren, linkChild, type Child } from "@/app/lib/api/parent";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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
    <>
      <PageHeader title="My children" subtitle="Link and follow each child's school account." />

      <Card title="Link a child" style={{ marginBottom: 20 }}>
        {linkError && (
          <div role="alert" style={{ padding: "9px 12px", borderRadius: "var(--radius-sm)", background: "#FEF3F2", border: "1px solid #FECDCA", color: "#B42318", fontSize: 13, marginBottom: 12 }}>{linkError}</div>
        )}
        <form onSubmit={handleLink} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="student@school.edu.ng" aria-label="Child's school email"
            style={{ flex: "1 1 240px", height: 42, padding: "0 14px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
          <button type="submit" disabled={linking || !email.trim()}
            style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: linking || !email.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: linking || !email.trim() ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
            {linking ? <LoadingSpinner size={15} color="#fff" /> : <UserPlus size={16} strokeWidth={2.1} aria-hidden="true" />} Link child
          </button>
        </form>
      </Card>

      {children.length === 0 ? (
        <Card><EmptyState Icon={Users} title="No children linked" description="Link your child's school account using their school email above." /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {children.map((c) => (
            <Card key={c.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span aria-hidden="true" style={{ width: 46, height: 46, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, flexShrink: 0 }}>{c.name[0]?.toUpperCase()}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <Link href={`/student/progress?student_id=${c.id}`} style={linkStyle}>Progress <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>
                <Link href={`/parent/results/${c.id}`} style={linkStyle}>Results <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13.5,
  fontWeight: 600,
  color: "var(--teal)",
  textDecoration: "none",
};
