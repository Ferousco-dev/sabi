/**
 * Typed mock data for the Student dashboard. Shapes mirror the planned API in
 * docs/BACKEND.md; swap for fetches when the endpoints land.
 */

import type { LucideIcon } from "lucide-react";
import { BookOpen, NotebookPen, CalendarCheck, TrendingUp } from "lucide-react";

export const STUDENT_USER = { name: "Adaeze Okafor", roleLabel: "JSS 2A student" } as const;

export const STUDENT_CONTEXT = { className: "JSS 2A", term: "Second term", today: "Wednesday" } as const;

export type OverviewStat = { key: string; label: string; value: number; suffix?: string; Icon: LucideIcon };

export const STUDENT_STATS: OverviewStat[] = [
  { key: "today", label: "Classes today", value: 6, Icon: BookOpen },
  { key: "due", label: "Assignments due", value: 2, Icon: NotebookPen },
  { key: "attendance", label: "My attendance", value: 94, suffix: "%", Icon: CalendarCheck },
  { key: "average", label: "Term average", value: 76, suffix: "%", Icon: TrendingUp },
];

export type Period = {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  status: "done" | "now" | "upcoming";
};

export const STUDENT_SCHEDULE: Period[] = [
  { id: "p1", time: "08:00", subject: "Mathematics", teacher: "Mr Bello", room: "Rm 4", status: "done" },
  { id: "p2", time: "09:40", subject: "English", teacher: "Mrs Musa", room: "Rm 4", status: "done" },
  { id: "p3", time: "11:20", subject: "Basic Science", teacher: "Ms Eze", room: "Lab 1", status: "now" },
  { id: "p4", time: "13:00", subject: "Social Studies", teacher: "Mr Obi", room: "Rm 2", status: "upcoming" },
  { id: "p5", time: "14:40", subject: "Computer Studies", teacher: "Mrs Ade", room: "ICT Lab", status: "upcoming" },
];

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: "not-started" | "in-progress" | "submitted";
};

export const STUDENT_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Fractions quiz", subject: "Mathematics", due: "Due tomorrow", status: "not-started" },
  { id: "a2", title: "Comprehension essay", subject: "English", due: "In 3 days", status: "in-progress" },
  { id: "a3", title: "Ecosystem poster", subject: "Basic Science", due: "In 5 days", status: "not-started" },
];

export type SubjectScore = { subject: string; score: number; grade: string };

export const STUDENT_GRADES: SubjectScore[] = [
  { subject: "Mathematics", score: 78, grade: "B2" },
  { subject: "English", score: 71, grade: "B3" },
  { subject: "Basic Science", score: 82, grade: "A1" },
  { subject: "Social Studies", score: 66, grade: "C4" },
];

export type Announcement = { id: string; title: string; from: string; when: string };

export const STUDENT_ANNOUNCEMENTS: Announcement[] = [
  { id: "n1", title: "Mid-term test starts Monday", from: "Class teacher", when: "3h ago" },
  { id: "n2", title: "Library open late on Fridays", from: "School library", when: "Yesterday" },
  { id: "n3", title: "New Basic Science notes uploaded", from: "Ms Eze", when: "2 days ago" },
];
