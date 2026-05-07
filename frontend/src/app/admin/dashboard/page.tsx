"use client";

import Link from "next/link";
import { StatsCard } from "@/components/admin/stats-card";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useMyOrders } from "@/hooks/api/use-orders";
import { useProducts } from "@/hooks/api/use-products";
import { Spinner } from "@/components/ui/spinner";

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Dashboard
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Overview of your store
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          label="Total Revenue"
          value={formatPrice(revenue)}
          icon="payments"
          trend="from all confirmed orders"
          trendUp={true}
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
          trendUp={true}
        />
        <StatsCard
          label="Users"
          value="—"
          icon="group"
        />
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
                className="flex items-center justify-between px-5 py-3 hover:bg-surface-elevated transition-colors group"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="font-body text-sm font-semibold text-text group-hover:text-primary transition-colors">
                    #{order.orderToken}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    {formatDate(order.createdAt)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
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
