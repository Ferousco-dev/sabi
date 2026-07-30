/**
 * Grouped navigation for the dashboard shell. Sections carry an optional
 * uppercase label; each entry is either a direct link or a COLLAPSIBLE GROUP
 * (a parent with an icon that expands to reveal its children in a nested
 * container). Groups keep the visible list short — the accordion pattern.
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3,
  MessageSquare, Store, Settings, GraduationCap, UserPlus, ArrowRight,
  BookText, ClipboardCheck, FileText, Megaphone,
  Bell, CalendarDays, ListOrdered, Sun, ScrollText,
  History, Shield, Calendar, CalendarCheck, UserCheck, Building2,
} from "lucide-react";
import type { Role } from "@/app/lib/auth";

export type NavLink = { label: string; href: string; icon: LucideIcon; badge?: number };
export type NavGroup = { label: string; icon: LucideIcon; children: NavLink[] };
export type NavEntry = NavLink | NavGroup;
export type NavSection = { title: string | null; items: NavEntry[] };

/** Type guard: a NavEntry that is a collapsible group. */
export function isGroup(entry: NavEntry): entry is NavGroup {
  return (entry as NavGroup).children !== undefined;
}

export const ROLE_LABEL: Record<Role, string> = {
  school_admin: "School administration",
  teacher: "Teaching workspace",
  student: "Student workspace",
  parent: "Guardian portal",
  creator: "Creator studio",
};

export const NAV_BY_ROLE: Record<Role, NavSection[]> = {
  school_admin: [
    { title: null, items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
    {
      title: "Manage",
      items: [
        {
          label: "People", icon: Users, children: [
            { label: "Students", href: "/admin/students", icon: Users },
            { label: "Add students", href: "/admin/student-registration", icon: UserPlus },
            { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
            { label: "Transfers", href: "/admin/transfers", icon: ArrowRight },
            { label: "Enrollments", href: "/admin/enrollments", icon: UserCheck },
            { label: "Users & Invites", href: "/admin/invitations", icon: Users },
          ],
        },
        {
          label: "Academics", icon: GraduationCap, children: [
            { label: "Classes", href: "/admin/classes", icon: GraduationCap },
            { label: "Subjects", href: "/admin/subjects", icon: BookText },
            { label: "Timetable", href: "/admin/timetable", icon: BookOpen },
            { label: "Assessments", href: "/admin/assessments", icon: ClipboardCheck },
            { label: "Results", href: "/admin/results", icon: FileText },
            { label: "Attendance", href: "/admin/attendance", icon: ClipboardList },
          ],
        },
      ],
    },
    {
      title: "Insights",
      items: [
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
        { label: "Notifications", href: "/admin/notifications", icon: Bell },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          label: "School", icon: Building2, children: [
            { label: "Profile", href: "/admin/profile", icon: Building2 },
            { label: "Campuses", href: "/admin/campuses", icon: Building2 },
            { label: "Sessions", href: "/admin/sessions", icon: CalendarDays },
            { label: "Terms", href: "/admin/terms", icon: ListOrdered },
            { label: "Holidays", href: "/admin/holidays", icon: Sun },
          ],
        },
        {
          label: "Security", icon: Shield, children: [
            { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
            { label: "Login History", href: "/admin/login-history", icon: History },
            { label: "Security", href: "/admin/security", icon: Shield },
          ],
        },
      ],
    },
  ],
  teacher: [
    { title: null, items: [{ label: "Dashboard", href: "/teacher", icon: LayoutDashboard }] },
    {
      title: "Teaching",
      items: [
        {
          label: "Classroom", icon: Users, children: [
            { label: "Roster", href: "/teacher/roster", icon: Users },
            { label: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
            { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
            { label: "Assessments", href: "/teacher/assessments", icon: ClipboardCheck },
            { label: "Grading", href: "/teacher/grading", icon: ClipboardCheck },
          ],
        },
        { label: "Lessons", href: "/teacher/lessons", icon: BookOpen },
        { label: "Resources", href: "/teacher/resources", icon: BookText },
        { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
        { label: "Reports", href: "/teacher/reports", icon: BarChart3 },
      ],
    },
  ],
  student: [
    { title: null, items: [{ label: "Dashboard", href: "/student", icon: LayoutDashboard }] },
    {
      title: "Learning",
      items: [
        {
          label: "Coursework", icon: BookOpen, children: [
            { label: "Timetable", href: "/student/timetable", icon: Calendar },
            { label: "Content", href: "/student/content", icon: BookOpen },
            { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
            { label: "Submissions", href: "/student/submissions", icon: FileText },
            { label: "Assessments", href: "/student/assessments", icon: ClipboardCheck },
          ],
        },
        { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
        { label: "Progress", href: "/student/progress", icon: GraduationCap },
        { label: "Messages", href: "/student/messages", icon: MessageSquare },
        { label: "Settings", href: "/student/settings", icon: Settings },
      ],
    },
  ],
  parent: [
    { title: null, items: [{ label: "Dashboard", href: "/parent", icon: LayoutDashboard }] },
    {
      title: "My children",
      items: [
        {
          label: "Children", icon: Users, children: [
            { label: "Children", href: "/parent/children", icon: Users },
            { label: "Grades", href: "/parent/results", icon: FileText },
            { label: "Assignments", href: "/parent/assignments", icon: ClipboardList },
            { label: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
          ],
        },
        { label: "Events", href: "/parent/events", icon: Calendar },
        { label: "Emergency", href: "/parent/emergency-contacts", icon: UserCheck },
        { label: "Alerts", href: "/parent/alerts", icon: MessageSquare },
        { label: "Notifications", href: "/parent/notifications", icon: Bell },
      ],
    },
  ],
  creator: [
    { title: null, items: [{ label: "Dashboard", href: "/creator", icon: LayoutDashboard }] },
    {
      title: "Studio",
      items: [
        { label: "Courses", href: "/creator/courses", icon: BookOpen },
        { label: "Revenue", href: "/creator/revenue", icon: BarChart3 },
        { label: "Marketplace", href: "/creator/marketplace", icon: Store },
      ],
    },
  ],
};
