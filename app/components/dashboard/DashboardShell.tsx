"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar, type TopbarUser } from "./Topbar";
import { CONFIG_BY_ROLE } from "../../lib/dashboard-nav";
import type { Role } from "../../lib/auth";
import { SIDEBAR_WIDTH } from "../../lib/dashboard";

/**
 * The frame every role portal shares. On desktop the sidebar sits in the flex
 * flow and stays put while content scrolls; below the large breakpoint it
 * becomes an off-canvas drawer opened from the topbar, with a scrim and body
 * scroll lock. Content max-width keeps long lines readable on wide monitors.
 */
export function DashboardShell({
  role,
  user,
  children,
}: {
  /** Which portal to render. Only this serializable string crosses the
   * server to client boundary; the icon-bearing config is resolved here. */
  role: Role;
  user: TopbarUser;
  children: ReactNode;
}) {
  const config = CONFIG_BY_ROLE[role];
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll and allow Escape to close while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  if (!config) {
    // No portal for this role yet (e.g. creator). Render content plainly so the
    // route still works rather than crashing.
    return (
      <main style={{ padding: "clamp(20px, 3vw, 32px)", background: "var(--bg-subtle)", minHeight: "100dvh" }}>
        <div style={{ maxWidth: 1200, marginInline: "auto" }}>{children}</div>
      </main>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "var(--bg-subtle)" }}>
      {/* Desktop sidebar: in flow, sticky to the viewport top. */}
      <aside
        className="hidden lg:block"
        style={{ width: SIDEBAR_WIDTH, flexShrink: 0, position: "sticky", top: 0, height: "100dvh", alignSelf: "flex-start" }}
      >
        <Sidebar config={config} />
      </aside>

      {/* Mobile drawer + scrim. */}
      <div
        className="lg:hidden"
        aria-hidden={!drawerOpen}
        style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: drawerOpen ? "auto" : "none" }}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(16,24,40,0.5)",
            opacity: drawerOpen ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${config.roleLabel} navigation`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: SIDEBAR_WIDTH,
            maxWidth: "84vw",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: drawerOpen ? "var(--shadow-2xl)" : "none",
          }}
        >
          <Sidebar config={config} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* Main column. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar user={user} onMenuClick={() => setDrawerOpen(true)} />
        <main style={{ flex: 1, padding: "clamp(20px, 3vw, 32px)" }}>
          <div style={{ maxWidth: 1200, marginInline: "auto", width: "100%" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
