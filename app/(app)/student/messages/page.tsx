"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getStudentMessages, sendStudentMessage, type MessageThread } from "@/app/lib/api/student";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { initials } from "@/app/lib/dashboard";

export default function StudentMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => getStudentMessages().then((res) => {
    if (res.ok && res.data) setThreads(res.data.threads);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient.trim() || !message.trim()) return;
    setSending(true);
    await sendStudentMessage({ recipient_id: Number(recipient), subject, message: message.trim() });
    setSending(false);
    setRecipient(""); setSubject(""); setMessage("");
    load();
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <PageHeader title="Messages" subtitle="Chat with your teachers and classmates." />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card title="New message">
            <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient ID" inputMode="numeric" style={inputStyle} aria-label="Recipient ID" />
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" style={inputStyle} aria-label="Subject" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Type your message…"
                style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical" }} aria-label="Message" />
              <button type="submit" disabled={sending || !recipient.trim() || !message.trim()}
                style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: sending || !recipient.trim() || !message.trim() ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", opacity: sending || !recipient.trim() || !message.trim() ? 0.6 : 1, fontFamily: "var(--font-sans)" }}>
                {sending ? <LoadingSpinner size={15} color="#fff" /> : <Send size={16} strokeWidth={2} aria-hidden="true" />} {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </Card>
        </div>

        <div style={{ flex: "1.2 1 340px", minWidth: 0 }}>
          <Card title="Conversations" padded={false}>
            {threads.length === 0 ? (
              <EmptyState Icon={MessageSquare} title="No conversations" description="Start a new message to chat with your teachers or classmates." />
            ) : (
              <ul style={{ listStyle: "none" }}>
                {threads.map((t) => (
                  <li key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials(t.participant_name)}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{t.participant_name} <span style={{ fontWeight: 500, color: "var(--text-subtle)", fontSize: 12.5 }}>· {t.participant_role}</span></div>
                        <div style={{ fontSize: 12.5, color: "var(--text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{t.last_message}</div>
                      </div>
                    </div>
                    {t.unread_count > 0 && <Badge tone="teal">{t.unread_count}</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  height: 42,
  padding: "0 14px",
  fontSize: 14,
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  fontFamily: "var(--font-sans)",
  width: "100%",
} as const;
