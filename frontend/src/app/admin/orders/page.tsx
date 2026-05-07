"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyOrders } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { data: orders, isLoading, isError } = useMyOrders();

  const filtered =
    statusFilter === "all"
      ? (orders ?? [])
      : (orders ?? []).filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Orders
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          {orders?.length ?? 0} total orders
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none mb-5 border-b border-border pb-0">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider shrink-0 border-b-2 -mb-px transition-colors",
              statusFilter === f.value
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <p className="font-body text-sm text-error py-8">Failed to load orders</p>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                {["Order", "Date", "Customer", "Items", "Total", "Status", "Delivery", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-elevated transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-body text-sm font-semibold text-text hover:text-primary transition-colors"
                    >
                      #{order.orderToken}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">
                    +{order.phone}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text">
                    {order.items.length}
                  </td>
                  <td className="px-4 py-3 font-heading text-sm font-bold text-text whitespace-nowrap">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted capitalize">
                    {order.deliveryMethod}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-body text-xs text-text-muted hover:text-primary transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center font-body text-sm text-text-muted">
              No orders
            </p>
          )}
        </div>
      )}
    </div>
  );
}
