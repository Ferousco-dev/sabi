"use client";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { getRevenue, type RevenueData } from "@/app/lib/api/creator";

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenue().then((res) => {
      if (res.ok && res.data) setRevenue(res.data.revenue);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--gray-500)" }}>Loading revenue…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--gray-900)", marginBottom: 20 }}>Revenue</h1>

      {revenue && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { icon: DollarSign, label: "Total Revenue", value: `${revenue.currency} ${revenue.total.toLocaleString()}`, color: "var(--gold)" },
            { icon: ShoppingCart, label: "Total Sales", value: revenue.sales, color: "var(--teal)" },
            { icon: TrendingUp, label: "Currency", value: revenue.currency, color: "var(--teal-700)" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--teal-50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
