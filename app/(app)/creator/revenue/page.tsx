"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Wallet, ShoppingCart, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getRevenue, type RevenueData } from "@/app/lib/api/creator";
import { LoadingPage } from "@/app/components/ui/LoadingSpinner";
import { PageHeader } from "@/app/components/dashboard/PageHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Card } from "@/app/components/dashboard/Card";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenue().then((res) => {
      if (res.ok && res.data) setRevenue(res.data.revenue);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const avg = revenue && revenue.sales > 0 ? Math.round(revenue.total / revenue.sales) : 0;

  return (
    <>
      <PageHeader title="Revenue" subtitle="Your sales and earnings summary." />

      {revenue ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div className="dash-rise"><MoneyCard label="Total revenue" amount={`${revenue.currency} ${revenue.total.toLocaleString()}`} Icon={Wallet} /></div>
          <div className="dash-rise" style={{ animationDelay: "70ms" }}><StatCard label="Total sales" value={revenue.sales} Icon={ShoppingCart} /></div>
          <div className="dash-rise" style={{ animationDelay: "140ms" }}><MoneyCard label="Avg. per sale" amount={`${revenue.currency} ${avg.toLocaleString()}`} Icon={TrendingUp} /></div>
        </div>
      ) : (
        <Card><EmptyState Icon={Wallet} title="No revenue data" description="Your sales and earnings summary appears here once you start selling courses." /></Card>
      )}
    </>
  );
}

function MoneyCard({ label, amount, Icon }: { label: string; amount: string; Icon: LucideIcon }) {
  return (
    <div className="stat-card" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-subtle)" }}>{label}</span>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--teal-50)", flexShrink: 0 }}>
          <Icon size={18} strokeWidth={1.9} style={{ color: "var(--teal)" }} />
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{amount}</div>
    </div>
  );
}
