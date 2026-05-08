"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatsCard } from "@/components/admin/stats-card";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useMyOrders } from "@/hooks/api/use-orders";
import { useProducts } from "@/hooks/api/use-products";
import { Spinner } from "@/components/ui/spinner";

const REVENUE_DATA = [
  { day: "Mon", revenue: 142000 },
  { day: "Tue", revenue: 89000 },
  { day: "Wed", revenue: 215000 },
  { day: "Thu", revenue: 178000 },
  { day: "Fri", revenue: 310000 },
  { day: "Sat", revenue: 425000 },
  { day: "Sun", revenue: 290000 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#FF4500",
  confirmed: "#41e575",
  out_for_delivery: "#ffb5a0",
  delivered: "#41e575",
  cancelled: "#ffb4ab",
};

const STATUS_FILL: Record<string, string> = {
  pending: "#FF4500",
  confirmed: "#41e575",
  out_for_delivery: "#e0a060",
  delivered: "#298a4a",
  cancelled: "#ba1a1a",
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border px-3 py-2">
      <p className="font-body text-[10px] text-text-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-heading text-sm font-extrabold text-text">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: 100,
  });

  const isLoading = ordersLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const orderList = orders ?? [];
  const productList = productsData?.data ?? [];

  const revenue = orderList
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orderList.filter((o) => o.status === "pending").length;
  const recentOrders = [...orderList].slice(0, 5);

  const statusBreakdown = Object.entries(
    orderList.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Dashboard
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Store overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Revenue"
          value={formatPrice(revenue)}
          icon="payments"
          trend="from confirmed orders"
          trendUp
        />
        <StatsCard
          label="Total Orders"
          value={String(orderList.length)}
          icon="receipt_long"
          trend={`${pendingOrders} pending`}
          trendUp={pendingOrders === 0}
        />
        <StatsCard
          label="Products"
          value={String(productsData?.total ?? productList.length)}
          icon="inventory_2"
          trend="active listings"
          trendUp
        />
        <StatsCard
          label="Users"
          value="—"
          icon="group"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart — takes 2/3 */}
        <div className="lg:col-span-2 border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-1">
                This Week
              </p>
              <h2 className="font-heading text-base font-extrabold uppercase tracking-tight text-text">
                Revenue
              </h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333535" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9e9e9e", fontSize: 10, fontFamily: "Inter, sans-serif" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF4500"
                strokeWidth={2}
                dot={{ fill: "#FF4500", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#FF4500" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status — 1/3 */}
        <div className="border border-border bg-surface p-5">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-1">
            Breakdown
          </p>
          <h2 className="font-heading text-base font-extrabold uppercase tracking-tight text-text mb-4">
            Orders
          </h2>
          {statusBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-[160px]">
              <p className="font-body text-sm text-text-muted">No orders yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_FILL[entry.name] ?? "#555"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {statusBreakdown.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: STATUS_FILL[entry.name] ?? "#555" }}
                      />
                      <span className="font-body text-[11px] text-text-muted capitalize">
                        {entry.name.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="font-heading text-xs font-bold text-text">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="font-body text-xs text-primary hover:underline underline-offset-4"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-5 py-8 font-body text-sm text-text-muted text-center">
            No orders yet
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-elevated transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined icon-outline text-[14px] text-primary">
                      receipt_long
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-text group-hover:text-primary transition-colors">
                      #{order.orderToken}
                    </p>
                    <p className="font-body text-xs text-text-muted">
                      {formatDate(order.createdAt)} · {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <p className="font-heading text-sm font-extrabold text-text">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
