"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" gives a red confirm button (destructive actions). */
  tone?: "danger" | "default";
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<((opts: ConfirmOptions) => Promise<boolean>) | null>(null);

/** await confirm({ title, message, tone:"danger" }) → true if the user confirms. */
export function useConfirm(): (opts: ConfirmOptions) => Promise<boolean> {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => setPending({ ...opts, resolve }));
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <ConfirmDialog
          {...pending}
          onClose={(ok) => { pending.resolve(ok); setPending(null); }}
        />
      )}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialog({ title, message, confirmLabel, cancelLabel, tone = "default", onClose }: Pending & { onClose: (ok: boolean) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);
  const danger = tone === "danger";

  useEffect(() => {
    restoreRef.current = document.activeElement;
    // Focus the safer choice by default: Cancel for destructive, Confirm otherwise.
    (danger ? cancelBtnRef : confirmBtnRef).current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(false); return; }
      if (e.key === "Tab") {
        // Trap focus between the two buttons.
        const focusables = [cancelBtnRef.current, confirmBtnRef.current].filter(Boolean) as HTMLElement[];
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [danger, onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(16,24,40,0.5)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(false); }}
    >
      <div
        ref={cardRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={message ? "confirm-message" : undefined}
        className="confirm-pop"
        style={{ width: "100%", maxWidth: 420, background: "var(--bg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-2xl, 0 24px 48px rgba(16,24,40,0.24))", padding: 24 }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <span aria-hidden="true" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "var(--radius-full)", display: "inline-flex", alignItems: "center", justifyContent: "center", background: danger ? "#FEF3F2" : "var(--teal-50)" }}>
            <AlertTriangle size={20} strokeWidth={2} style={{ color: danger ? "#D92D20" : "var(--teal)" }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h2 id="confirm-title" style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{title}</h2>
            {message && <p id="confirm-message" style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.55 }}>{message}</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={() => onClose(false)}
            style={{ height: 42, padding: "0 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--bg)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            {cancelLabel ?? "Cancel"}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => onClose(true)}
            style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", border: "none", background: danger ? "#D92D20" : "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            {confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
