import { Card } from "./Card";
import { HISTORY_DAYS, summarise, type DayStatus } from "../../data/mock/attendance-history";

const STATUS_COLOR: Record<DayStatus, string> = {
  present: "#12B76A",
  absent: "#F04438",
  late: "#F79009",
  excused: "var(--teal-600)",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

/**
 * Shared attendance history: a summary row and a strip of recent school days,
 * each square coloured by status, with a legend. Read-only, used by the student
 * and parent attendance screens.
 */
export function AttendanceHistory() {
  const days = HISTORY_DAYS;
  const s = summarise(days);

  const stats = [
    { label: "Attendance rate", value: `${s.rate}%` },
    { label: "Present", value: String(s.present) },
    { label: "Absent", value: String(s.absent) },
    { label: "Late", value: String(s.late) },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 20 }}>
        {stats.map((st) => (
          <div key={st.label} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", padding: "14px 16px" }}>
            <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>{st.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginTop: 3, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{st.value}</div>
          </div>
        ))}
      </div>

      <Card title="This month">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 8, marginBottom: 18 }}>
          {days.map((d) => (
            <div
              key={d.label}
              title={`${d.label}: ${STATUS_LABEL[d.status]}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-subtle)" }}
            >
              <span style={{ fontSize: 11.5, color: "var(--text-subtle)", whiteSpace: "nowrap" }}>{d.label}</span>
              <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: "var(--radius-full)", background: STATUS_COLOR[d.status] }} />
              <span className="sr-only">{STATUS_LABEL[d.status]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {(Object.keys(STATUS_LABEL) as DayStatus[]).map((k) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-muted)" }}>
              <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "var(--radius-full)", background: STATUS_COLOR[k] }} />
              {STATUS_LABEL[k]}
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}
