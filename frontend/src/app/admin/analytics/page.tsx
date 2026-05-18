"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  useAnalyticsRevenue,
  useAnalyticsOrders,
  useAnalyticsCustomers,
} from "@/hooks/api/use-analytics";
import type { AnalyticsPeriod } from "@/types/api/analytics";

function formatPrice(n: number) {
  return `RWF ${n.toLocaleString("en-RW")}`;
}

type Tab = "revenue" | "orders" | "customers";

const TIER_COLORS: Record<string, string> = {
  Platinum: "bg-[#c6c6c7]/20 text-[#c6c6c7]",
  Gold: "bg-yellow-500/20 text-yellow-400",
  Silver: "bg-text-muted/20 text-text-muted",
  Bronze: "bg-[#ffb5a0]/20 text-[#ffb5a0]",
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border px-3 py-2 shadow-lg">
      <p className="font-body text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-heading text-xs font-bold text-text">
          {typeof p.value === "number" && p.value > 1000 ? formatPrice(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="material-symbols-outlined animate-spin text-text-muted text-3xl">progress_activity</span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<Tab>("revenue");
  const [revenueRange, setRevenueRange] = useState<AnalyticsPeriod>("7d");
  const [ordersRange, setOrdersRange] = useState<AnalyticsPeriod>("7d");

  const { data: revenueData, isLoading: revenueLoading } = useAnalyticsRevenue(revenueRange);
  const { data: ordersData, isLoading: ordersLoading } = useAnalyticsOrders(ordersRange);
  const { data: customersData, isLoading: customersLoading } = useAnalyticsCustomers();

  const TABS: { value: Tab; label: string }[] = [
    { value: "revenue", label: "Revenue" },
    { value: "orders", label: "Orders" },
    { value: "customers", label: "Customers" },
  ];
  const RANGES: { value: AnalyticsPeriod; label: string }[] = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
  ];

  const chartInterval = (range: AnalyticsPeriod) =>
    range === "7d" ? 0 : range === "30d" ? 4 : 9;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Overview</p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Analytics</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition-colors",
              tab === value ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Revenue tab */}
      {tab === "revenue" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {RANGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setRevenueRange(value)}
                className={cn(
                  "px-3 py-1.5 font-body text-xs font-semibold border transition-all",
                  revenueRange === value
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {revenueLoading || !revenueData ? (
            <Spinner />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: formatPrice(revenueData.summary.totalRevenue), icon: "payments", color: "text-primary" },
                  { label: "Daily Average", value: formatPrice(revenueData.summary.dailyAvg), icon: "trending_up", color: "text-secondary" },
                  { label: "Best Day", value: revenueData.summary.bestDay || "—", icon: "star", color: "text-[#ffb5a0]" },
                  { label: "Best Day Revenue", value: formatPrice(revenueData.summary.bestDayRevenue), icon: "emoji_events", color: "text-primary" },
                ].map((m) => (
                  <div key={m.label} className="border border-border bg-surface p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`material-symbols-outlined icon-filled text-[20px] ${m.color}`}>{m.icon}</span>
                    </div>
                    <p className="font-heading text-xl font-extrabold text-text leading-none mb-1">{m.value}</p>
                    <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">
                  Revenue — Last {revenueRange === "7d" ? "7 days" : revenueRange === "30d" ? "30 days" : "90 days"}
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueData.chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false}
                      interval={chartInterval(revenueRange)}
                    />
                    <YAxis tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false}
                      tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#FF4500" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="border border-border bg-surface">
                  <div className="px-5 py-3.5 border-b border-border">
                    <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Top Selling Products</h2>
                  </div>
                  {revenueData.topProducts.length === 0 ? (
                    <p className="px-5 py-8 font-body text-sm text-text-muted text-center">No sales data for this period.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {revenueData.topProducts.map((p) => (
                        <div key={p.productId} className="flex items-center gap-4 px-5 py-3">
                          <span className={`font-heading text-sm font-extrabold w-5 shrink-0 ${p.rank === 1 ? "text-primary" : "text-text-muted"}`}>#{p.rank}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-semibold text-text truncate">{p.name}</p>
                            <p className="font-body text-[10px] text-text-muted">{p.brand}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-heading text-xs font-extrabold text-text">{formatPrice(p.revenue)}</p>
                            <p className="font-body text-[10px] text-text-muted">{p.units} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-border bg-surface p-5">
                  <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Sales by Category</h2>
                  {revenueData.categoryBreakdown.length === 0 ? (
                    <p className="font-body text-sm text-text-muted text-center py-4">No category data.</p>
                  ) : (
                    <div className="space-y-3">
                      {revenueData.categoryBreakdown.map((c) => {
                        const max = revenueData.categoryBreakdown[0]?.revenue ?? 1;
                        return (
                          <div key={c.subCategory}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-body text-xs text-text-muted">{c.name}</p>
                              <p className="font-body text-xs font-semibold text-text">{formatPrice(c.revenue)}</p>
                            </div>
                            <div className="h-1.5 bg-surface-elevated w-full">
                              <div className="h-full" style={{ width: `${(c.revenue / max) * 100}%`, backgroundColor: c.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {RANGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setOrdersRange(value)}
                className={cn(
                  "px-3 py-1.5 font-body text-xs font-semibold border transition-all",
                  ordersRange === value
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {ordersLoading || !ordersData ? (
            <Spinner />
          ) : (
            <>
              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">
                  Orders — Last {ordersRange === "7d" ? "7 days" : ordersRange === "30d" ? "30 days" : "90 days"}
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ordersData.chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false}
                      interval={chartInterval(ordersRange)}
                    />
                    <YAxis tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="orders" stroke="#FF4500" strokeWidth={2} dot={{ fill: "#FF4500", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="border border-border bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Status Breakdown</h2>
                </div>
                <div className="divide-y divide-border">
                  {ordersData.statusBreakdown.map((s) => {
                    const total = ordersData.statusBreakdown.reduce((a, b) => a + b.count, 0);
                    return (
                      <div key={s.status} className="flex items-center gap-4 px-5 py-3.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <p className="font-body text-sm text-text flex-1">{s.label}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-surface-elevated">
                            <div className="h-full" style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%`, backgroundColor: s.color }} />
                          </div>
                          <p className="font-heading text-sm font-extrabold text-text w-8 text-right">{s.count}</p>
                          <p className="font-body text-[10px] text-text-muted w-10 text-right">{total > 0 ? Math.round((s.count / total) * 100) : 0}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Customers tab */}
      {tab === "customers" && (
        <div className="space-y-6">
          {customersLoading || !customersData ? (
            <Spinner />
          ) : (
            <>
              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">Customer Tier Distribution</h2>
                {customersData.tierDistribution.every((t) => t.count === 0) ? (
                  <p className="font-body text-sm text-text-muted text-center py-4">No customer data.</p>
                ) : (
                  <div className="space-y-3">
                    {customersData.tierDistribution.map((t) => {
                      const max = Math.max(...customersData.tierDistribution.map((x) => x.count), 1);
                      return (
                        <div key={t.tier}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-body text-xs text-text-muted">{t.tier}</p>
                            <p className="font-body text-xs font-semibold text-text">{t.count} customers</p>
                          </div>
                          <div className="h-1.5 bg-surface-elevated w-full">
                            <div className="h-full" style={{ width: `${(t.count / max) * 100}%`, backgroundColor: t.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border border-border bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Top Customers</h2>
                </div>
                <div className="hidden md:grid grid-cols-[1fr_100px_120px_80px] gap-4 px-5 py-2.5 border-b border-border bg-surface-elevated">
                  {["Customer", "Orders", "Spent", "Tier"].map((h) => (
                    <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
                  ))}
                </div>
                {customersData.topCustomers.length === 0 ? (
                  <p className="px-5 py-8 font-body text-sm text-text-muted text-center">No customers yet.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {customersData.topCustomers.map((c) => (
                      <div key={c.id} className="grid grid-cols-[1fr_100px_120px_80px] gap-4 items-center px-5 py-3.5">
                        <div>
                          <p className="font-body text-sm font-semibold text-text">{c.name}</p>
                          <p className="font-body text-[10px] text-text-muted">{c.email}</p>
                        </div>
                        <p className="font-body text-sm text-text">{c.orderCount}</p>
                        <p className="font-heading text-sm font-extrabold text-text">{formatPrice(c.totalSpent)}</p>
                        <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase w-fit", TIER_COLORS[c.tier] ?? "")}>{c.tier}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
