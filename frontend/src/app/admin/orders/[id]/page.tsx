"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminOrder, useUpdateOrderStatus, useUpdatePaymentPhase } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
];

const STATUS_META: Record<OrderStatus, { label: string; icon: string; color: string }> = {
  pending: { label: "Pending", icon: "hourglass_empty", color: "text-primary" },
  confirmed: { label: "Confirmed", icon: "check_circle", color: "text-secondary" },
  out_for_delivery: { label: "Out for Delivery", icon: "local_shipping", color: "text-[#ffb5a0]" },
  delivered: { label: "Delivered", icon: "where_to_vote", color: "text-secondary" },
  cancelled: { label: "Cancelled", icon: "cancel", color: "text-error" },
};

const STATUS_ACTIONS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  pending: { next: "confirmed", label: "Confirm Order" },
  confirmed: { next: "out_for_delivery", label: "Mark Out for Delivery" },
  out_for_delivery: { next: "delivered", label: "Mark Delivered" },
};

type Props = { params: Promise<{ id: string }> };

export default function AdminOrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: order, isLoading, isError, error } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentPhase();
  const [confirmCancel, setConfirmCancel] = useState(false);

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
  const isCancelled = order.status === "cancelled";
  const isTerminal = isCancelled || order.status === "delivered";
  const currentFlowIndex = STATUS_FLOW.indexOf(order.status);

  const handleAdvance = () => {
    if (!nextAction) return;
    updateStatus.mutate({ id: order.id, status: nextAction.next });
  };

  const handleCancelConfirm = () => {
    updateStatus.mutate(
      { id: order.id, status: "cancelled" },
      { onSuccess: () => setConfirmCancel(false) }
    );
  };

  const handleMarkDeliveryPaid = () => {
    updatePayment.mutate({ id: order.id, paymentPhase: "fully_paid" });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/admin/orders"
            className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined icon-outline text-[14px]">arrow_back</span>
            Orders
          </Link>
          <span className="text-text-muted text-[10px]">/</span>
          <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-text">
            #{order.orderToken}
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
              #{order.orderToken}
            </h1>
            <p className="font-body text-xs text-text-muted mt-0.5">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <OrderStatusBadge status={order.status} />
            {nextAction && (
              <button
                onClick={handleAdvance}
                disabled={updateStatus.isPending}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95 disabled:opacity-60"
              >
                {updateStatus.isPending ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  <span className="material-symbols-outlined icon-filled text-[14px]">
                    {STATUS_META[nextAction.next]?.icon ?? "check"}
                  </span>
                )}
                {nextAction.label}
              </button>
            )}
            {!isTerminal && (
              <button
                onClick={() => setConfirmCancel(true)}
                className="flex items-center gap-2 border border-error/40 text-error px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel confirm banner */}
      {confirmCancel && (
        <div className="border-l-4 border-error bg-error/5 px-5 py-4 flex items-center justify-between gap-4">
          <p className="font-body text-sm text-text">
            Cancel order <span className="font-semibold">#{order.orderToken}</span>? This cannot be undone.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setConfirmCancel(false)}
              disabled={updateStatus.isPending}
              className="px-3 py-1.5 font-body text-xs font-semibold text-text-muted border border-border hover:border-outline transition-colors disabled:opacity-60"
            >
              Keep
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 font-body text-xs font-semibold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {updateStatus.isPending && <Spinner size="sm" className="text-white" />}
              Cancel Order
            </button>
          </div>
        </div>
      )}

      {/* Status timeline */}
      {!isCancelled && (
        <div className="border border-border bg-surface p-5">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
            Order Progress
          </p>
          <div className="flex items-start gap-0">
            {STATUS_FLOW.map((s, i) => {
              const done = currentFlowIndex >= i;
              const current = currentFlowIndex === i;
              const meta = STATUS_META[s];
              const isLast = i === STATUS_FLOW.length - 1;
              return (
                <div key={s} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={cn(
                        "w-8 h-8 flex items-center justify-center border-2 transition-colors",
                        done
                          ? "bg-primary border-primary"
                          : "bg-surface-elevated border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined text-[16px]",
                          done ? "icon-filled text-white" : "icon-outline text-text-muted"
                        )}
                      >
                        {meta.icon}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "font-body text-[10px] font-semibold uppercase tracking-wider mt-1.5 text-center leading-tight",
                        current ? "text-primary" : done ? "text-text" : "text-text-muted"
                      )}
                    >
                      {meta.label}
                    </p>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mt-4 mx-1",
                        i < currentFlowIndex ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2-col body */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — items (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="border border-border bg-surface">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                Items
              </h2>
              <span className="font-body text-xs text-text-muted">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Product image or placeholder */}
                  <div className="w-14 h-14 shrink-0 bg-[#F5F5F5] relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined icon-outline text-[24px] text-text-muted/30">
                          inventory_2
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {item.productBrand}
                    </p>
                    <p className="font-body text-sm font-semibold text-text truncate">
                      {item.productName}
                    </p>
                    <p className="font-body text-xs text-text-muted mt-0.5">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-heading text-sm font-extrabold text-text">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="font-body text-[10px] text-text-muted">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-border bg-surface-elevated space-y-2">
              <div className="flex justify-between font-body text-xs text-text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between font-body text-xs text-text-muted">
                  <span>Delivery</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-heading text-sm font-extrabold text-text pt-2 border-t border-border mt-1">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar (1/3) */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="border border-border bg-surface">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                Customer
              </h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-filled text-[18px] text-primary">
                    person
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-text">+{order.phone}</p>
                  {order.email && (
                    <p className="font-body text-xs text-text-muted truncate">{order.email}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-body text-xs text-text-muted shrink-0">Delivery</p>
                  <div className="flex items-center gap-1.5 text-right">
                    <span className="material-symbols-outlined icon-outline text-[13px] text-text-muted">
                      {order.deliveryMethod === "pickup" ? "store" : "local_shipping"}
                    </span>
                    <p className="font-body text-xs font-semibold text-text capitalize">
                      {order.deliveryMethod}
                    </p>
                  </div>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-body text-xs text-text-muted shrink-0">Address</p>
                    <p className="font-body text-xs text-text text-right max-w-[150px]">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}
              </div>

              <a
                href={`https://wa.me/${order.phone}?text=${encodeURIComponent(
                  `Hi! This is Kickcraft. Your order #${order.orderToken} update:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-secondary/40 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors mt-2"
              >
                <span className="material-symbols-outlined icon-outline text-[16px]">chat</span>
                WhatsApp Customer
              </a>
            </div>
          </div>

          {/* Payment */}
          <div className="border border-border bg-surface">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                Payment
              </h2>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              <div className="flex justify-between">
                <p className="font-body text-xs text-text-muted">Subtotal</p>
                <p className="font-heading text-sm font-extrabold text-text">
                  {formatPrice(order.subtotal)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-body text-xs text-text-muted">Upfront (50%)</p>
                <p className="font-body text-xs font-semibold text-secondary">
                  {formatPrice(Math.ceil(order.subtotal / 2))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-body text-xs text-text-muted">On Delivery (50%)</p>
                <p
                  className={cn(
                    "font-body text-xs font-semibold",
                    order.paymentPhase === "fully_paid" ? "text-secondary" : "text-primary"
                  )}
                >
                  {order.paymentPhase === "fully_paid"
                    ? "Paid"
                    : formatPrice(Math.floor(order.subtotal / 2))}
                </p>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between">
                <p className="font-body text-xs text-text-muted">Phase</p>
                <p className="font-body text-xs font-semibold text-text capitalize">
                  {order.paymentPhase.replace(/_/g, " ")}
                </p>
              </div>
              {order.paymentPhase === "upfront_paid" && order.status === "delivered" && (
                <button
                  onClick={handleMarkDeliveryPaid}
                  disabled={updatePayment.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/40 text-secondary px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-secondary/20 transition-colors disabled:opacity-60 mt-1"
                >
                  {updatePayment.isPending && <Spinner size="sm" className="text-secondary" />}
                  Mark Delivery Paid
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
