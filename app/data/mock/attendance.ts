/**
 * Typed mock roster for the teacher attendance recorder. Mirrors the planned
 * GET /teacher/roster.php response and the POST /teacher/attendance.php payload
 * (see docs/BACKEND.md).
 */

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type RosterStudent = { id: string; admissionNo: string; name: string };

export const ATTENDANCE_CLASSES = ["JSS 2A", "JSS 3C", "SSS 1B", "SSS 2A"] as const;

/** Roster keyed by class. Each class has its own set of students. */
export const ROSTERS: Record<string, RosterStudent[]> = {
  "JSS 2A": [
    { id: "j2a-1", admissionNo: "GMC/2451", name: "Adaeze Okafor" },
    { id: "j2a-2", admissionNo: "GMC/2456", name: "Tobenna Nwosu" },
    { id: "j2a-3", admissionNo: "GMC/2461", name: "Ngozi Umeh" },
    { id: "j2a-4", admissionNo: "GMC/2470", name: "Kelvin Ade" },
    { id: "j2a-5", admissionNo: "GMC/2471", name: "Zainab Yusuf" },
    { id: "j2a-6", admissionNo: "GMC/2472", name: "Chukwuma Eze" },
    { id: "j2a-7", admissionNo: "GMC/2473", name: "Funke Balogun" },
    { id: "j2a-8", admissionNo: "GMC/2474", name: "Ahmed Sani" },
  ],
  "JSS 3C": [
    { id: "j3c-1", admissionNo: "GMC/2454", name: "Chinedu Eze" },
    { id: "j3c-2", admissionNo: "GMC/2480", name: "Rita Okonkwo" },
    { id: "j3c-3", admissionNo: "GMC/2481", name: "Musa Danladi" },
    { id: "j3c-4", admissionNo: "GMC/2482", name: "Peace Effiong" },
  ],
  "SSS 1B": [
    { id: "s1b-1", admissionNo: "GMC/2452", name: "Emeka Okafor" },
    { id: "s1b-2", admissionNo: "GMC/2458", name: "David Adeyemi" },
    { id: "s1b-3", admissionNo: "GMC/2490", name: "Sarah Bassey" },
  ],
  "SSS 2A": [
    { id: "s2a-1", admissionNo: "GMC/2455", name: "Aisha Mohammed" },
    { id: "s2a-2", admissionNo: "GMC/2460", name: "Yusuf Ali" },
    { id: "s2a-3", admissionNo: "GMC/2495", name: "Ifeoma Nnamdi" },
  ],
};
