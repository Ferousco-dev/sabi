/**
 * Typed mock teacher roster for the School Admin teachers screen. Mirrors the
 * planned GET /admin/teachers.php list response (see docs/BACKEND.md).
 */

export type TeacherStatus = "active" | "invited" | "inactive";

export type TeacherRow = {
  id: string;
  staffId: string;
  name: string;
  subjects: string[];
  classes: number;
  students: number;
  status: TeacherStatus;
};

export const SUBJECTS = [
  "Mathematics",
  "English",
  "Biology",
  "Chemistry",
  "Physics",
  "Further Maths",
  "Basic Science",
  "Social Studies",
] as const;

export const TEACHERS: TeacherRow[] = [
  { id: "t1", staffId: "STF/041", name: "Tunde Bello", subjects: ["Mathematics", "Further Maths"], classes: 6, students: 214, status: "active" },
  { id: "t2", staffId: "STF/042", name: "Ngozi Eze", subjects: ["Biology", "Basic Science"], classes: 5, students: 178, status: "active" },
  { id: "t3", staffId: "STF/043", name: "Ibrahim Musa", subjects: ["English"], classes: 4, students: 142, status: "active" },
  { id: "t4", staffId: "STF/044", name: "Grace Adeyemi", subjects: ["Chemistry"], classes: 5, students: 156, status: "active" },
  { id: "t5", staffId: "STF/045", name: "Peter Obi", subjects: ["Social Studies", "Basic Science"], classes: 6, students: 201, status: "active" },
  { id: "t6", staffId: "STF/046", name: "Amaka Ude", subjects: ["Physics"], classes: 4, students: 128, status: "invited" },
  { id: "t7", staffId: "STF/047", name: "Suleiman Bala", subjects: ["Mathematics"], classes: 0, students: 0, status: "invited" },
  { id: "t8", staffId: "STF/048", name: "Bisi Kolawole", subjects: ["English", "Social Studies"], classes: 3, students: 98, status: "inactive" },
];
