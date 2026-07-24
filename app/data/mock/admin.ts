/**
 * Typed mock data for the School Administrator dashboard.
 *
 * This stands in for the PHP API responses (see docs/BACKEND.md) so the UI can
 * be built and reviewed before the endpoints exist. Shapes here mirror the
 * planned JSON contract; when the API lands, swap these fixtures for fetches
 * without touching the components.
 */

import type { LucideIcon } from "lucide-react";
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  UserPlus,
  FileCheck2,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import type { Delta } from "../../components/dashboard/StatCard";
import type { BadgeTone } from "../../components/dashboard/Badge";

export type OverviewStat = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  decimals?: boolean;
  Icon: LucideIcon;
  delta: Delta;
  trend: number[];
};

export const SCHOOL = {
  name: "Greenfield Model College",
  session: "2025/2026",
  term: "Second term",
} as const;

export const ADMIN_USER = { name: "Amara Okeke", roleLabel: "School administrator" } as const;

export const OVERVIEW_STATS: OverviewStat[] = [
  {
    key: "students",
    label: "Total students",
    value: 1284,
    Icon: Users,
    delta: { value: 3.2, label: "vs last term" },
    trend: [1180, 1195, 1210, 1230, 1240, 1265, 1284],
  },
  {
    key: "teachers",
    label: "Teaching staff",
    value: 86,
    Icon: GraduationCap,
    delta: { value: 2.4, label: "vs last term" },
    trend: [78, 80, 81, 82, 84, 85, 86],
  },
  {
    key: "classes",
    label: "Active classes",
    value: 42,
    Icon: BookOpen,
    delta: { value: 0, label: "no change" },
    trend: [42, 42, 41, 42, 42, 42, 42],
  },
  {
    key: "attendance",
    label: "Attendance today",
    value: 94.6,
    suffix: "%",
    decimals: true,
    Icon: CalendarCheck,
    delta: { value: 1.1, label: "vs yesterday" },
    trend: [92.1, 93.4, 91.8, 94.0, 93.2, 94.1, 94.6],
  },
];

export type AttendanceDay = { day: string; present: number; total: number };

export const WEEK_ATTENDANCE: AttendanceDay[] = [
  { day: "Mon", present: 1201, total: 1284 },
  { day: "Tue", present: 1189, total: 1284 },
  { day: "Wed", present: 1222, total: 1284 },
  { day: "Thu", present: 1176, total: 1284 },
  { day: "Fri", present: 1214, total: 1284 },
];

export type ResultReview = {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  submitted: string;
  status: "pending" | "flagged";
};

export const PENDING_RESULTS: ResultReview[] = [
  { id: "r1", className: "JSS 2A", subject: "Mathematics", teacher: "Tunde Bello", submitted: "2h ago", status: "pending" },
  { id: "r2", className: "SSS 1B", subject: "Biology", teacher: "Ngozi Eze", submitted: "4h ago", status: "flagged" },
  { id: "r3", className: "JSS 3C", subject: "English", teacher: "Ibrahim Musa", submitted: "Yesterday", status: "pending" },
  { id: "r4", className: "SSS 2A", subject: "Chemistry", teacher: "Grace Adeyemi", submitted: "Yesterday", status: "pending" },
  { id: "r5", className: "JSS 1A", subject: "Basic Science", teacher: "Peter Obi", submitted: "2 days ago", status: "pending" },
];

export type TaskItem = {
  id: string;
  label: string;
  meta: string;
  Icon: LucideIcon;
  tone: BadgeTone;
  tag: string;
};

export const OUTSTANDING_TASKS: TaskItem[] = [
  { id: "t1", label: "Approve 12 result submissions", meta: "Results review", Icon: FileCheck2, tone: "warning", tag: "Due today" },
  { id: "t2", label: "Review 3 attendance corrections", meta: "JSS 2A, SSS 1B", Icon: CalendarCheck, tone: "teal", tag: "New" },
  { id: "t3", label: "Approve 8 new student enrolments", meta: "Admissions", Icon: UserPlus, tone: "teal", tag: "New" },
  { id: "t4", label: "Publish mid-term announcement", meta: "Draft ready", Icon: Megaphone, tone: "neutral", tag: "Draft" },
  { id: "t5", label: "Resolve duplicate guardian records", meta: "2 conflicts found", Icon: AlertTriangle, tone: "danger", tag: "Action" },
];

export type ActivityItem = { id: string; who: string; action: string; when: string };

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", who: "Ngozi Eze", action: "submitted SSS 1B Biology results", when: "10 min ago" },
  { id: "a2", who: "Admissions", action: "enrolled 4 new students into JSS 1", when: "1h ago" },
  { id: "a3", who: "Tunde Bello", action: "recorded attendance for JSS 2A", when: "2h ago" },
  { id: "a4", who: "You", action: "published the second term calendar", when: "Yesterday" },
  { id: "a5", who: "Grace Adeyemi", action: "requested an attendance correction", when: "Yesterday" },
];
