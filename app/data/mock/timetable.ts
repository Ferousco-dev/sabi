/**
 * Typed mock weekly timetable for the student timetable screen. Mirrors the
 * planned GET /student/timetable.php response (see docs/BACKEND.md).
 */

export const TIMETABLE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const TIMETABLE_SLOTS = ["08:00", "09:40", "11:20", "13:00", "14:40"] as const;

export type Day = (typeof TIMETABLE_DAYS)[number];
export type Slot = (typeof TIMETABLE_SLOTS)[number];

export type Lesson = { subject: string; room: string };

/** [day][slot] to lesson, or null for a free period. */
export const TIMETABLE: Record<Day, Record<Slot, Lesson | null>> = {
  Mon: {
    "08:00": { subject: "Mathematics", room: "Rm 4" },
    "09:40": { subject: "English", room: "Rm 4" },
    "11:20": { subject: "Basic Science", room: "Lab 1" },
    "13:00": { subject: "Social Studies", room: "Rm 2" },
    "14:40": { subject: "Computer Studies", room: "ICT Lab" },
  },
  Tue: {
    "08:00": { subject: "English", room: "Rm 4" },
    "09:40": { subject: "Mathematics", room: "Rm 4" },
    "11:20": { subject: "Civic Education", room: "Rm 2" },
    "13:00": { subject: "Agricultural Science", room: "Lab 2" },
    "14:40": null,
  },
  Wed: {
    "08:00": { subject: "Mathematics", room: "Rm 4" },
    "09:40": { subject: "English", room: "Rm 4" },
    "11:20": { subject: "Basic Science", room: "Lab 1" },
    "13:00": { subject: "Social Studies", room: "Rm 2" },
    "14:40": { subject: "Physical Education", room: "Field" },
  },
  Thu: {
    "08:00": { subject: "Basic Science", room: "Lab 1" },
    "09:40": { subject: "Mathematics", room: "Rm 4" },
    "11:20": { subject: "Business Studies", room: "Rm 3" },
    "13:00": { subject: "English", room: "Rm 4" },
    "14:40": { subject: "Fine Art", room: "Art Rm" },
  },
  Fri: {
    "08:00": { subject: "Social Studies", room: "Rm 2" },
    "09:40": { subject: "Basic Science", room: "Lab 1" },
    "11:20": { subject: "Mathematics", room: "Rm 4" },
    "13:00": { subject: "Computer Studies", room: "ICT Lab" },
    "14:40": null,
  },
};

/**
 * Stable teal-tinted swatch per subject so the grid reads at a glance. All are
 * on-brand neutrals and teals, no rainbow. Keyed by subject name.
 */
export const SUBJECT_SWATCH: Record<string, { bg: string; fg: string }> = {
  Mathematics: { bg: "var(--teal-50)", fg: "var(--teal)" },
  English: { bg: "#F2F4F7", fg: "#344054" },
  "Basic Science": { bg: "#ECFDF3", fg: "#067647" },
  "Social Studies": { bg: "#FFFAEB", fg: "#B54708" },
  "Computer Studies": { bg: "var(--teal-50)", fg: "var(--teal-600)" },
  "Civic Education": { bg: "#F2F4F7", fg: "#344054" },
  "Agricultural Science": { bg: "#ECFDF3", fg: "#067647" },
  "Physical Education": { bg: "#FFFAEB", fg: "#B54708" },
  "Business Studies": { bg: "#F2F4F7", fg: "#344054" },
  "Fine Art": { bg: "var(--teal-50)", fg: "var(--teal)" },
};

export function swatch(subject: string) {
  return SUBJECT_SWATCH[subject] ?? { bg: "#F2F4F7", fg: "#344054" };
}
