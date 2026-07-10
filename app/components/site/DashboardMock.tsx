import type { CSSProperties } from "react";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3, MessageSquare,
  Search, Bell, TrendingUp, TrendingDown, Calendar, ChevronRight,
} from "lucide-react";

/* A realistic SabiHub school-admin dashboard, built in code. Communicates a
   real, usable product, the hero's proof of legitimacy. */

const NAV = [
  { Icon: LayoutDashboard, label: "Dashboard", active: true },
  { Icon: Users, label: "Students" },
  { Icon: BookOpen, label: "Lessons" },
  { Icon: ClipboardList, label: "Assignments" },
  { Icon: BarChart3, label: "Analytics" },
  { Icon: MessageSquare, label: "Messages", badge: 3 },
];

const KPIS = [
  { label: "Students", value: "1,248", delta: "+4.2%", up: true },
  { label: "Attendance", value: "94.6%", delta: "+1.8%", up: true },
  { label: "Assignments", value: "312", delta: "+12", up: true },
  { label: "Avg. score", value: "78%", delta: "-0.4%", up: false },
];

const BARS = [52, 64, 58, 76, 71, 88, 66, 82, 74, 91, 79, 86];
const CLASSES = [
  { name: "JSS 2 · Science", teacher: "Mrs. Adaeze", score: 86 },
  { name: "SS 1 · Mathematics", teacher: "Mr. Bello", score: 81 },
  { name: "JSS 3 · English", teacher: "Ms. Chioma", score: 78 },
];

const card: CSSProperties = {
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: 14,
  boxShadow: "var(--shadow-xs)",
};

export function DashboardMock() {
  return (
    <div
      className="dash-mock"
      aria-hidden="true"
      style={{
        width: 1000,
        maxWidth: "100%",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-2xl)",
        overflow: "hidden",
      }}
    >
      {/* window bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--gray-50)" }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#E5675E" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#E7B14A" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#5FB97A" }} />
        <div style={{ margin: "0 auto", fontSize: 12, color: "var(--gray-500)", background: "#fff", border: "1px solid var(--border)", borderRadius: 7, padding: "4px 34px", fontWeight: 500 }}>
          app.sabihub.ng/dashboard
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "204px 1fr" }}>
        {/* Sidebar */}
        <aside style={{ borderRight: "1px solid var(--border)", padding: 16, background: "#fff", display: "flex", flexDirection: "column", gap: 4, minHeight: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 16px" }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="/logo.png" alt="" style={{ width: 19, height: 19, objectFit: "contain" }} />
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>SabiHub</span>
          </div>
          {NAV.map(({ Icon, label, active, badge }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
                background: active ? "var(--teal-50)" : "transparent",
                color: active ? "var(--teal)" : "var(--gray-600)",
                fontWeight: active ? 600 : 500, fontSize: 13.5,
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {badge && (
                <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 700, color: "#fff", background: "var(--teal)", borderRadius: 999, padding: "1px 7px" }}>{badge}</span>
              )}
            </div>
          ))}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 9, padding: "10px 8px", borderTop: "1px solid var(--border)" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>A</span>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)" }}>Principal Adaeze</div>
              <div style={{ fontSize: 11, color: "var(--gray-500)" }}>Govt. Model College</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding: 22, background: "var(--gray-50)" }}>
          {/* topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>Good morning, Adaeze</div>
              <div style={{ fontSize: 12.5, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <Calendar size={13} /> Monday, 12 May · 2025/26 Session
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 12px", width: 190 }}>
                <Search size={15} style={{ color: "var(--gray-400)" }} />
                <span style={{ fontSize: 12.5, color: "var(--gray-400)" }}>Search…</span>
              </div>
              <div style={{ position: "relative", width: 38, height: 38, borderRadius: 9, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={16} style={{ color: "var(--gray-600)" }} />
                <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: "50%", background: "var(--gold)" }} />
              </div>
            </div>
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
            {KPIS.map((k) => (
              <div key={k.label} style={{ ...card, padding: "14px 15px" }}>
                <div style={{ fontSize: 12, color: "var(--gray-500)", marginBottom: 8, fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{k.value}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11.5, fontWeight: 600, color: k.up ? "#0E8345" : "#B42318" }}>
                  {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{k.delta}
                </div>
              </div>
            ))}
          </div>

          {/* chart + list */}
          <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 12 }}>
            {/* chart */}
            <div style={{ ...card, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)" }}>Performance overview</div>
                  <div style={{ fontSize: 11.5, color: "var(--gray-500)", marginTop: 2 }}>Class average · last 12 weeks</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--teal)", background: "var(--teal-50)", borderRadius: 999, padding: "4px 10px" }}>WAEC-aligned</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 120 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ height: `${h}%`, borderRadius: "5px 5px 2px 2px", background: i === BARS.length - 3 ? "var(--teal)" : "var(--teal-50)", border: i === BARS.length - 3 ? "none" : "1px solid #DCE8E9" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* top classes */}
            <div style={{ ...card, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gray-900)" }}>Top classes</div>
                <ChevronRight size={15} style={{ color: "var(--gray-400)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CLASSES.map((c) => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 1 }}>{c.teacher}</div>
                      <div style={{ height: 5, borderRadius: 999, background: "var(--gray-100)", marginTop: 7, overflow: "hidden" }}>
                        <div style={{ width: `${c.score}%`, height: "100%", borderRadius: 999, background: "var(--teal)" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)" }}>{c.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
