/**
 * Navigation model for the role dashboards.
 *
 * One shared shell renders any of these configs, so a role's whole information
 * architecture lives here as data (not markup). Each role gets a base path and
 * grouped sections; the shell resolves the active item from the URL.
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Megaphone,
  BarChart3,
  Settings,
  BookOpen,
  NotebookPen,
  FolderOpen,
  MessageSquare,
  UserRound,
  CalendarDays,
  FileText,
  Baby,
} from "lucide-react";
import type { Role } from "./auth";

export type NavItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
  /** Optional count shown as a badge (e.g. pending items). */
  badge?: number;
};

export type NavSection = {
  /** Section heading, or null for the top ungrouped block. */
  title: string | null;
  items: NavItem[];
};

export type DashboardConfig = {
  role: Role;
  /** URL prefix, e.g. "/admin". Every item href starts with it. */
  basePath: string;
  /** Label shown under the workspace name in the sidebar. */
  roleLabel: string;
  sections: NavSection[];
};

const ADMIN_BASE = "/admin";
export const ADMIN_CONFIG: DashboardConfig = {
  role: "school_admin",
  basePath: ADMIN_BASE,
  roleLabel: "School administration",
  sections: [
    {
      title: null,
      items: [{ label: "Overview", href: ADMIN_BASE, Icon: LayoutDashboard }],
    },
    {
      title: "People",
      items: [
        { label: "Students", href: `${ADMIN_BASE}/students`, Icon: Users },
        { label: "Teachers", href: `${ADMIN_BASE}/teachers`, Icon: GraduationCap },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Classes", href: `${ADMIN_BASE}/classes`, Icon: BookOpen },
        { label: "Attendance", href: `${ADMIN_BASE}/attendance`, Icon: CalendarCheck },
        { label: "Results", href: `${ADMIN_BASE}/results`, Icon: ClipboardList, badge: 12 },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Announcements", href: `${ADMIN_BASE}/announcements`, Icon: Megaphone },
        { label: "Reports", href: `${ADMIN_BASE}/reports`, Icon: BarChart3 },
        { label: "Settings", href: `${ADMIN_BASE}/settings`, Icon: Settings },
      ],
    },
  ],
};

const TEACHER_BASE = "/teacher";
export const TEACHER_CONFIG: DashboardConfig = {
  role: "teacher",
  basePath: TEACHER_BASE,
  roleLabel: "Teaching workspace",
  sections: [
    {
      title: null,
      items: [{ label: "Overview", href: TEACHER_BASE, Icon: LayoutDashboard }],
    },
    {
      title: "Classroom",
      items: [
        { label: "Classes", href: `${TEACHER_BASE}/classes`, Icon: Users },
        { label: "Attendance", href: `${TEACHER_BASE}/attendance`, Icon: CalendarCheck },
        { label: "Assignments", href: `${TEACHER_BASE}/assignments`, Icon: NotebookPen },
        { label: "Results", href: `${TEACHER_BASE}/results`, Icon: ClipboardList, badge: 3 },
      ],
    },
    {
      title: "Teaching",
      items: [
        { label: "Resources", href: `${TEACHER_BASE}/resources`, Icon: FolderOpen },
        { label: "Messages", href: `${TEACHER_BASE}/messages`, Icon: MessageSquare },
        { label: "Reports", href: `${TEACHER_BASE}/reports`, Icon: BarChart3 },
      ],
    },
  ],
};

const PARENT_BASE = "/parent";
export const PARENT_CONFIG: DashboardConfig = {
  role: "parent",
  basePath: PARENT_BASE,
  roleLabel: "Guardian portal",
  sections: [
    {
      title: null,
      items: [{ label: "Overview", href: PARENT_BASE, Icon: LayoutDashboard }],
    },
    {
      title: "My children",
      items: [
        { label: "Children", href: `${PARENT_BASE}/children`, Icon: Baby },
        { label: "Attendance", href: `${PARENT_BASE}/attendance`, Icon: CalendarCheck },
        { label: "Results", href: `${PARENT_BASE}/results`, Icon: ClipboardList },
        { label: "Assignments", href: `${PARENT_BASE}/assignments`, Icon: NotebookPen },
      ],
    },
    {
      title: "School",
      items: [
        { label: "Announcements", href: `${PARENT_BASE}/announcements`, Icon: Megaphone },
        { label: "Events", href: `${PARENT_BASE}/events`, Icon: CalendarDays },
        { label: "Messages", href: `${PARENT_BASE}/messages`, Icon: MessageSquare },
        { label: "Settings", href: `${PARENT_BASE}/settings`, Icon: Settings },
      ],
    },
  ],
};

const STUDENT_BASE = "/student";
export const STUDENT_CONFIG: DashboardConfig = {
  role: "student",
  basePath: STUDENT_BASE,
  roleLabel: "Student workspace",
  sections: [
    {
      title: null,
      items: [{ label: "Overview", href: STUDENT_BASE, Icon: LayoutDashboard }],
    },
    {
      title: "Learning",
      items: [
        { label: "Timetable", href: `${STUDENT_BASE}/timetable`, Icon: CalendarDays },
        { label: "Assignments", href: `${STUDENT_BASE}/assignments`, Icon: NotebookPen, badge: 2 },
        { label: "Resources", href: `${STUDENT_BASE}/resources`, Icon: FolderOpen },
        { label: "Results", href: `${STUDENT_BASE}/results`, Icon: FileText },
      ],
    },
    {
      title: "School",
      items: [
        { label: "Attendance", href: `${STUDENT_BASE}/attendance`, Icon: CalendarCheck },
        { label: "Messages", href: `${STUDENT_BASE}/messages`, Icon: MessageSquare },
        { label: "Profile", href: `${STUDENT_BASE}/profile`, Icon: UserRound },
      ],
    },
  ],
};

export const CONFIG_BY_ROLE: Record<Role, DashboardConfig | null> = {
  school_admin: ADMIN_CONFIG,
  teacher: TEACHER_CONFIG,
  parent: PARENT_CONFIG,
  student: STUDENT_CONFIG,
  creator: null,
};
