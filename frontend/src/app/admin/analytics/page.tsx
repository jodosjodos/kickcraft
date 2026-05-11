"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

function formatPrice(n: number) {
  return `RWF ${n.toLocaleString("en-RW")}`;
}

type Tab = "revenue" | "orders" | "customers";
type Range = "7d" | "30d" | "90d";

const REVENUE_7D = [
  { day: "Mon", revenue: 142000 }, { day: "Tue", revenue: 89000 }, { day: "Wed", revenue: 215000 },
  { day: "Thu", revenue: 178000 }, { day: "Fri", revenue: 310000 }, { day: "Sat", revenue: 425000 }, { day: "Sun", revenue: 290000 },
];
const REVENUE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(50000 + Math.random() * 350000),
}));
const REVENUE_90D = Array.from({ length: 90 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(30000 + Math.random() * 400000),
}));

const ORDERS_DATA = [
  { day: "Mon", orders: 12 }, { day: "Tue", orders: 8 }, { day: "Wed", orders: 19 },
  { day: "Thu", orders: 15 }, { day: "Fri", orders: 27 }, { day: "Sat", orders: 38 }, { day: "Sun", orders: 23 },
];
const ORDER_STATUS_BREAKDOWN = [
  { status: "Delivered", count: 312, color: "#41e575" },
  { status: "Out for Delivery", count: 48, color: "#ffb5a0" },
  { status: "Confirmed", count: 67, color: "#FF4500" },
  { status: "Pending", count: 23, color: "#9e9e9e" },
  { status: "Cancelled", count: 19, color: "#ffb4ab" },
];

const TOP_SELLING = [
  { rank: 1, name: "Air Max Pulse", brand: "Nike", units: 84, revenue: 15120000 },
  { rank: 2, name: "Yeezy Slide", brand: "Adidas", units: 67, revenue: 9380000 },
  { rank: 3, name: "Jordan 1 Retro High", brand: "Jordan", units: 52, revenue: 19240000 },
  { rank: 4, name: "New Balance 990v6", brand: "NB", units: 41, revenue: 9840000 },
  { rank: 5, name: "Vans Old Skool", brand: "Vans", units: 38, revenue: 3420000 },
];

const BRAND_REVENUE = [
  { brand: "Nike", revenue: 4850000 },
  { brand: "Jordan", revenue: 3920000 },
  { brand: "Adidas", revenue: 2810000 },
  { brand: "New Balance", revenue: 1640000 },
  { brand: "Vans", revenue: 890000 },
];

const CUSTOMER_DATA = [
  { month: "Jan", new: 42, returning: 98 }, { month: "Feb", new: 58, returning: 112 },
  { month: "Mar", new: 71, returning: 125 }, { month: "Apr", new: 65, returning: 140 },
  { month: "May", new: 89, returning: 158 }, { month: "Jun", new: 94, returning: 171 },
];
const TOP_CUSTOMERS = [
  { name: "Alice Uwimana", email: "alice@gmail.com", orders: 5, spent: 320000, tier: "Silver" },
  { name: "Chantal Mukamana", email: "chantal@gmail.com", orders: 8, spent: 540000, tier: "Gold" },
  { name: "Frank Mugisha", email: "frank@gmail.com", orders: 4, spent: 260000, tier: "Bronze" },
  { name: "Bob Nkurunziza", email: "bob@gmail.com", orders: 2, spent: 95000, tier: "Bronze" },
];

const TIER_COLORS: Record<string, string> = {
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

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<Tab>("revenue");
  const [range, setRange] = useState<Range>("7d");

  const revenueData = range === "7d" ? REVENUE_7D : range === "30d" ? REVENUE_30D : REVENUE_90D;
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / revenueData.length);
  const maxDay = revenueData.reduce((a, b) => (a.revenue > b.revenue ? a : b));

  const TABS: { value: Tab; label: string }[] = [
    { value: "revenue", label: "Revenue" },
    { value: "orders", label: "Orders" },
    { value: "customers", label: "Customers" },
  ];
  const RANGES: { value: Range; label: string }[] = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
  ];

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
          {/* Date range */}
          <div className="flex items-center gap-2">
            {RANGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setRange(value)}
                className={cn(
                  "px-3 py-1.5 font-body text-xs font-semibold border transition-all",
                  range === value
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: formatPrice(totalRevenue), icon: "payments", color: "text-primary" },
              { label: "Daily Average", value: formatPrice(avgRevenue), icon: "trending_up", color: "text-secondary" },
              { label: "Best Day", value: maxDay.day ?? "—", icon: "star", color: "text-[#ffb5a0]" },
              { label: "Best Day Revenue", value: formatPrice(maxDay.revenue), icon: "emoji_events", color: "text-primary" },
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

          {/* Main chart */}
          <div className="border border-border bg-surface p-5">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">
              Revenue — Last {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false}
                  interval={range === "7d" ? 0 : range === "30d" ? 4 : 9}
                />
                <YAxis tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#FF4500" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products + Brand Revenue */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="border border-border bg-surface">
              <div className="px-5 py-3.5 border-b border-border">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Top Selling Products</h2>
              </div>
              <div className="divide-y divide-border">
                {TOP_SELLING.map((p) => (
                  <div key={p.rank} className="flex items-center gap-4 px-5 py-3">
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
            </div>

            <div className="border border-border bg-surface p-5">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Revenue by Brand</h2>
              <div className="space-y-3">
                {BRAND_REVENUE.map((b) => {
                  const max = BRAND_REVENUE[0].revenue;
                  return (
                    <div key={b.brand}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-body text-xs text-text-muted">{b.brand}</p>
                        <p className="font-body text-xs font-semibold text-text">{formatPrice(b.revenue)}</p>
                      </div>
                      <div className="h-1.5 bg-surface-elevated w-full">
                        <div className="h-full bg-primary" style={{ width: `${(b.revenue / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">Orders This Week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ORDERS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
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
              {ORDER_STATUS_BREAKDOWN.map((s) => {
                const total = ORDER_STATUS_BREAKDOWN.reduce((a, b) => a + b.count, 0);
                return (
                  <div key={s.status} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <p className="font-body text-sm text-text flex-1">{s.status}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-surface-elevated">
                        <div className="h-full" style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }} />
                      </div>
                      <p className="font-heading text-sm font-extrabold text-text w-8 text-right">{s.count}</p>
                      <p className="font-body text-[10px] text-text-muted w-10 text-right">{Math.round((s.count / total) * 100)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Customers tab */}
      {tab === "customers" && (
        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">New vs Returning (6 months)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CUSTOMER_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="returning" fill="#41e575" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="new" fill="#FF4500" radius={[2, 2, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-primary inline-block" /><span className="font-body text-[10px] text-text-muted">New</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-secondary inline-block" /><span className="font-body text-[10px] text-text-muted">Returning</span></div>
            </div>
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
            <div className="divide-y divide-border">
              {TOP_CUSTOMERS.map((c, i) => (
                <div key={i} className="grid grid-cols-[1fr_100px_120px_80px] gap-4 items-center px-5 py-3.5">
                  <div>
                    <p className="font-body text-sm font-semibold text-text">{c.name}</p>
                    <p className="font-body text-[10px] text-text-muted">{c.email}</p>
                  </div>
                  <p className="font-body text-sm text-text">{c.orders}</p>
                  <p className="font-heading text-sm font-extrabold text-text">{formatPrice(c.spent)}</p>
                  <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase w-fit", TIER_COLORS[c.tier] ?? "")}>{c.tier}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
