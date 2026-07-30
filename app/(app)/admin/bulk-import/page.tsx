import { redirect } from "next/navigation";

// Bulk import now lives inside each registry: student CSV under
// /admin/student-registration, teacher CSV under /admin/teachers.
export default function BulkImportRedirect() {
  redirect("/admin/students");
}
