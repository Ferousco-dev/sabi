/**
 * Typed mock data for the Parent/Guardian dashboard. One guardian can have
 * several linked children; the overview switches between them. Shapes mirror the
 * planned API in docs/BACKEND.md.
 */

export const PARENT_USER = { name: "Chidinma Okafor", roleLabel: "Parent" } as const;

export type SubjectScore = { subject: string; score: number; grade: string };

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: "not-started" | "submitted" | "graded";
};

export type AttendanceMark = { day: string; status: "present" | "absent" | "late" | "excused" };

export type Announcement = { id: string; title: string; from: string; when: string; unread: boolean };

export type Child = {
  id: string;
  name: string;
  className: string;
  school: string;
  attendanceRate: number;
  average: number;
  unreadAlerts: number;
  recentResults: SubjectScore[];
  upcoming: Assignment[];
  week: AttendanceMark[];
  announcements: Announcement[];
};

export const CHILDREN: Child[] = [
  {
    id: "c1",
    name: "Adaeze Okafor",
    className: "JSS 2A",
    school: "Greenfield Model College",
    attendanceRate: 96,
    average: 74,
    unreadAlerts: 2,
    recentResults: [
      { subject: "Mathematics", score: 78, grade: "B2" },
      { subject: "English", score: 71, grade: "B3" },
      { subject: "Basic Science", score: 82, grade: "A1" },
      { subject: "Social Studies", score: 66, grade: "C4" },
    ],
    upcoming: [
      { id: "a1", title: "Fractions quiz", subject: "Mathematics", due: "Due tomorrow", status: "not-started" },
      { id: "a2", title: "Comprehension essay", subject: "English", due: "In 3 days", status: "submitted" },
      { id: "a3", title: "Ecosystem poster", subject: "Basic Science", due: "In 5 days", status: "not-started" },
    ],
    week: [
      { day: "Mon", status: "present" },
      { day: "Tue", status: "present" },
      { day: "Wed", status: "late" },
      { day: "Thu", status: "present" },
      { day: "Fri", status: "present" },
    ],
    announcements: [
      { id: "n1", title: "Parent-teacher meeting on Saturday", from: "Greenfield Model College", when: "2h ago", unread: true },
      { id: "n2", title: "Adaeze arrived late on Wednesday", from: "Attendance office", when: "Yesterday", unread: true },
      { id: "n3", title: "Second term fees reminder", from: "Bursary", when: "3 days ago", unread: false },
    ],
  },
  {
    id: "c2",
    name: "Emeka Okafor",
    className: "SSS 1B",
    school: "Greenfield Model College",
    attendanceRate: 91,
    average: 68,
    unreadAlerts: 0,
    recentResults: [
      { subject: "Mathematics", score: 64, grade: "C4" },
      { subject: "Physics", score: 70, grade: "B3" },
      { subject: "Chemistry", score: 73, grade: "B2" },
      { subject: "English", score: 66, grade: "C4" },
    ],
    upcoming: [
      { id: "b1", title: "Kinematics problem set", subject: "Physics", due: "Due today", status: "not-started" },
      { id: "b2", title: "Titration lab report", subject: "Chemistry", due: "In 2 days", status: "graded" },
    ],
    week: [
      { day: "Mon", status: "present" },
      { day: "Tue", status: "absent" },
      { day: "Wed", status: "present" },
      { day: "Thu", status: "present" },
      { day: "Fri", status: "present" },
    ],
    announcements: [
      { id: "m1", title: "Physics practical rescheduled to Thursday", from: "Science department", when: "5h ago", unread: false },
      { id: "m2", title: "Second term fees reminder", from: "Bursary", when: "3 days ago", unread: false },
    ],
  },
];
