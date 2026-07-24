"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/app/lib/AuthContext";
import { AppSidebar } from "@/app/components/app/AppSidebar";
import { AppHeader } from "@/app/components/app/AppHeader";

function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "var(--gray-50)" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ width: 44, height: 44, borderRadius: 10, background: "var(--teal)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <img src="/logo.png" alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
          </span>
          <div style={{ fontSize: 14, color: "var(--gray-500)" }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100svh", background: "var(--gray-50)" }}>
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppHeader />
        <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
          {children}
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
