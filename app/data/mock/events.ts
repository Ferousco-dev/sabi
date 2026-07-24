/**
 * Typed mock school events for the parent events screen. Mirrors the planned
 * GET /parent/events.php response (see docs/BACKEND.md).
 */

export type EventType = "exam" | "meeting" | "holiday" | "deadline";

export type SchoolEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  day: string;
  detail: string;
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  exam: "Examination",
  meeting: "Meeting",
  holiday: "Holiday",
  deadline: "Deadline",
};

export const SCHOOL_EVENTS: SchoolEvent[] = [
  { id: "e1", title: "Mid-term tests begin", type: "exam", date: "Feb 10", day: "Monday", detail: "All classes, first period" },
  { id: "e2", title: "Parent-teacher meeting", type: "meeting", date: "Feb 15", day: "Saturday", detail: "Main hall, 10:00am" },
  { id: "e3", title: "Second term result deadline", type: "deadline", date: "Feb 21", day: "Friday", detail: "Teachers submit by 4:00pm" },
  { id: "e4", title: "Founder's day holiday", type: "holiday", date: "Mar 3", day: "Monday", detail: "School closed" },
  { id: "e5", title: "End of term examinations", type: "exam", date: "Mar 24", day: "Monday", detail: "Timetable to follow" },
];
