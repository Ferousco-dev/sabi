"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Badge } from "./Badge";
import { initials } from "../../lib/dashboard";
import { CONVERSATIONS, type ChatMessage } from "../../data/mock/messages";

/**
 * Shared messaging view used by every role's Messages screen: a conversation
 * list beside the selected thread with a composer. Sending appends a local
 * message (the real send goes through the messaging API later). Two panes on
 * wide screens; they stack on narrow ones.
 */
export function MessagesView({ note }: { note?: string }) {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages])),
  );
  const [draft, setDraft] = useState("");

  const active = CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0];
  const messages = threads[activeId] ?? [];

  function send() {
    const text = draft.trim();
    if (!text) return;
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { id: `local-${(prev[activeId]?.length ?? 0) + 1}`, from: "me", text, when: "Now" }],
    }));
    setDraft("");
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "stretch" }}>
      {/* Conversation list. */}
      <div style={{ flex: "1 1 260px", minWidth: 0, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", overflow: "hidden", alignSelf: "flex-start" }}>
        <ul style={{ listStyle: "none" }}>
          {CONVERSATIONS.map((c) => {
            const isActive = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  aria-current={isActive ? "true" : undefined}
                  style={{
                    display: "flex",
                    gap: 11,
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    borderLeft: `3px solid ${isActive ? "var(--teal)" : "transparent"}`,
                    background: isActive ? "var(--teal-50)" : "var(--bg)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {initials(c.name)}
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                      <span style={{ fontSize: 11.5, color: "var(--text-subtle)", flexShrink: 0 }}>{c.when}</span>
                    </span>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--text-subtle)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.preview}
                    </span>
                  </span>
                  {c.unread > 0 && (
                    <span style={{ alignSelf: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {c.unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Thread. */}
      <div style={{ flex: "2 1 380px", minWidth: 0, display: "flex", flexDirection: "column", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", overflow: "hidden", minHeight: 460 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-full)", background: "var(--teal-50)", color: "var(--teal)", fontSize: 13, fontWeight: 700 }}>
            {initials(active.name)}
          </span>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{active.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{active.role}</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          {note && (
            <p style={{ fontSize: 12.5, color: "var(--text-subtle)", textAlign: "center", padding: "4px 0" }}>{note}</p>
          )}
          {messages.map((m) => {
            const mine = m.from === "me";
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "76%", padding: "9px 13px", borderRadius: mine ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: mine ? "var(--teal)" : "var(--gray-100)", color: mine ? "#fff" : "var(--gray-900)" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.4 }}>{m.text}</p>
                  <p style={{ fontSize: 11, marginTop: 3, color: mine ? "rgba(255,255,255,0.75)" : "var(--text-subtle)", textAlign: "right" }}>{m.when}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          style={{ display: "flex", gap: 10, padding: 12, borderTop: "1px solid var(--border)" }}
        >
          <label style={{ flex: 1, minWidth: 0 }}>
            <span className="sr-only">Message {active.name}</span>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message"
              style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg-subtle)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-sans)", outline: "none" }}
            />
          </label>
          <button
            type="submit"
            aria-label="Send message"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "var(--radius-sm)", border: "none", background: "var(--teal)", cursor: "pointer", flexShrink: 0 }}
          >
            <Send size={17} strokeWidth={2} style={{ color: "#fff" }} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
