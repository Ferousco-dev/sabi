"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { getAnnouncements, createAnnouncement, type Announcement } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

const TARGET_LABELS: Record<string, string> = {
  teacher: "Teachers",
  student: "Students",
  parent: "Parents",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => getAnnouncements().then((res) => {
    if (res.ok && res.data) setAnnouncements(res.data.announcements);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSending(true);
    await createAnnouncement({
      title: title.trim(), content: content.trim(),
      target_role: target || undefined,
    });
    setTitle(""); setContent(""); setTarget("");
    setSending(false);
    load();
  }

  if (loading) return <LoadingPage />;

  const canSubmit = title.trim() && content.trim();

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Broadcast important updates to students, teachers, or parents."
        actions={<Badge tone="teal">{announcements.length} posted</Badge>}
      />

      <div style={{ maxWidth: 760 }}>
        <Card title="New announcement" style={{ marginBottom: 20 }}>
          <form onSubmit={handleSend} style={{ display: "grid", gap: 14 }}>
            <div>
              <label htmlFor="ann-title" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Title</label>
              <input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title"
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
            </div>
            <div>
              <label htmlFor="ann-content" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Content</label>
              <textarea id="ann-content" value={content} onChange={(e) => setContent(e.target.value)} rows={4}
                style={{ width: "100%", padding: "12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "0 1 200px" }}>
                <label htmlFor="ann-target" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Target (optional)</label>
                <select id="ann-target" value={target} onChange={(e) => setTarget(e.target.value)}
                  style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", background: "var(--bg)", fontFamily: "var(--font-sans)", color: "var(--text)" }}>
                  <option value="">Everyone</option>
                  <option value="teacher">Teachers</option>
                  <option value="student">Students</option>
                  <option value="parent">Parents</option>
                </select>
              </div>
              <button type="submit" disabled={sending || !canSubmit}
                style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: sending || !canSubmit ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: sending || !canSubmit ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
                {sending ? <LoadingSpinner size={15} color="#fff" /> : <Send size={16} aria-hidden="true" />} {sending ? "Sending…" : "Send announcement"}
              </button>
            </div>
          </form>
        </Card>

        {announcements.length === 0 ? (
          <Card><EmptyState Icon={Megaphone} title="No announcements yet" description="Broadcast important updates to students, teachers, or parents above." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {announcements.map((a) => (
              <div key={a.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Megaphone size={19} style={{ color: "var(--teal)" }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{a.title}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {a.target_role && <Badge tone="neutral">{TARGET_LABELS[a.target_role] ?? a.target_role}</Badge>}
                        <span style={{ fontSize: 12, color: "var(--text-subtle)", whiteSpace: "nowrap" }}>{new Date(a.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 8 }}>{a.content}</p>
                    <div style={{ fontSize: 12, color: "var(--text-subtle)", display: "flex", gap: 14 }}>
                      <span>By {a.created_by}</span>
                      <span>{a.read_count} reads</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
