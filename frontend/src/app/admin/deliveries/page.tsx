"use client";

import Link from "next/link";
import { useMyOrders } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDeliveriesPage() {
  const { data: orders, isLoading, isError } = useMyOrders();

  const deliveryOrders = (orders ?? []).filter(
    (o) =>
      o.deliveryMethod === "delivery" &&
      (o.status === "confirmed" || o.status === "out_for_delivery")
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Deliveries
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Active home delivery orders
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <p className="font-body text-sm text-error py-8">Failed to load</p>
      ) : deliveryOrders.length === 0 ? (
        <div className="border border-border bg-surface p-10 text-center">
          <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/30 mb-3 block">
            local_shipping
          </span>
          <p className="font-body text-sm text-text-muted">
            No active deliveries
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {deliveryOrders.map((order) => (
            <div
              key={order.id}
              className="border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-heading text-sm font-extrabold uppercase tracking-tight text-text hover:text-primary transition-colors"
                  >
                    #{order.orderToken}
                  </Link>
                  <p className="font-body text-xs text-text-muted mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 font-body text-sm text-text-muted">
                  <span className="material-symbols-outlined icon-outline text-[16px]">
                    location_on
                  </span>
                  <span className="text-text">
                    {order.deliveryAddress ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-text-muted">
                  <span className="material-symbols-outlined icon-outline text-[16px]">
                    phone
                  </span>
                  <span className="text-text">+{order.phone}</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-text-muted">
                  <span className="material-symbols-outlined icon-outline text-[16px]">
                    payments
                  </span>
                  <span className="text-text">
                    Due on delivery:{" "}
                    <span className="text-primary font-semibold">
                      {formatPrice(Math.floor(order.total / 2))}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`Hi! Kickcraft here. Your order #${order.orderToken} is on its way!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-secondary px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
                >
                  <span className="material-symbols-outlined icon-outline text-[14px]">
                    chat
                  </span>
                  Notify Customer
                </a>
                {order.status === "confirmed" && (
                  <button className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                    Mark Out for Delivery
                  </button>
                )}
                {order.status === "out_for_delivery" && (
                  <button className="flex items-center gap-1 bg-secondary text-background px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity">
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
