"use client";
import { useEffect, useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { getAnnouncements, createAnnouncement, type Announcement } from "@/app/lib/api/schools";

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

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading announcements…</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Announcements</h1>

      <form onSubmit={handleSend} style={{ marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 14 }}>New Announcement</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 6 }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" style={{ width: "100%", height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 6 }}>Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 6 }}>Target (optional)</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} style={{ height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", background: "#fff" }}>
                <option value="">Everyone</option>
                <option value="teacher">Teachers</option>
                <option value="student">Students</option>
                <option value="parent">Parents</option>
              </select>
            </div>
            <button type="submit" disabled={sending || !title.trim() || !content.trim()}
              style={{ height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: sending ? 0.65 : 1 }}>
              <Plus size={16} /> {sending ? "Sending…" : "Send Announcement"}
            </button>
          </div>
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {announcements.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Megaphone size={20} color="var(--teal)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>{a.title}</div>
                  <span style={{ fontSize: 11, color: "var(--gray-400)" }}>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.5, marginBottom: 6 }}>{a.content}</p>
                <div style={{ fontSize: 11, color: "var(--gray-400)", display: "flex", gap: 12 }}>
                  <span>By {a.created_by}</span>
                  <span>{a.read_count} reads</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No announcements yet.</p>}
      </div>
    </div>
  );
}
