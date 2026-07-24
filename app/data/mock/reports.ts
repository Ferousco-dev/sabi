/**
 * Typed mock analytics for the School Admin reports screen. Mirrors the planned
 * GET /admin/reports.php aggregations (see docs/BACKEND.md).
 */

import type { LucideIcon } from "lucide-react";
import { Users, CalendarCheck, TrendingUp, Award } from "lucide-react";

export type ReportStat = { key: string; label: string; value: number; suffix?: string; Icon: LucideIcon };

export const REPORT_STATS: ReportStat[] = [
  { key: "enrolled", label: "Total enrolled", value: 1284, Icon: Users },
  { key: "attendance", label: "Avg attendance", value: 94, suffix: "%", Icon: CalendarCheck },
  { key: "performance", label: "Avg performance", value: 71, suffix: "%", Icon: TrendingUp },
  { key: "pass", label: "Pass rate", value: 88, suffix: "%", Icon: Award },
];

export type Bar = { label: string; value: number; max: number };

export const ENROLMENT_BY_CLASS: Bar[] = [
  { label: "JSS1", value: 268, max: 300 },
  { label: "JSS2", value: 254, max: 300 },
  { label: "JSS3", value: 241, max: 300 },
  { label: "SSS1", value: 189, max: 300 },
  { label: "SSS2", value: 176, max: 300 },
  { label: "SSS3", value: 156, max: 300 },
];

export const ATTENDANCE_BY_WEEK: Bar[] = [
  { label: "W1", value: 92, max: 100 },
  { label: "W2", value: 94, max: 100 },
  { label: "W3", value: 91, max: 100 },
  { label: "W4", value: 95, max: 100 },
  { label: "W5", value: 94, max: 100 },
  { label: "W6", value: 96, max: 100 },
];

export const SCORE_BY_SUBJECT: Bar[] = [
  { label: "Math", value: 68, max: 100 },
  { label: "Eng", value: 72, max: 100 },
  { label: "Sci", value: 75, max: 100 },
  { label: "Soc", value: 66, max: 100 },
  { label: "Bio", value: 70, max: 100 },
];

export type ReportDoc = { id: string; name: string; description: string };

export const AVAILABLE_REPORTS: ReportDoc[] = [
  { id: "d1", name: "Enrolment report", description: "Students by class, department, and gender" },
  { id: "d2", name: "Attendance report", description: "Daily and monthly attendance by class" },
  { id: "d3", name: "Performance report", description: "Scores and grades by subject and class" },
  { id: "d4", name: "Teacher workload report", description: "Classes, subjects, and student load per teacher" },
  { id: "d5", name: "User activity report", description: "Logins and account activity" },
];
