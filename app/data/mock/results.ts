/**
 * Typed mock result submissions for the School Admin results review screen.
 * Mirrors the planned GET /admin/results.php list and the approve/reject/publish
 * actions (see docs/BACKEND.md).
 */

export type ResultStatus = "pending" | "approved" | "rejected" | "published";

export type ResultSubmission = {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  students: number;
  average: number;
  submitted: string;
  status: ResultStatus;
};

export const RESULT_SUBMISSIONS: ResultSubmission[] = [
  { id: "rs1", className: "JSS 2A", subject: "Mathematics", teacher: "Tunde Bello", students: 34, average: 72, submitted: "2h ago", status: "pending" },
  { id: "rs2", className: "SSS 1B", subject: "Biology", teacher: "Ngozi Eze", students: 30, average: 68, submitted: "4h ago", status: "pending" },
  { id: "rs3", className: "JSS 3C", subject: "English", teacher: "Ibrahim Musa", students: 29, average: 65, submitted: "Yesterday", status: "pending" },
  { id: "rs4", className: "SSS 2A", subject: "Chemistry", teacher: "Grace Adeyemi", students: 31, average: 70, submitted: "Yesterday", status: "pending" },
  { id: "rs5", className: "JSS 1A", subject: "Basic Science", teacher: "Peter Obi", students: 33, average: 74, submitted: "2 days ago", status: "approved" },
  { id: "rs6", className: "SSS 2A", subject: "Physics", teacher: "Amaka Ude", students: 28, average: 61, submitted: "2 days ago", status: "rejected" },
  { id: "rs7", className: "JSS 2A", subject: "English", teacher: "Ibrahim Musa", students: 34, average: 69, submitted: "3 days ago", status: "published" },
  { id: "rs8", className: "SSS 1B", subject: "Chemistry", teacher: "Grace Adeyemi", students: 30, average: 73, submitted: "3 days ago", status: "published" },
];
