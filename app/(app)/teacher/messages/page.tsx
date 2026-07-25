"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getTeacherMessages, sendTeacherMessage, type MessageThread } from "@/app/lib/api/teacher";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getTeacherMessages().then((res) => {
      if (res.ok && res.data) setThreads(res.data.threads);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient.trim() || !message.trim()) return;
    setSending(true);
    await sendTeacherMessage({ recipient_id: Number(recipient), subject, message: message.trim() });
    setSending(false);
    setRecipient(""); setSubject(""); setMessage("");
  }

  if (loading) return <LoadingPage />;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Messages</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow-xs)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 14 }}>New Message</h2>
        <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient ID"
            style={{ height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)"
            style={{ height: 42, padding: "0 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none" }} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Type your message…"
            style={{ padding: "12px 14px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }} />
          <button type="submit" disabled={sending || !recipient.trim() || !message.trim()}
            style={{ height: 42, padding: "0 18px", borderRadius: 8, background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start", opacity: sending ? 0.65 : 1 }}>
            <Send size={16} /> {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Conversations</h2>
        {threads.map((t) => (
          <div key={t.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MessageSquare size={18} color="var(--teal)" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{t.participant_name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{t.last_message}</div>
              </div>
            </div>
            {t.unread_count > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--gold)", borderRadius: 999, padding: "2px 7px" }}>{t.unread_count}</span>}
          </div>
        ))}
        {threads.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start a new message to communicate with students or staff."
          />
        )}
      </div>
    </div>
  );
}
