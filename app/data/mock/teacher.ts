/**
 * Typed mock data for the Teacher dashboard (see docs/BACKEND.md for the API
 * contract these shapes mirror). Swap for fetches when the endpoints land.
 */

import type { LucideIcon } from "lucide-react";
import { Users, GraduationCap, NotebookPen, CalendarCheck } from "lucide-react";
import type { Delta } from "../../components/dashboard/StatCard";

export const TEACHER_USER = { name: "Tunde Bello", roleLabel: "Mathematics teacher" } as const;

export const TEACHER_CONTEXT = { session: "2025/2026", term: "Second term", today: "Wednesday" } as const;

export type OverviewStat = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  Icon: LucideIcon;
  delta?: Delta;
  trend?: number[];
};

export const TEACHER_STATS: OverviewStat[] = [
  { key: "classes", label: "My classes", value: 6, Icon: GraduationCap },
  { key: "students", label: "Students taught", value: 214, Icon: Users, trend: [198, 202, 205, 208, 210, 212, 214] },
  { key: "grading", label: "Awaiting grading", value: 18, Icon: NotebookPen, delta: { value: -22, label: "vs last week" } },
  { key: "attendance", label: "Attendance to record", value: 2, Icon: CalendarCheck },
];

export type Period = {
  id: string;
  time: string;
  className: string;
  subject: string;
  room: string;
  status: "done" | "now" | "upcoming";
};

export const TODAY_SCHEDULE: Period[] = [
  { id: "p1", time: "08:00", className: "JSS 2A", subject: "Mathematics", room: "Block B, Rm 4", status: "done" },
  { id: "p2", time: "09:40", className: "SSS 1B", subject: "Further Maths", room: "Block B, Rm 4", status: "done" },
  { id: "p3", time: "11:20", className: "JSS 3C", subject: "Mathematics", room: "Block A, Rm 2", status: "now" },
  { id: "p4", time: "13:00", className: "SSS 2A", subject: "Mathematics", room: "Block B, Rm 4", status: "upcoming" },
  { id: "p5", time: "14:40", className: "JSS 1A", subject: "Mathematics", room: "Block A, Rm 1", status: "upcoming" },
];

export type GradingItem = {
  id: string;
  title: string;
  className: string;
  submitted: number;
  total: number;
  due: string;
  late: number;
};

export const NEEDS_GRADING: GradingItem[] = [
  { id: "g1", title: "Quadratic equations worksheet", className: "SSS 1B", submitted: 28, total: 30, due: "Due today", late: 2 },
  { id: "g2", title: "Fractions quiz", className: "JSS 2A", submitted: 31, total: 34, due: "Due tomorrow", late: 0 },
  { id: "g3", title: "Geometry assignment 4", className: "JSS 3C", submitted: 25, total: 29, due: "2 days left", late: 1 },
];

export type ClassSummary = {
  id: string;
  name: string;
  subject: string;
  students: number;
  averageScore: number;
  attendance: number;
};

export const MY_CLASSES: ClassSummary[] = [
  { id: "c1", name: "JSS 2A", subject: "Mathematics", students: 34, averageScore: 72, attendance: 95 },
  { id: "c2", name: "JSS 3C", subject: "Mathematics", students: 29, averageScore: 68, attendance: 92 },
  { id: "c3", name: "SSS 1B", subject: "Further Maths", students: 30, averageScore: 75, attendance: 97 },
  { id: "c4", name: "SSS 2A", subject: "Mathematics", students: 31, averageScore: 70, attendance: 90 },
];

export type Announcement = { id: string; title: string; from: string; when: string };

export const TEACHER_ANNOUNCEMENTS: Announcement[] = [
  { id: "n1", title: "Mid-term results due Friday 4pm", from: "School administration", when: "1h ago" },
  { id: "n2", title: "Staff meeting moved to 3:30pm", from: "Principal's office", when: "Yesterday" },
  { id: "n3", title: "New WAEC syllabus uploaded to resources", from: "Academics", when: "2 days ago" },
];
