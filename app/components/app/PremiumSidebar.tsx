"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { NAV_BY_ROLE, ROLE_LABEL, type NavItem } from "./dashboardNav";
import { initials } from "@/app/lib/dashboard";

function isActive(pathname: string, item: NavItem, basePath: string): boolean {
  if (item.href === basePath) return pathname === basePath;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function PremiumSidebar({ onNavigate }: { onNavigate?: () => void }) {
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

  return (
    <nav
      aria-label={`${ROLE_LABEL[role]} navigation`}
      style={{ width: 264, height: "100%", background: "var(--bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href={basePath} onClick={onNavigate} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            <img src="/logo.png" alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--teal)" }}>SabiHub</span>
        </Link>
        <p style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: "var(--text-subtle)" }}>{ROLE_LABEL[role]}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
        {sections.map((section, si) => (
          <div key={si} style={{ marginTop: si === 0 ? 0 : 18 }}>
            {section.title && (
              <p style={{ padding: "0 12px 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-400)" }}>
                {section.title}
              </p>
            )}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item) => {
                const active = isActive(pathname, item, basePath);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                      className="nav-item"
                      style={{
                        position: "relative", display: "flex", alignItems: "center", gap: 11,
                        minHeight: 42, padding: "0 12px", borderRadius: "var(--radius-sm)",
                        textDecoration: "none", fontSize: 14, fontWeight: active ? 600 : 500,
                        color: active ? "var(--teal)" : "var(--text-muted)",
                        background: active ? "var(--teal-50)" : "transparent",
                      }}
                    >
                      {active && <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 9, bottom: 9, width: 3, borderRadius: "0 3px 3px 0", background: "var(--teal)" }} />}
                      <Icon size={18} strokeWidth={active ? 2.1 : 1.9} style={{ color: active ? "var(--teal)" : "var(--gray-400)", flexShrink: 0 }} aria-hidden="true" />
                      <span style={{ flex: 1 }}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)", marginBottom: 4 }}>
            <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-full)", background: "var(--teal)", color: "#fff", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
              {initials(user.name)}
            </span>
            <span style={{ minWidth: 0, lineHeight: 1.25 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</span>
              <span style={{ display: "block", fontSize: 12, color: "var(--text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={signOut}
          className="nav-item"
          style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", minHeight: 42, padding: "0 12px", borderRadius: "var(--radius-sm)", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)", textAlign: "left" }}
        >
          <LogOut size={18} strokeWidth={1.9} style={{ color: "var(--gray-400)" }} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </nav>
  );
}
