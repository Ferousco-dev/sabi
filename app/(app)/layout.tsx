"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/app/lib/AuthContext";
import { PremiumSidebar } from "@/app/components/app/PremiumSidebar";
import { PremiumTopbar } from "@/app/components/app/PremiumTopbar";

function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Restore + persist the desktop sidebar collapsed preference.
  useEffect(() => {
    try { setCollapsed(localStorage.getItem("sabihub_sidebar_collapsed") === "1"); } catch { /* ignore */ }
  }, []);
  const toggleCollapsed = () => setCollapsed((c) => {
    const next = !c;
    try { localStorage.setItem("sabihub_sidebar_collapsed", next ? "1" : "0"); } catch { /* ignore */ }
    return next;
  });

  // Lock scroll + Escape to close while the mobile drawer is open.
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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "var(--bg-subtle)" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, overflow: "hidden" }}>
            <img src="/logo.png" alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
          </span>
          <div style={{ fontSize: 14, color: "var(--text-subtle)" }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "var(--bg-subtle)" }}>
      <a href="#main" className="skip-link">Skip to content</a>
      {/* Desktop sidebar, sticky to the viewport, collapsible to an icon rail. */}
      <aside className="sidebar-root hidden lg:block" style={{ width: collapsed ? 76 : 264, flexShrink: 0, position: "sticky", top: 0, height: "100dvh", alignSelf: "flex-start" }}>
        <PremiumSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      </aside>

      {/* Mobile drawer + scrim. */}
      <div className="lg:hidden" aria-hidden={!drawerOpen} style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: drawerOpen ? "auto" : "none" }}>
        <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(16,24,40,0.5)", opacity: drawerOpen ? 1 : 0, transition: "opacity 0.25s ease" }} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 264, maxWidth: "84vw", transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: drawerOpen ? "var(--shadow-2xl)" : "none" }}
        >
          <PremiumSidebar onNavigate={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* Main column. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <PremiumTopbar onMenuClick={() => setDrawerOpen(true)} />
        <main style={{ flex: 1, padding: "clamp(20px, 3vw, 32px)" }}>
          <div style={{ maxWidth: 1200, marginInline: "auto", width: "100%" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
