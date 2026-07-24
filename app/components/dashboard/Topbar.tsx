"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, UserRound, Settings, LogOut } from "lucide-react";
import { TOPBAR_HEIGHT, initials } from "../../lib/dashboard";
import { logout } from "../../lib/auth";

export type TopbarUser = { name: string; roleLabel: string };

export function Topbar({
  user,
  onMenuClick,
  hasAlerts = true,
}: {
  user: TopbarUser;
  /** Opens the mobile nav drawer. */
  onMenuClick: () => void;
  /** Shows the animated unread mark on the bell. */
  hasAlerts?: boolean;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the avatar menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function signOut() {
    await logout();
    router.push("/login");
  }

  return (
    <header
      style={{
        height: TOPBAR_HEIGHT,
        flexShrink: 0,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex lg:hidden"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Menu size={20} strokeWidth={1.9} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
      </button>

      {/* Search: real field, collapses to an icon-only affordance on phones. */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1,
          maxWidth: 420,
          height: 40,
          padding: "0 12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
      >
        <Search size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)", flexShrink: 0 }} aria-hidden="true" />
        <span className="sr-only">Search</span>
        <input
          type="search"
          placeholder="Search students, classes, results"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: 14,
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </label>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        aria-label={hasAlerts ? "Notifications, unread alerts" : "Notifications"}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Bell size={19} strokeWidth={1.9} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
        {hasAlerts && (
          <span aria-hidden="true" style={{ position: "absolute", top: 9, right: 9, width: 8, height: 8 }}>
            <span
              className="live-pulse"
              style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-full)", background: "var(--gold)" }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "var(--radius-full)",
                background: "var(--gold)",
                border: "1.5px solid var(--bg)",
              }}
            />
          </span>
        )}
      </button>

      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            height: 44,
            padding: "0 8px 0 6px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid transparent",
            background: menuOpen ? "var(--gray-50)" : "transparent",
            cursor: "pointer",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "var(--radius-full)",
              background: "var(--teal)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {initials(user.name)}
          </span>
          <span className="hidden sm:block" style={{ textAlign: "left", lineHeight: 1.2 }}>
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)" }}>
              {user.name}
            </span>
            <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)" }}>{user.roleLabel}</span>
          </span>
          <ChevronDown size={16} strokeWidth={2} style={{ color: "var(--text-subtle)" }} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: 200,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: 6,
              zIndex: 30,
            }}
          >
            {[
              { label: "Profile", Icon: UserRound },
              { label: "Settings", Icon: Settings },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                className="nav-item"
                style={menuItemStyle}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={17} strokeWidth={1.9} style={{ color: "var(--text-subtle)" }} aria-hidden="true" />
                {label}
              </button>
            ))}
            <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />
            <button type="button" role="menuitem" className="nav-item" style={{ ...menuItemStyle, color: "#B42318" }} onClick={signOut}>
              <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
              Sign out
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
  width: "100%",
  minHeight: 40,
  padding: "0 10px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--text-muted)",
  fontFamily: "var(--font-sans)",
  textAlign: "left" as const,
};
