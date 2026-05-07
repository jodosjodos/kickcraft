"use client";

import { use } from "react";
import Link from "next/link";
import { useOrder } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const TRACKING_STEPS: { status: OrderStatus; label: string; icon: string }[] =
  [
    { status: "pending", label: "Order Placed", icon: "receipt" },
    { status: "confirmed", label: "Confirmed", icon: "check_circle" },
    { status: "out_for_delivery", label: "Out for Delivery", icon: "local_shipping" },
    { status: "delivered", label: "Delivered", icon: "done_all" },
  ];

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
];

function TrackingTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-4">
        <span className="material-symbols-outlined icon-outline text-[20px] text-error">
          cancel
        </span>
        <span className="font-body text-sm text-error font-semibold">
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="flex flex-col gap-0">
      {TRACKING_STEPS.map((step, i) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const done = stepIndex < currentIndex;
        const active = stepIndex === currentIndex;
        const upcoming = stepIndex > currentIndex;

        return (
          <div key={step.status} className="flex gap-4">
            {/* Connector + icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors",
                  done
                    ? "bg-secondary border-secondary"
                    : active
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[16px]",
                    done ? "icon-filled" : "icon-outline",
                    done
                      ? "text-background"
                      : active
                      ? "text-white"
                      : "text-text-muted"
                  )}
                >
                  {done ? "check" : step.icon}
                </span>
              </div>
              {i < TRACKING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[32px]",
                    done ? "bg-secondary" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-8 flex items-start pt-1">
              <p
                className={cn(
                  "font-body text-sm",
                  active
                    ? "text-primary font-semibold"
                    : done
                    ? "text-text"
                    : upcoming
                    ? "text-text-muted"
                    : "text-text-muted"
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Props = { params: Promise<{ id: string }> };

export default function OrderDetailPage({ params }: Props) {
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
          href="/account/orders"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const upfront = Math.ceil(order.total / 2);
  const onDelivery = Math.floor(order.total / 2);
  const isPaid = order.paymentPhase === "fully_paid";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/account/orders"
          className="font-body text-xs text-text-muted hover:text-primary transition-colors"
        >
          ← Orders
        </Link>
        <span className="text-text-muted">/</span>
        <span className="font-body text-xs text-text">
          #{order.orderToken}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text">
            Order #{order.orderToken}
          </h1>
          <p className="font-body text-xs text-text-muted mt-1">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tracking */}
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-5">
            Tracking
          </h2>
          <TrackingTimeline status={order.status} />
        </div>

        {/* Delivery info */}
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
            Delivery Details
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Method</span>
              <span className="text-text capitalize">
                {order.deliveryMethod === "pickup"
                  ? "Store Pickup"
                  : "Home Delivery"}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-text-muted">Address</span>
                <span className="text-text text-right max-w-[180px]">
                  {order.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm">
              <span className="text-text-muted">Phone</span>
              <span className="text-text">+{order.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 border border-border bg-surface p-5">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
          Items
        </h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                  {item.product.brand}
                </p>
                <p className="font-body text-sm text-text font-semibold">
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

      {/* Payment */}
      <div className="mt-4 border border-border bg-surface p-5">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
          Payment
        </h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-body text-sm text-text-muted">
            <span>Order Total</span>
            <span className="text-text">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between font-body text-sm text-text-muted">
            <span>Paid Upfront (50%)</span>
            <span className="text-secondary font-semibold">
              {formatPrice(upfront)}
            </span>
          </div>
          <div className="flex justify-between font-body text-sm text-text-muted">
            <span>Due on Delivery (50%)</span>
            <span className={isPaid ? "text-secondary font-semibold" : "text-primary font-semibold"}>
              {isPaid ? "Paid" : formatPrice(onDelivery)}
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-6">
        <a
          href={`https://wa.me/250788000000?text=${encodeURIComponent(`Hi! I have a question about order #${order.orderToken}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-secondary px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
        >
          <span className="material-symbols-outlined icon-outline text-[18px]">
            chat
          </span>
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
