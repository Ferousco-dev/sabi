/**
 * Typed mock student roster for the School Admin students screen. Mirrors the
 * planned GET /admin/students.php list response (see docs/BACKEND.md).
 */

export type StudentStatus = "active" | "inactive" | "transferred" | "pending";

export type StudentRow = {
  id: string;
  admissionNo: string;
  name: string;
  className: string;
  gender: "F" | "M";
  guardian: string;
  status: StudentStatus;
  enrolled: string;
};

export const CLASSES = ["JSS 1A", "JSS 2A", "JSS 3C", "SSS 1B", "SSS 2A"] as const;

export const STUDENTS: StudentRow[] = [
  { id: "s1", admissionNo: "GMC/2451", name: "Adaeze Okafor", className: "JSS 2A", gender: "F", guardian: "Chidinma Okafor", status: "active", enrolled: "2024-09-12" },
  { id: "s2", admissionNo: "GMC/2452", name: "Emeka Okafor", className: "SSS 1B", gender: "M", guardian: "Chidinma Okafor", status: "active", enrolled: "2022-09-05" },
  { id: "s3", admissionNo: "GMC/2453", name: "Fatima Bello", className: "JSS 1A", gender: "F", guardian: "Usman Bello", status: "active", enrolled: "2025-09-15" },
  { id: "s4", admissionNo: "GMC/2454", name: "Chinedu Eze", className: "JSS 3C", gender: "M", guardian: "Ngozi Eze", status: "active", enrolled: "2023-09-11" },
  { id: "s5", admissionNo: "GMC/2455", name: "Aisha Mohammed", className: "SSS 2A", gender: "F", guardian: "Ibrahim Mohammed", status: "active", enrolled: "2021-09-06" },
  { id: "s6", admissionNo: "GMC/2456", name: "Tobenna Nwosu", className: "JSS 2A", gender: "M", guardian: "Grace Nwosu", status: "inactive", enrolled: "2024-09-12" },
  { id: "s7", admissionNo: "GMC/2457", name: "Halima Sani", className: "JSS 1A", gender: "F", guardian: "Musa Sani", status: "pending", enrolled: "2026-01-08" },
  { id: "s8", admissionNo: "GMC/2458", name: "David Adeyemi", className: "SSS 1B", gender: "M", guardian: "Grace Adeyemi", status: "active", enrolled: "2022-09-05" },
  { id: "s9", admissionNo: "GMC/2459", name: "Blessing Obi", className: "JSS 3C", gender: "F", guardian: "Peter Obi", status: "transferred", enrolled: "2023-09-11" },
  { id: "s10", admissionNo: "GMC/2460", name: "Yusuf Ali", className: "SSS 2A", gender: "M", guardian: "Zainab Ali", status: "active", enrolled: "2021-09-06" },
  { id: "s11", admissionNo: "GMC/2461", name: "Ngozi Umeh", className: "JSS 2A", gender: "F", guardian: "Kelechi Umeh", status: "active", enrolled: "2024-09-12" },
  { id: "s12", admissionNo: "GMC/2462", name: "Samuel Danjuma", className: "JSS 1A", gender: "M", guardian: "Rebecca Danjuma", status: "pending", enrolled: "2026-01-08" },
];
