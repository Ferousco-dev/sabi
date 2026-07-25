"use client";
import { Menu, Search, Bell } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { ROLE_LABEL } from "./dashboardNav";
import { initials } from "@/app/lib/dashboard";

export function PremiumTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const name = user?.name ?? "";
  const roleLabel = user ? ROLE_LABEL[user.role] : "";

  return (
    <header
      style={{
        height: 64, flexShrink: 0, background: "var(--bg)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
        position: "sticky", top: 0, zIndex: 20,
      }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex lg:hidden"
        style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", flexShrink: 0 }}
      >
        <Menu size={20} strokeWidth={1.9} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </button>

      <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 420, height: 40, padding: "0 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
        <Search size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)", flexShrink: 0 }} aria-hidden="true" />
        <span className="sr-only">Search</span>
        <input
          type="search"
          placeholder="Search"
          style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-sans)" }}
        />
      </label>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        aria-label="Notifications, unread alerts"
        style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", flexShrink: 0 }}
      >
        <Bell size={19} strokeWidth={1.9} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        <span aria-hidden="true" style={{ position: "absolute", top: 9, right: 9, width: 8, height: 8 }}>
          <span className="live-pulse" style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-full)", background: "var(--gold)" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-full)", background: "var(--gold)", border: "1.5px solid var(--bg)" }} />
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 9, height: 44, padding: "0 6px", flexShrink: 0 }}>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
          {name ? initials(name) : ""}
        </span>
        <span className="hidden sm:block" style={{ textAlign: "left", lineHeight: 1.2 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)" }}>{name}</span>
          <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)" }}>{roleLabel}</span>
        </span>
      </div>
    </header>
  );
}
