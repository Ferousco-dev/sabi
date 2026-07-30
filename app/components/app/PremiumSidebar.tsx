"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeftOpen, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { NAV_BY_ROLE, ROLE_LABEL, isGroup, type NavLink, type NavSection } from "./dashboardNav";
import { initials } from "@/app/lib/dashboard";

function linkActive(pathname: string, href: string, basePath: string): boolean {
  if (href === basePath) return pathname === basePath;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Which group labels contain the current route (so we can auto-open them). */
function activeGroups(sections: NavSection[], pathname: string, basePath: string): string[] {
  const open: string[] = [];
  for (const s of sections) for (const e of s.items) {
    if (isGroup(e) && e.children.some((c) => linkActive(pathname, c.href, basePath))) open.push(e.label);
  }
  return open;
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
  const basePath = (sections[0]?.items[0] as NavLink | undefined)?.href ?? "/";

  const [open, setOpen] = useState<Set<string>>(() => new Set(activeGroups(sections, pathname, basePath)));

  // Keep the group that owns the current route open as the user navigates.
  useEffect(() => {
    const active = activeGroups(sections, pathname, basePath);
    if (active.length) setOpen((prev) => { const next = new Set(prev); active.forEach((g) => next.add(g)); return next; });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleGroup(label: string) {
    setOpen((prev) => { const next = new Set(prev); next.has(label) ? next.delete(label) : next.add(label); return next; });
  }

  async function signOut() {
    await logout();
    router.replace("/login");
  }

  const padX = collapsed ? 0 : 12;

  /** A single leaf link (used at top level and inside groups). */
  function LeafLink({ item, nested }: { item: NavLink; nested?: boolean }) {
    const active = linkActive(pathname, item.href, basePath);
    const Icon = item.icon;
    return (
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
          gap: 11, minHeight: collapsed ? 44 : (nested ? 38 : 42), width: collapsed ? 44 : "100%",
          padding: collapsed ? 0 : `0 ${padX}px`, borderRadius: "var(--radius-sm)", textDecoration: "none",
          fontSize: nested ? 13.5 : 14, fontWeight: active ? 600 : 500,
          color: active ? "var(--teal)" : "var(--text-muted)", background: active ? "var(--teal-50)" : "transparent",
        }}
      >
        {active && !collapsed && <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "0 3px 3px 0", background: "var(--teal)" }} />}
        <Icon className="sidebar-icon" size={nested ? 17 : 19} strokeWidth={active ? 2.1 : 1.9} style={{ color: active ? "var(--teal)" : "var(--gray-400)", flexShrink: 0 }} aria-hidden="true" />
        {!collapsed && <span className="sidebar-label" style={{ flex: 1 }}>{item.label}</span>}
        {!collapsed && item.badge != null && (
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-subtle)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "1px 7px" }}>{item.badge}</span>
        )}
      </Link>
    );
  }

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
              <p className="sidebar-label" style={{ padding: "0 12px 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-400)" }}>{section.title}</p>
            )}
            {section.title && collapsed && si > 0 && <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 3, alignItems: collapsed ? "center" : "stretch" }}>
              {section.items.map((entry) => {
                if (!isGroup(entry)) {
                  return <li key={entry.href} style={{ width: collapsed ? "auto" : "100%" }}><LeafLink item={entry} /></li>;
                }
                // ── Collapsible group ──
                const Icon = entry.icon;
                const childActive = entry.children.some((c) => linkActive(pathname, c.href, basePath));
                const isOpen = open.has(entry.label);

                if (collapsed) {
                  // Rail: a single icon; clicking expands the sidebar and opens this group.
                  return (
                    <li key={entry.label} style={{ width: "auto" }}>
                      <button type="button" aria-label={entry.label} data-tip={entry.label} data-active={childActive}
                        onClick={() => { setOpen((p) => new Set(p).add(entry.label)); onToggle?.(); }}
                        className="nav-item rail-tip"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "none", background: childActive ? "var(--teal-50)" : "transparent", cursor: "pointer" }}>
                        <Icon className="sidebar-icon" size={19} strokeWidth={childActive ? 2.1 : 1.9} style={{ color: childActive ? "var(--teal)" : "var(--gray-400)" }} aria-hidden="true" />
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={entry.label} style={{ width: "100%" }}>
                    <button type="button" onClick={() => toggleGroup(entry.label)} aria-expanded={isOpen}
                      className="nav-item" data-active={childActive && !isOpen}
                      style={{
                        display: "flex", alignItems: "center", gap: 11, minHeight: 42, width: "100%", padding: `0 ${padX}px`,
                        borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left",
                        fontSize: 14, fontWeight: childActive ? 600 : 500,
                        color: childActive ? "var(--teal)" : "var(--text-muted)", background: childActive && !isOpen ? "var(--teal-50)" : "transparent",
                      }}>
                      <Icon className="sidebar-icon" size={19} strokeWidth={childActive ? 2.1 : 1.9} style={{ color: childActive ? "var(--teal)" : "var(--gray-400)", flexShrink: 0 }} aria-hidden="true" />
                      <span className="sidebar-label" style={{ flex: 1 }}>{entry.label}</span>
                      <ChevronDown size={16} strokeWidth={2} aria-hidden="true" style={{ color: "var(--gray-400)", flexShrink: 0, transition: "transform 0.18s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
                    </button>
                    {isOpen && (
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2, margin: "3px 0 4px", padding: 4, border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                        {entry.children.map((child) => (
                          <li key={child.href}><LeafLink item={child} nested /></li>
                        ))}
                      </ul>
                    )}
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
