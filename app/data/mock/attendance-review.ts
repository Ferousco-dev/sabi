/**
 * Typed mock data for the School Admin attendance review screen: today's
 * per-class attendance and pending correction requests. Mirrors the planned
 * GET /admin/attendance.php aggregations and correction actions.
 */

export type ClassAttendance = {
  id: string;
  className: string;
  teacher: string;
  present: number;
  total: number;
  submitted: boolean;
};

export const CLASS_ATTENDANCE: ClassAttendance[] = [
  { id: "ca1", className: "JSS 1A", teacher: "Fatima Bello", present: 31, total: 33, submitted: true },
  { id: "ca2", className: "JSS 2A", teacher: "Tunde Bello", present: 32, total: 34, submitted: true },
  { id: "ca3", className: "JSS 3C", teacher: "Ibrahim Musa", present: 27, total: 29, submitted: true },
  { id: "ca4", className: "SSS 1B", teacher: "Ngozi Eze", present: 0, total: 30, submitted: false },
  { id: "ca5", className: "SSS 2A", teacher: "Grace Adeyemi", present: 29, total: 31, submitted: true },
];

export type CorrectionRequest = {
  id: string;
  student: string;
  className: string;
  change: string;
  reason: string;
  by: string;
  when: string;
};

export const CORRECTION_REQUESTS: CorrectionRequest[] = [
  { id: "cr1", student: "Tobenna Nwosu", className: "JSS 2A", change: "Absent to Excused", reason: "Medical appointment, note attached", by: "Tunde Bello", when: "1h ago" },
  { id: "cr2", student: "Blessing Obi", className: "JSS 3C", change: "Late to Present", reason: "Bus delay confirmed", by: "Ibrahim Musa", when: "3h ago" },
  { id: "cr3", student: "David Adeyemi", className: "SSS 1B", change: "Absent to Present", reason: "Marked in error", by: "Ngozi Eze", when: "Yesterday" },
];
