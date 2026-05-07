"use client";

import { use } from "react";
import Link from "next/link";
import { useOrder } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const STATUS_ACTIONS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  pending: { next: "confirmed", label: "Confirm Order" },
  confirmed: { next: "out_for_delivery", label: "Mark Out for Delivery" },
  out_for_delivery: { next: "delivered", label: "Mark Delivered" },
};

type Props = { params: Promise<{ id: string }> };

export default function AdminOrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: order, isLoading, isError, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-8">
        <p className="font-body text-sm text-error mb-4">
          {error?.message ?? "Order not found"}
        </p>
        <Link
          href="/admin/orders"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const nextAction = STATUS_ACTIONS[order.status];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/orders"
          className="font-body text-xs text-text-muted hover:text-primary transition-colors"
        >
          ← Orders
        </Link>
        <span className="text-text-muted">/</span>
        <span className="font-body text-xs text-text">#{order.orderToken}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text">
            Order #{order.orderToken}
          </h1>
          <p className="font-body text-xs text-text-muted mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {nextAction && (
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95">
              {nextAction.label}
            </button>
          )}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button className="flex items-center gap-2 border border-error/50 text-error px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Customer */}
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
            Customer
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Phone</span>
              <span className="text-text">+{order.phone}</span>
            </div>
            {order.email && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-text-muted">Email</span>
                <span className="text-text">{order.email}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Delivery</span>
              <span className="text-text capitalize">{order.deliveryMethod}</span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-text-muted">Address</span>
                <span className="text-text text-right max-w-[180px]">
                  {order.deliveryAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
            Payment
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Total</span>
              <span className="font-heading font-bold text-text">
                {formatPrice(order.total)}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Paid Upfront (50%)</span>
              <span className="text-secondary font-semibold">
                {formatPrice(Math.ceil(order.total / 2))}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Due on Delivery</span>
              <span
                className={
                  order.paymentPhase === "fully_paid"
                    ? "text-secondary font-semibold"
                    : "text-primary font-semibold"
                }
              >
                {order.paymentPhase === "fully_paid"
                  ? "Paid"
                  : formatPrice(Math.floor(order.total / 2))}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm pt-2 border-t border-border mt-1">
              <span className="text-text-muted">Payment Phase</span>
              <span className="text-text capitalize">
                {order.paymentPhase.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="border border-border bg-surface p-5">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
          Items
        </h2>
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  {item.product.brand}
                </p>
                <p className="font-body text-sm font-semibold text-text">
                  {item.product.name}
                </p>
                <p className="font-body text-xs text-text-muted">
                  Size {item.size} · ×{item.quantity}
                </p>
              </div>
              <p className="font-heading text-sm font-extrabold text-text">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp */}
      <div className="mt-5">
        <a
          href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`Hi! This is Kickcraft. Your order #${order.orderToken} status update:`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-secondary px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
        >
          <span className="material-symbols-outlined icon-outline text-[18px]">
            chat
          </span>
          Message Customer
        </a>
      </div>
    </div>
  );
}
