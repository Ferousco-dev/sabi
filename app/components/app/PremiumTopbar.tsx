"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, ChevronDown, UserRound, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { ROLE_LABEL } from "./dashboardNav";
import { initials } from "@/app/lib/dashboard";

export function PremiumTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const name = user?.name ?? "";
  const roleLabel = user ? ROLE_LABEL[user.role] : "";
  const base = user ? `/${user.role === "school_admin" ? "admin" : user.role}` : "/";

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  async function signOut() { setMenuOpen(false); await logout(); router.replace("/login"); }

  return (
    <header style={{ height: 64, flexShrink: 0, background: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, padding: "0 16px", position: "sticky", top: 0, zIndex: 20 }}>
      <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="flex lg:hidden" style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", flexShrink: 0 }}>
        <Menu size={20} strokeWidth={1.9} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </button>

      <div style={{ flex: 1 }} />

      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen} style={{ display: "flex", alignItems: "center", gap: 9, height: 44, padding: "0 8px 0 6px", borderRadius: "var(--radius-sm)", border: "1px solid transparent", background: menuOpen ? "var(--gray-50)" : "transparent", cursor: "pointer" }}>
          <span aria-hidden="true" style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {name ? initials(name) : ""}
            <span style={{ position: "absolute", top: -1, right: -1, width: 9, height: 9, borderRadius: "var(--radius-full)", background: "var(--gold)", border: "1.5px solid var(--bg)" }} />
          </span>
          <span className="hidden sm:block" style={{ textAlign: "left", lineHeight: 1.2 }}>
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)" }}>{name}</span>
            <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)" }}>{roleLabel}</span>
          </span>
          <ChevronDown size={16} strokeWidth={2} style={{ color: "var(--text-subtle)" }} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div role="menu" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 210, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: 6, zIndex: 30 }}>
            <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 12, color: "var(--text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
            </div>
            <Link href={`${base}/notifications`} role="menuitem" className="nav-item" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <Bell size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)" }} aria-hidden="true" />
              <span style={{ flex: 1 }}>Notifications</span>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--gold)", flexShrink: 0 }} />
            </Link>
            <Link href={base} role="menuitem" className="nav-item" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <UserRound size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)" }} aria-hidden="true" /> Dashboard
            </Link>
            <Link href={`${base}/settings`} role="menuitem" className="nav-item" style={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <Settings size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)" }} aria-hidden="true" /> Settings
            </Link>
            <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />
            <button type="button" role="menuitem" className="nav-item" style={{ ...menuItemStyle, color: "#B42318", width: "100%", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)" }} onClick={signOut}>
              <LogOut size={17} strokeWidth={1.9} aria-hidden="true" /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minHeight: 40,
  padding: "0 10px",
  borderRadius: "var(--radius-sm)",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--text-muted)",
  textDecoration: "none",
  textAlign: "left" as const,
};
