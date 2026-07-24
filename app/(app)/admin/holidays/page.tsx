"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Sun, Plus, Trash2 } from "lucide-react";
import { getHolidays, createHoliday, type Holiday } from "@/app/lib/api/schools";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const load = () => getHolidays().then((res) => {
    if (res.ok && res.data) setHolidays(res.data.holidays);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    await createHoliday({ title: title.trim(), date, description: description.trim() || undefined });
    setTitle(""); setDate(""); setDescription("");
    load();
  }

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading holidays…</div>;

  const sorted = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming = sorted.filter((h) => new Date(h.date) >= new Date());
  const past = sorted.filter((h) => new Date(h.date) < new Date());

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Holidays & Calendar</h1>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24, padding: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Holiday</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Independence Day" style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none", width: 180 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)", display: "block", marginBottom: 4 }}>Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", height: 38, padding: "0 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: 6, outline: "none" }} />
        </div>
        <button type="submit" style={{ height: 38, padding: "0 16px", borderRadius: 6, background: "var(--teal)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Add Holiday
        </button>
      </form>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)", marginBottom: 12 }}>Upcoming Holidays</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map((h) => (
              <div key={h.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Sun size={20} color="var(--gold)" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-900)" }}>{h.title}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{new Date(h.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <details>
          <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-500)", cursor: "pointer", marginBottom: 12 }}>Past Holidays ({past.length})</summary>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {past.map((h) => (
              <div key={h.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 14, color: "var(--gray-500)" }}>{h.title} · {new Date(h.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </details>
      )}

      {holidays.length === 0 && <p style={{ color: "var(--gray-400)", textAlign: "center", padding: 32 }}>No holidays scheduled.</p>}
    </div>
  );
}

