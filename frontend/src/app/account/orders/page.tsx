"use client";

import Link from "next/link";
import { useMyOrders } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="font-body text-sm text-error py-8">
        {error?.message ?? "Failed to load orders"}
      </p>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/40 mb-4 block">
          receipt_long
        </span>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          No orders yet
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">
          When you place an order it will show up here.
        </p>
        <Link
          href="/shop"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          Browse shoes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-6">
        Order History
      </h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block border border-border bg-surface p-5 hover:border-outline transition-colors duration-150 group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text group-hover:text-primary transition-colors">
                  #{order.orderToken}
                </p>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-col gap-1 mb-3">
              {order.items.map((item) => (
                <p
                  key={item.id}
                  className="font-body text-sm text-text-muted"
                >
                  {item.product.name}{" "}
                  <span className="text-text-muted/60">
                    · Size {item.size} · ×{item.quantity}
                  </span>
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="font-body text-xs text-text-muted capitalize">
                {order.deliveryMethod === "pickup"
                  ? "Store Pickup"
                  : `Delivery — ${order.deliveryAddress ?? ""}`}
              </p>
              <p className="font-heading text-sm font-extrabold text-text">
                {formatPrice(order.total)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
