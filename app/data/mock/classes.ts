/**
 * Typed mock class list for the School Admin classes screen. Mirrors the planned
 * GET /admin/classes.php list response (see docs/BACKEND.md).
 */

export type ClassRow = {
  id: string;
  name: string;
  department: string;
  formTeacher: string;
  students: number;
  capacity: number;
  subjects: number;
};

export const DEPARTMENTS = ["Junior", "Science", "Arts", "Commercial"] as const;

export const CLASS_ROWS: ClassRow[] = [
  { id: "cl1", name: "JSS 1A", department: "Junior", formTeacher: "Fatima Bello", students: 33, capacity: 40, subjects: 11 },
  { id: "cl2", name: "JSS 2A", department: "Junior", formTeacher: "Tunde Bello", students: 34, capacity: 40, subjects: 11 },
  { id: "cl3", name: "JSS 3C", department: "Junior", formTeacher: "Ibrahim Musa", students: 29, capacity: 40, subjects: 12 },
  { id: "cl4", name: "SSS 1B", department: "Science", formTeacher: "Ngozi Eze", students: 30, capacity: 35, subjects: 9 },
  { id: "cl5", name: "SSS 2A", department: "Science", formTeacher: "Grace Adeyemi", students: 31, capacity: 35, subjects: 9 },
  { id: "cl6", name: "SSS 2B", department: "Arts", formTeacher: "Peter Obi", students: 27, capacity: 35, subjects: 8 },
  { id: "cl7", name: "SSS 3A", department: "Commercial", formTeacher: "Bisi Kolawole", students: 25, capacity: 35, subjects: 8 },
];
