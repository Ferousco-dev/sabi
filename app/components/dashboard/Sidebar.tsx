"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/Logo";
import type { DashboardConfig, NavItem } from "../../lib/dashboard-nav";
import { SIDEBAR_WIDTH } from "../../lib/dashboard";

/** True when the current URL should light up this nav item. */
function isActive(pathname: string, item: NavItem, basePath: string): boolean {
  // Overview (the base path itself) only matches exactly, so it does not stay
  // lit on every sub-route.
  if (item.href === basePath) return pathname === basePath;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Sidebar({
  config,
  onNavigate,
}: {
  config: DashboardConfig;
  /** Called after a link is tapped, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={`${config.roleLabel} navigation`}
      style={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        background: "var(--bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href={config.basePath} onClick={onNavigate} style={{ textDecoration: "none" }}>
          <Logo size="md" />
        </Link>
        <p style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: "var(--text-subtle)" }}>
          {config.roleLabel}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
        {config.sections.map((section, si) => (
          <div key={si} style={{ marginTop: si === 0 ? 0 : 18 }}>
            {section.title && (
              <p
                style={{
                  padding: "0 12px 6px",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--gray-400)",
                }}
              >
                {section.title}
              </p>
            )}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item) => {
                const active = isActive(pathname, item, config.basePath);
                const { Icon } = item;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                      className="nav-item"
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        minHeight: 44,
                        padding: "0 12px",
                        borderRadius: "var(--radius-sm)",
                        textDecoration: "none",
                        fontSize: 14.5,
                        fontWeight: active ? 600 : 500,
                        color: active ? "var(--teal)" : "var(--text-muted)",
                        background: active ? "var(--teal-50)" : "transparent",
                      }}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 10,
                            bottom: 10,
                            width: 3,
                            borderRadius: "0 3px 3px 0",
                            background: "var(--teal)",
                          }}
                        />
                      )}
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.1 : 1.9}
                        style={{ color: active ? "var(--teal)" : "var(--gray-400)", flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge ? (
                        <span
                          style={{
                            minWidth: 20,
                            height: 20,
                            padding: "0 6px",
                            borderRadius: "var(--radius-full)",
                            background: active ? "var(--teal)" : "var(--gray-100)",
                            color: active ? "#fff" : "var(--text-muted)",
                            fontSize: 11.5,
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
