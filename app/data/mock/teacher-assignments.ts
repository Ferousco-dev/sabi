/**
 * Typed mock assignment list for the teacher assignments screen. Mirrors the
 * planned GET /teacher/assignments.php response (see docs/BACKEND.md).
 */

export type TeacherAssignmentStatus = "open" | "grading" | "returned";

export type TeacherAssignment = {
  id: string;
  title: string;
  className: string;
  subject: string;
  due: string;
  submitted: number;
  total: number;
  status: TeacherAssignmentStatus;
};

export const TEACHER_ASSIGNMENT_LIST: TeacherAssignment[] = [
  { id: "ta1", title: "Quadratic equations worksheet", className: "SSS 1B", subject: "Further Maths", due: "Due today", submitted: 28, total: 30, status: "grading" },
  { id: "ta2", title: "Fractions quiz", className: "JSS 2A", subject: "Mathematics", due: "Due tomorrow", submitted: 31, total: 34, status: "open" },
  { id: "ta3", title: "Geometry assignment 4", className: "JSS 3C", subject: "Mathematics", due: "In 2 days", submitted: 25, total: 29, status: "open" },
  { id: "ta4", title: "Algebra problem set", className: "JSS 2A", subject: "Mathematics", due: "Closed", submitted: 34, total: 34, status: "returned" },
  { id: "ta5", title: "Statistics project", className: "SSS 1B", subject: "Further Maths", due: "Closed", submitted: 29, total: 30, status: "returned" },
];
