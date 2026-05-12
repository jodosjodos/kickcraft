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
      <div className="flex items-center gap-3 border border-error/30 bg-error/5 px-5 py-4">
        <span className="material-symbols-outlined icon-outline text-[18px] text-error">
          error
        </span>
        <p className="font-body text-sm text-error">
          {error?.message ?? "Failed to load orders"}
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined icon-outline text-[28px] text-text-muted/40">
            receipt_long
          </span>
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          No orders yet
        </h2>
        <p className="font-body text-sm text-text-muted mb-8">
          When you place an order it will show up here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-primary text-white font-body text-sm font-bold uppercase tracking-wider px-8 py-3 hover:bg-primary-inverse transition-colors active:scale-95"
        >
          Browse Shoes
          <span className="material-symbols-outlined icon-outline text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Order History
        </h1>
        <span className="font-body text-xs text-text-muted">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block border border-border bg-surface hover:border-outline hover:bg-surface-elevated transition-all duration-150 group"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-outline text-[16px] text-primary">
                    receipt_long
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text group-hover:text-primary transition-colors">
                    #{order.orderToken}
                  </p>
                  <p className="font-body text-[11px] text-text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Items + total */}
            <div className="px-5 py-4 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                {order.items.map((item) => (
                  <p key={item.id} className="font-body text-sm text-text-muted truncate">
                    {item.productName}
                    <span className="text-text-muted/50 ml-1">
                      · Size {item.size} · ×{item.quantity}
                    </span>
                  </p>
                ))}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="material-symbols-outlined icon-outline text-[13px] text-text-muted/60">
                    {order.deliveryMethod === "pickup" ? "store" : "local_shipping"}
                  </span>
                  <p className="font-body text-[11px] text-text-muted/60">
                    {order.deliveryMethod === "pickup"
                      ? "Store Pickup"
                      : `Delivery — ${order.deliveryAddress ?? ""}`}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-lg font-extrabold text-text">
                  {formatPrice(order.total)}
                </p>
                <p className="font-body text-[10px] text-text-muted uppercase tracking-wider">
                  Total
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
