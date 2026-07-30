/**
 * Grouped navigation for the dashboard shell. Same routes the app already has,
 * organised into labelled sections so the sidebar is scannable instead of one
 * long flat list. Keyed by role.
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3,
  MessageSquare, Store, Settings, GraduationCap, UserPlus, ArrowRight,
  Columns3, BookText, Building, Clock, ClipboardCheck, FileText, Megaphone,
  Bell, Building2, CalendarDays, ListOrdered, Sun, ScrollText,
  History, Shield, Calendar, CalendarCheck, UserCheck,
} from "lucide-react";
import type { Role } from "@/app/lib/auth";

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type NavSection = { title: string | null; items: NavItem[] };

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
      title: "People",
      items: [
        { label: "Students", href: "/admin/students", icon: Users },
        { label: "Add students", href: "/admin/student-registration", icon: UserPlus },
        { label: "Transfers", href: "/admin/transfers", icon: ArrowRight },
        { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
        { label: "Enrollments", href: "/admin/enrollments", icon: UserCheck },
        { label: "Users & Invites", href: "/admin/invitations", icon: Users },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Classes", href: "/admin/classes", icon: GraduationCap },
        { label: "Sections", href: "/admin/sections", icon: Columns3 },
        { label: "Subjects", href: "/admin/subjects", icon: BookText },
        { label: "Departments", href: "/admin/departments", icon: Building },
        { label: "Timetable", href: "/admin/timetable", icon: BookOpen },
        { label: "Assessments", href: "/admin/assessments", icon: ClipboardCheck },
        { label: "Results", href: "/admin/results", icon: FileText },
      ],
    },
    {
      title: "Attendance",
      items: [
        { label: "Attendance", href: "/admin/attendance", icon: ClipboardList },
        { label: "Corrections", href: "/admin/attendance-corrections", icon: Clock },
      ],
    },
    {
      title: "Insights",
      items: [
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Reports", href: "/admin/reports", icon: BarChart3 },
        { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
        { label: "Notifications", href: "/admin/notifications", icon: Bell },
      ],
    },
    {
      title: "School",
      items: [
        { label: "Profile", href: "/admin/profile", icon: Building2 },
        { label: "Campuses", href: "/admin/campuses", icon: Building2 },
        { label: "Sessions", href: "/admin/sessions", icon: CalendarDays },
        { label: "Terms", href: "/admin/terms", icon: ListOrdered },
        { label: "Holidays", href: "/admin/holidays", icon: Sun },
      ],
    },
    {
      title: "Security",
      items: [
        { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
        { label: "Login History", href: "/admin/login-history", icon: History },
        { label: "Security", href: "/admin/security", icon: Shield },
      ],
    },
  ],
  teacher: [
    { title: null, items: [{ label: "Dashboard", href: "/teacher", icon: LayoutDashboard }] },
    {
      title: "Classroom",
      items: [
        { label: "Roster", href: "/teacher/roster", icon: Users },
        { label: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
        { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
        { label: "Assessments", href: "/teacher/assessments", icon: ClipboardCheck },
        { label: "Grading", href: "/teacher/grading", icon: ClipboardCheck },
      ],
    },
    {
      title: "Teaching",
      items: [
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
        { label: "Timetable", href: "/student/timetable", icon: Calendar },
        { label: "Content", href: "/student/content", icon: BookOpen },
        { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
        { label: "Submissions", href: "/student/submissions", icon: FileText },
        { label: "Assessments", href: "/student/assessments", icon: ClipboardCheck },
      ],
    },
    {
      title: "School",
      items: [
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
        { label: "Children", href: "/parent/children", icon: Users },
        { label: "Grades", href: "/parent/results", icon: FileText },
        { label: "Assignments", href: "/parent/assignments", icon: ClipboardList },
        { label: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
      ],
    },
    {
      title: "School",
      items: [
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
