"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { NAV_BY_ROLE, ROLE_LABEL, type NavItem } from "./dashboardNav";
import { initials } from "@/app/lib/dashboard";

function isActive(pathname: string, item: NavItem, basePath: string): boolean {
  if (item.href === basePath) return pathname === basePath;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function PremiumSidebar({
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  onNavigate?: () => void;
  /** Icon-only rail when true (desktop). Drawer always renders expanded. */
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const role = user?.role ?? "student";
  const sections = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.student;
  const basePath = sections[0]?.items[0]?.href ?? "/";

  async function signOut() {
    await logout();
    router.replace("/login");
  }

  const padX = collapsed ? 0 : 12;

  return (
    <nav
      aria-label={`${ROLE_LABEL[role]} navigation`}
      className="sidebar-root"
      style={{ width: collapsed ? 76 : 264, height: "100%", background: "var(--bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Brand + collapse toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", gap: 8, padding: collapsed ? "18px 0 14px" : "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <Link href={basePath} onClick={onNavigate} aria-label="SabiHub" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            <img src="/logo.png" alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
          </span>
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--teal)" }}>SabiHub</span>}
        </Link>
        {onToggle && !collapsed && (
          <button type="button" onClick={onToggle} aria-label="Collapse sidebar" className="nav-item" style={toggleStyle}>
            <PanelLeftClose size={18} strokeWidth={1.9} style={{ color: "var(--gray-400)" }} aria-hidden="true" />
          </button>
        )}
      </div>

      {onToggle && collapsed && (
        <button type="button" onClick={onToggle} aria-label="Expand sidebar" className="nav-item rail-tip" data-tip="Expand" style={{ ...toggleStyle, alignSelf: "center", marginTop: 8 }}>
          <PanelLeftOpen size={18} strokeWidth={1.9} style={{ color: "var(--gray-400)" }} aria-hidden="true" />
        </button>
      )}

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: collapsed ? "10px 12px 20px" : "12px 12px 20px" }}>
        {sections.map((section, si) => (
          <div key={si} style={{ marginTop: si === 0 ? 0 : (collapsed ? 10 : 18) }}>
            {section.title && !collapsed && (
              <p className="sidebar-label" style={{ padding: "0 12px 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-400)" }}>
                {section.title}
              </p>
            )}
            {section.title && collapsed && si > 0 && <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 3, alignItems: collapsed ? "center" : "stretch" }}>
              {section.items.map((item) => {
                const active = isActive(pathname, item, basePath);
                const Icon = item.icon;
                return (
                  <li key={item.href} style={{ width: collapsed ? "auto" : "100%" }}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      data-active={active}
                      data-tip={item.label}
                      className={`nav-item${collapsed ? " rail-tip" : ""}`}
                      style={{
                        position: "relative", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
                        gap: 11, minHeight: 44, width: collapsed ? 44 : "100%", padding: collapsed ? 0 : `0 ${padX}px`,
                        borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: 14, fontWeight: active ? 600 : 500,
                        color: active ? "var(--teal)" : "var(--text-muted)", background: active ? "var(--teal-50)" : "transparent",
                      }}
                    >
                      {active && !collapsed && <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 9, bottom: 9, width: 3, borderRadius: "0 3px 3px 0", background: "var(--teal)" }} />}
                      <Icon className="sidebar-icon" size={19} strokeWidth={active ? 2.1 : 1.9} style={{ color: active ? "var(--teal)" : "var(--gray-400)", flexShrink: 0 }} aria-hidden="true" />
                      {!collapsed && <span className="sidebar-label" style={{ flex: 1 }}>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User + sign out */}
      <div style={{ padding: collapsed ? "10px 0" : 12, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: collapsed ? "center" : "stretch", gap: 4 }}>
        {user && !collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", marginBottom: 4 }}>
            <span aria-hidden="true" style={avatarStyle}>{initials(user.name)}</span>
            <span style={{ minWidth: 0, lineHeight: 1.25 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</span>
              <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
            </span>
          </div>
        )}
        {user && collapsed && <span aria-hidden="true" title={user.name} style={{ ...avatarStyle, marginBottom: 6 }}>{initials(user.name)}</span>}
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          data-tip="Sign out"
          className={`nav-item${collapsed ? " rail-tip" : ""}`}
          style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 11, width: collapsed ? 44 : "100%", minHeight: 44, padding: collapsed ? 0 : "0 12px", borderRadius: "var(--radius-sm)", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)", textAlign: "left" }}
        >
          <LogOut className="sidebar-icon" size={18} strokeWidth={1.9} style={{ color: "var(--gray-400)", flexShrink: 0 }} aria-hidden="true" />
          {!collapsed && <span className="sidebar-label">Sign out</span>}
        </button>
      </div>
    </nav>
  );
}

const toggleStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  flexShrink: 0,
};

const avatarStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "var(--radius-full)",
  background: "var(--teal)",
  color: "#fff",
  fontSize: 12.5,
  fontWeight: 700,
  flexShrink: 0,
};
