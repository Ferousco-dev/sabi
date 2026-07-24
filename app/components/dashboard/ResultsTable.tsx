import { Badge, type BadgeTone } from "./Badge";

export type SubjectResult = { subject: string; score: number; grade: string };

function gradeTone(grade: string): BadgeTone {
  const band = grade[0]?.toUpperCase();
  if (band === "A") return "success";
  if (band === "B") return "teal";
  if (band === "C") return "warning";
  return "danger";
}

function remark(grade: string): string {
  const band = grade[0]?.toUpperCase();
  if (band === "A") return "Excellent";
  if (band === "B") return "Very good";
  if (band === "C") return "Good";
  if (band === "D") return "Fair";
  return "Needs work";
}

/**
 * Report-card results table: subject, continuous-assessment and exam split,
 * total, grade, and remark. CA is derived as 40% of the total so the split
 * always reconciles. Shared by the parent report card and student results.
 */
export function ResultsTable({ results }: { results: SubjectResult[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
        <thead>
          <tr>
            {["Subject", "CA (40)", "Exam (60)", "Total", "Grade", "Remark"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const ca = Math.round(r.score * 0.4);
            const exam = r.score - ca;
            return (
              <tr key={r.subject}>
                <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)" }}>{r.subject}</td>
                <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>{ca}</td>
                <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>{exam}</td>
                <td style={{ ...tdStyle, fontWeight: 600, color: "var(--gray-900)", fontVariantNumeric: "tabular-nums" }}>{r.score}</td>
                <td style={tdStyle}><Badge tone={gradeTone(r.grade)}>{r.grade}</Badge></td>
                <td style={{ ...tdStyle, color: "var(--text-subtle)" }}>{remark(r.grade)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-subtle)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap" as const,
};
