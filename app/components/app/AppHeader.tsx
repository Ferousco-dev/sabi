"use client";
import { Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { AppSidebar } from "./AppSidebar";

export function AppHeader() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <>
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ flex: 1 }} onClick={() => setSidebarOpen(false)} />
          <div style={{ width: 280, background: "#fff", overflowY: "auto", boxShadow: "var(--shadow-2xl)" }}>
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSidebarOpen(false)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>
            <AppSidebar />
          </div>
        </div>
      )}

      <header style={{
        height: 60, borderBottom: "1px solid var(--border)", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="flex lg:hidden" onClick={() => setSidebarOpen(true)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={18} />
          </button>
          <div className="hidden sm:flex" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--gray-50)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", width: 200 }}>
            <Search size={15} style={{ color: "var(--gray-400)" }} />
            <span style={{ fontSize: 13, color: "var(--gray-400)" }}>Search…</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ position: "relative", width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={17} style={{ color: "var(--gray-600)" }} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "var(--gold)" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
              {initials}
            </span>
            <div className="hidden sm:block">
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-900)", lineHeight: 1.3 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--gray-500)", textTransform: "capitalize" }}>{user?.role?.replace("_", " ")}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
