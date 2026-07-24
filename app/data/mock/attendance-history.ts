/**
 * Typed mock attendance history for the student and parent attendance screens.
 * A flat run of recent school days keeps the view deterministic (no dependence
 * on the current date). Mirrors the planned attendance history endpoints.
 */

export type DayStatus = "present" | "absent" | "late" | "excused";

export type HistoryDay = { label: string; status: DayStatus };

/** About four school weeks, most recent last. */
export const HISTORY_DAYS: HistoryDay[] = [
  { label: "Mon 1", status: "present" }, { label: "Tue 2", status: "present" }, { label: "Wed 3", status: "late" }, { label: "Thu 4", status: "present" }, { label: "Fri 5", status: "present" },
  { label: "Mon 8", status: "present" }, { label: "Tue 9", status: "absent" }, { label: "Wed 10", status: "present" }, { label: "Thu 11", status: "present" }, { label: "Fri 12", status: "present" },
  { label: "Mon 15", status: "present" }, { label: "Tue 16", status: "present" }, { label: "Wed 17", status: "present" }, { label: "Thu 18", status: "excused" }, { label: "Fri 19", status: "present" },
  { label: "Mon 22", status: "late" }, { label: "Tue 23", status: "present" }, { label: "Wed 24", status: "present" }, { label: "Thu 25", status: "present" }, { label: "Fri 26", status: "present" },
];

export function summarise(days: HistoryDay[]) {
  const present = days.filter((d) => d.status === "present").length;
  const absent = days.filter((d) => d.status === "absent").length;
  const late = days.filter((d) => d.status === "late").length;
  const excused = days.filter((d) => d.status === "excused").length;
  const rate = days.length ? Math.round(((present + late) / days.length) * 100) : 0;
  return { present, absent, late, excused, rate, total: days.length };
}
