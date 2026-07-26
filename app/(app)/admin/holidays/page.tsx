"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Sun, Plus, CalendarDays } from "lucide-react";
import { getHolidays, createHoliday, type Holiday } from "@/app/lib/api/schools";
import { LoadingPage, LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { Card } from "@/app/components/dashboard/Card";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => getHolidays().then((res) => {
    if (res.ok && res.data) setHolidays(res.data.holidays);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setAdding(true);
    await createHoliday({ title: title.trim(), date, description: description.trim() || undefined });
    setTitle(""); setDate(""); setDescription("");
    await load();
    setAdding(false);
  }

  if (loading) return <LoadingPage />;

  const sorted = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming = sorted.filter((h) => new Date(h.date) >= new Date());
  const past = sorted.filter((h) => new Date(h.date) < new Date());
  const canSubmit = title.trim() && date;

  return (
    <>
      <PageHeader
        title="Holidays & Calendar"
        subtitle="Add public holidays and school breaks to the calendar."
        actions={<Badge tone="teal">{holidays.length} scheduled</Badge>}
      />

      <div style={{ maxWidth: 760 }}>
        <Card title="Add a holiday" style={{ marginBottom: 20 }}>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label htmlFor="hol-title" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Holiday</label>
              <input id="hol-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Independence Day"
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
            </div>
            <div style={{ flex: "0 1 160px" }}>
              <label htmlFor="hol-date" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Date</label>
              <input id="hol-date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)", color: "var(--text)" }} />
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label htmlFor="hol-desc" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", display: "block", marginBottom: 6 }}>Description (optional)</label>
              <input id="hol-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", height: 42, padding: "0 12px", fontSize: 14, border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", outline: "none", fontFamily: "var(--font-sans)" }} />
            </div>
            <button type="submit" disabled={adding || !canSubmit}
              style={{ height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--teal)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: adding || !canSubmit ? "not-allowed" : "pointer", opacity: adding || !canSubmit ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              {adding ? <LoadingSpinner size={15} color="#fff" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />} Add holiday
            </button>
          </form>
        </Card>

        {holidays.length === 0 ? (
          <Card><EmptyState Icon={Sun} title="No holidays scheduled" description="Add public holidays or school breaks to the calendar above." /></Card>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", marginBottom: 12, letterSpacing: "-0.01em" }}>Upcoming holidays</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {upcoming.map((h) => (
                    <div key={h.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", gap: 14 }}>
                      <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--teal-50)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Sun size={20} style={{ color: "var(--teal)" }} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--gray-900)" }}>{h.title}</div>
                        <div style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>{new Date(h.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <details>
                <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer", marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <CalendarDays size={15} aria-hidden="true" /> Past holidays ({past.length})
                </summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {past.map((h) => (
                    <div key={h.id} style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontSize: 13.5, color: "var(--text-muted)" }}>
                      {h.title} · {new Date(h.date).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </>
  );
}
