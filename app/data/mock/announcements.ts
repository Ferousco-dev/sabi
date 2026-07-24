/**
 * Typed mock announcements for the School Admin announcements screen. Mirrors
 * the planned GET/POST /admin/announcements.php (see docs/BACKEND.md).
 */

export type Audience = "school" | "teachers" | "parents" | "students";

export type AnnouncementRecord = {
  id: string;
  title: string;
  audience: Audience;
  sent: string;
  recipients: number;
  readPct: number;
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  school: "Whole school",
  teachers: "All teachers",
  parents: "All parents",
  students: "All students",
};

export const SENT_ANNOUNCEMENTS: AnnouncementRecord[] = [
  { id: "an1", title: "Second term resumes Monday 6 January", audience: "school", sent: "2 days ago", recipients: 1456, readPct: 82 },
  { id: "an2", title: "Mid-term results due Friday 4pm", audience: "teachers", sent: "3 days ago", recipients: 86, readPct: 94 },
  { id: "an3", title: "Parent-teacher meeting on Saturday", audience: "parents", sent: "5 days ago", recipients: 980, readPct: 67 },
  { id: "an4", title: "Inter-house sports registration open", audience: "students", sent: "1 week ago", recipients: 1284, readPct: 71 },
];
