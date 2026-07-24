/**
 * Typed mock assignment list for the student assignments screen. Mirrors the
 * planned GET /student/assignments.php response (see docs/BACKEND.md).
 */

export type AssignmentStatus = "not-started" | "in-progress" | "submitted" | "graded";

export type StudentAssignment = {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: AssignmentStatus;
  /** Set only when status is "graded". */
  score?: number;
  grade?: string;
};

export const STUDENT_ASSIGNMENT_LIST: StudentAssignment[] = [
  { id: "sa1", title: "Fractions quiz", subject: "Mathematics", due: "Due tomorrow", status: "not-started" },
  { id: "sa2", title: "Comprehension essay", subject: "English", due: "In 3 days", status: "in-progress" },
  { id: "sa3", title: "Ecosystem poster", subject: "Basic Science", due: "In 5 days", status: "not-started" },
  { id: "sa4", title: "Map of Nigeria worksheet", subject: "Social Studies", due: "Submitted", status: "submitted" },
  { id: "sa5", title: "Algebra problem set", subject: "Mathematics", due: "Graded", status: "graded", score: 88, grade: "A1" },
  { id: "sa6", title: "Poetry analysis", subject: "English", due: "Graded", status: "graded", score: 74, grade: "B2" },
  { id: "sa7", title: "Photosynthesis lab", subject: "Basic Science", due: "Graded", status: "graded", score: 69, grade: "B3" },
];
