"use client";

import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatsCard } from "@/components/admin/stats-card";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useMyOrders } from "@/hooks/api/use-orders";
import { useProducts } from "@/hooks/api/use-products";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/providers/auth-provider";

const REVENUE_DATA = [
  { day: "Mon", revenue: 142000 },
  { day: "Tue", revenue: 89000 },
  { day: "Wed", revenue: 215000 },
  { day: "Thu", revenue: 178000 },
  { day: "Fri", revenue: 310000 },
  { day: "Sat", revenue: 425000 },
  { day: "Sun", revenue: 290000 },
];

const TOP_PRODUCTS = [
  { rank: 1, name: "Air Max Pulse", brand: "Nike", units: 84, revenue: 15120000 },
  { rank: 2, name: "Yeezy Slide", brand: "Adidas", units: 67, revenue: 9380000 },
  { rank: 3, name: "Jordan 1 Retro High", brand: "Jordan", units: 52, revenue: 19240000 },
  { rank: 4, name: "New Balance 990v6", brand: "NB", units: 41, revenue: 9840000 },
  { rank: 5, name: "Vans Old Skool", brand: "Vans", units: 38, revenue: 3420000 },
];

const ACTIVITY_FEED = [
  { icon: "shopping_bag", color: "text-primary", label: "New order #KC-8821 from +250788012345", time: "2m ago" },
  { icon: "inventory_2", color: "text-error", label: "Low stock alert: Jordan 1 Retro (2 left)", time: "18m ago" },
  { icon: "person_add", color: "text-secondary", label: "New customer registered", time: "41m ago" },
  { icon: "reviews", color: "text-[#ffb5a0]", label: "New review pending approval — Air Max Pulse", time: "1h ago" },
  { icon: "local_shipping", color: "text-secondary", label: "Order #KC-8817 marked delivered", time: "2h ago" },
];

const CATEGORY_DATA = [
  { name: "Sneakers", value: 58, color: "#FF4500" },
  { name: "Running", value: 22, color: "#41e575" },
  { name: "Lifestyle", value: 14, color: "#ffb5a0" },
  { name: "Other", value: 6, color: "#333535" },
];

function CustomBarTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border px-3 py-2 shadow-lg">
      <p className="font-body text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="font-heading text-xs font-bold text-text">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatDate(dateStr);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 100 });

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const orderList = orders ?? [];
  const productList = productsData?.data ?? [];

  const revenue = orderList.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orderList.filter((o) => o.status === "pending").length;
  const deliveredOrders = orderList.filter((o) => o.status === "delivered").length;
  const lowStockProducts = productList.filter((p) => p.stock > 0 && p.stock <= 3);
  const recentOrders = [...orderList].slice(0, 5);

  const today = new Date().toLocaleDateString("en-RW", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{today}</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-1.5 border border-border bg-surface px-3.5 py-2 font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-all"
          >
            <span className="material-symbols-outlined icon-outline text-[15px]">monitoring</span>
            Analytics
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined icon-outline text-[15px]">add</span>
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Revenue" value={formatPrice(revenue)} icon="payments" trend="from active orders" trendUp delta="+18%" />
        <StatsCard label="Orders" value={String(orderList.length)} icon="receipt_long" trend={`${pendingOrders} pending`} trendUp={pendingOrders === 0} />
        <StatsCard
          label="Products"
          value={String(productsData?.total ?? productList.length)}
          icon="inventory_2"
          trend={`${lowStockProducts.length} low stock`}
          trendUp={lowStockProducts.length === 0}
        />
        <StatsCard
          label="Delivered"
          value={String(deliveredOrders)}
          icon="where_to_vote"
          trend="completed"
          trendUp
          delta={orderList.length ? `${Math.round((deliveredOrders / orderList.length) * 100)}%` : "—"}
        />
      </div>

      {/* Chart + Category split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-0.5">Revenue</p>
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">This Week</h2>
            </div>
            <Link href="/admin/analytics" className="font-body text-[10px] text-primary hover:underline underline-offset-4 flex items-center gap-1">
              Full analytics
              <span className="material-symbols-outlined icon-outline text-[12px]">arrow_forward</span>
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="revenue" fill="#FF4500" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category split */}
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-body text-xs text-text-muted">{c.name}</p>
                  <p className="font-body text-xs font-semibold text-text">{c.value}%</p>
                </div>
                <div className="h-1.5 bg-surface-elevated w-full">
                  <div className="h-full transition-all duration-500" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-2.5">Low Stock Alerts</p>
            {lowStockProducts.length === 0 ? (
              <p className="font-body text-xs text-text-muted">All products stocked</p>
            ) : (
              lowStockProducts.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between py-1.5 group">
                  <p className="font-body text-xs text-text group-hover:text-primary transition-colors truncate max-w-[140px]">{p.name}</p>
                  <span className="font-heading text-xs font-extrabold text-error shrink-0">{p.stock} left</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Products + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top products */}
        <div className="lg:col-span-2 border border-border bg-surface">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Top Products</h2>
            <Link href="/admin/products" className="font-body text-[10px] text-primary hover:underline underline-offset-4 flex items-center gap-1">
              View all
              <span className="material-symbols-outlined icon-outline text-[12px]">arrow_forward</span>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.rank} className="flex items-center gap-4 px-5 py-3">
                <span className={`font-heading text-sm font-extrabold w-5 shrink-0 ${p.rank === 1 ? "text-primary" : "text-text-muted"}`}>
                  #{p.rank}
                </span>
                <div className="w-9 h-9 bg-surface-elevated shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined icon-outline text-[18px] text-text-muted/40">inventory_2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-text truncate">{p.name}</p>
                  <p className="font-body text-[10px] text-text-muted">{p.brand}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-sm font-extrabold text-text">{formatPrice(p.revenue)}</p>
                  <p className="font-body text-[10px] text-text-muted">{p.units} units</p>
                </div>
                {/* Mini sparkline bar */}
                <div className="hidden md:flex items-end gap-0.5 h-6 shrink-0">
                  {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary/30 rounded-sm"
                      style={{ height: `${(h / 100) * 24}px`, backgroundColor: i === 6 ? "#FF4500" : undefined }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="border border-border bg-surface">
          <div className="px-5 py-3.5 border-b border-border">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div className="w-7 h-7 bg-surface-elevated flex items-center justify-center shrink-0 mt-0.5">
                  <span className={`material-symbols-outlined icon-filled text-[15px] ${a.color}`}>{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-text leading-snug">{a.label}</p>
                  <p className="font-body text-[10px] text-text-muted mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-[10px] text-primary hover:underline underline-offset-4 flex items-center gap-1">
            View all
            <span className="material-symbols-outlined icon-outline text-[12px]">arrow_forward</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">receipt_long</span>
            <p className="font-body text-sm text-text-muted">No orders yet</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_140px_80px_110px_90px] gap-4 px-5 py-2 border-b border-border bg-surface-elevated">
              {["Order", "Customer", "Items", "Status", "Total"].map((h) => (
                <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
              ))}
            </div>
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex md:grid md:grid-cols-[1fr_140px_80px_110px_90px] gap-4 items-center px-5 py-3 hover:bg-surface-elevated transition-colors group"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-text group-hover:text-primary transition-colors">#{order.orderToken}</p>
                    <p className="font-body text-[10px] text-text-muted mt-0.5">{timeAgo(order.createdAt)}</p>
                  </div>
                  <p className="hidden md:block font-body text-xs text-text-muted truncate">+{order.phone}</p>
                  <p className="hidden md:block font-body text-sm text-text-muted">{order.items.length}</p>
                  <div className="hidden md:block"><OrderStatusBadge status={order.status} /></div>
                  <p className="ml-auto md:ml-0 font-heading text-sm font-extrabold text-text">{formatPrice(order.total)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
