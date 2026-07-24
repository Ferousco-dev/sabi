"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3,
  MessageSquare, Store, Settings, LogOut, GraduationCap,
  UserPlus, ArrowRight, Columns3, BookText, Building,
  Clock, ClipboardCheck, FileText, Megaphone, Bell,
  Upload, Building2, CalendarDays, ListOrdered, Sun,
  ScrollText, History, Shield,
} from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import type { Role } from "@/app/lib/auth";

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard; badge?: number };

const ROLE_NAV: Record<Role, NavItem[]> = {
  school_admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Register", href: "/admin/student-registration", icon: UserPlus },
    { label: "Transfers", href: "/admin/transfers", icon: ArrowRight },
    { label: "Classes", href: "/admin/classes", icon: GraduationCap },
    { label: "Sections", href: "/admin/sections", icon: Columns3 },
    { label: "Subjects", href: "/admin/subjects", icon: BookText },
    { label: "Departments", href: "/admin/departments", icon: Building },
    { label: "Timetable", href: "/admin/timetable", icon: BookOpen },
    { label: "Attendance", href: "/admin/attendance", icon: ClipboardList },
    { label: "Corrections", href: "/admin/attendance-corrections", icon: Clock },
    { label: "Teachers", href: "/admin/teachers", icon: Users },
    { label: "Enrollments", href: "/admin/enrollments", icon: UserPlus },
    { label: "Assessments", href: "/admin/assessments", icon: ClipboardCheck },
    { label: "Results", href: "/admin/results", icon: FileText },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Users & Invites", href: "/admin/invitations", icon: Users },
    { label: "Bulk Import", href: "/admin/bulk-import", icon: Upload },
    { label: "Profile", href: "/admin/profile", icon: Building2 },
    { label: "Campuses", href: "/admin/campuses", icon: Building2 },
    { label: "Sessions", href: "/admin/sessions", icon: CalendarDays },
    { label: "Terms", href: "/admin/terms", icon: ListOrdered },
    { label: "Holidays", href: "/admin/holidays", icon: Sun },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Login History", href: "/admin/login-history", icon: History },
    { label: "Security", href: "/admin/security", icon: Shield },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Lessons", href: "/teacher/lessons", icon: BookOpen },
    { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
    { label: "Grading", href: "/teacher/grading", icon: BarChart3 },
  ],
  student: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Content", href: "/student/content", icon: BookOpen },
    { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
    { label: "Progress", href: "/student/progress", icon: GraduationCap },
  ],
  parent: [
    { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
    { label: "Children", href: "/parent/children", icon: Users },
    { label: "Alerts", href: "/parent/alerts", icon: MessageSquare },
  ],
  creator: [
    { label: "Dashboard", href: "/creator", icon: LayoutDashboard },
    { label: "Courses", href: "/creator/courses", icon: BookOpen },
    { label: "Revenue", href: "/creator/revenue", icon: BarChart3 },
    { label: "Marketplace", href: "/creator/marketplace", icon: Store },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role ?? "student";
  const navItems = ROLE_NAV[role] ?? ROLE_NAV.student;

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      borderRight: "1px solid var(--border)",
      background: "#fff",
      display: "flex", flexDirection: "column",
      height: "100svh", position: "sticky", top: 0,
    }}>
      <div style={{ padding: "18px 16px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>SabiHub</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, textDecoration: "none",
                fontSize: 14, fontWeight: active ? 600 : 500,
                color: active ? "var(--teal)" : "var(--gray-600)",
                background: active ? "var(--teal-50)" : "transparent",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--gray-50)"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; } }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--teal)", borderRadius: 999, padding: "1px 7px" }}>{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
        <Link href="/settings" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500, color: "var(--gray-600)", transition: "background 0.12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--gray-600)", background: "transparent", border: "none", cursor: "pointer", width: "100%", fontFamily: "var(--font-sans)", transition: "background 0.12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
