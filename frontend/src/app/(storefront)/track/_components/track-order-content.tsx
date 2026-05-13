"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useOrderByToken } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "out_for_delivery", "delivered"];

const STATUS_META: Record<OrderStatus, { label: string; icon: string }> = {
  pending: { label: "Pending", icon: "hourglass_empty" },
  confirmed: { label: "Confirmed", icon: "check_circle" },
  out_for_delivery: { label: "Out for Delivery", icon: "local_shipping" },
  delivered: { label: "Delivered", icon: "where_to_vote" },
  cancelled: { label: "Cancelled", icon: "cancel" },
};

export function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [inputToken, setInputToken] = useState("");
  const [searchToken, setSearchToken] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInputToken(token);
      setSearchToken(token);
    }
  }, [searchParams]);

  const { data: order, isLoading, isError, isFetched } = useOrderByToken(searchToken);

  const isCancelled = order?.status === "cancelled";
  const currentFlowIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputToken.trim().toUpperCase();
    if (trimmed) setSearchToken(trimmed);
  }

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-12 md:py-16">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-1">
            Order Tracking
          </p>
          <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text">
            Track Your Order
          </h1>
          <p className="font-body text-sm text-text-muted mt-2">
            Enter your order number (e.g. KC-12345) to see your order status.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="KC-12345"
            className="flex-1 px-4 py-3 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors uppercase"
          />
          <button
            type="submit"
            disabled={!inputToken.trim() || isLoading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 font-body text-sm font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <span className="material-symbols-outlined icon-outline text-[18px]">search</span>
            )}
            Track
          </button>
        </form>

        {/* Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" className="text-primary" />
          </div>
        )}

        {isError && isFetched && (
          <div className="border border-error/30 bg-error/5 px-5 py-4">
            <p className="font-body text-sm text-error font-semibold">
              Order not found. Double-check your order number and try again.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-5">
            {/* Order header */}
            <div className="border border-border bg-surface p-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-extrabold uppercase tracking-tight text-text">
                  #{order.orderToken}
                </p>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

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
                                : "bg-surface-elevated border-border",
                            )}
                          >
                            <span
                              className={cn(
                                "material-symbols-outlined text-[16px]",
                                done ? "icon-filled text-white" : "icon-outline text-text-muted",
                              )}
                            >
                              {meta.icon}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "font-body text-[10px] font-semibold uppercase tracking-wider mt-1.5 text-center leading-tight",
                              current ? "text-primary" : done ? "text-text" : "text-text-muted",
                            )}
                          >
                            {meta.label}
                          </p>
                        </div>
                        {!isLast && (
                          <div
                            className={cn(
                              "flex-1 h-0.5 mt-4 mx-1",
                              i < currentFlowIndex ? "bg-primary" : "bg-border",
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="border border-border bg-surface">
              <div className="px-5 py-3.5 border-b border-border">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                  Items
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4">
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
                    <p className="font-heading text-sm font-extrabold text-text shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
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
                {(order.discountAmount ?? 0) > 0 && (
                  <div className="flex justify-between font-body text-xs text-secondary">
                    <span>Discount</span>
                    <span>−{formatPrice(order.discountAmount ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-heading text-sm font-extrabold text-text pt-2 border-t border-border mt-1">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            {order.deliveryAddress && (
              <div className="border border-border bg-surface px-5 py-4 space-y-2">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Delivery Address
                </p>
                <p className="font-body text-sm text-text">{order.deliveryAddress}</p>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/250794050537?text=${encodeURIComponent(`Hi! I have a question about my order #${order.orderToken}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-secondary/40 px-4 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
            >
              <span className="material-symbols-outlined icon-outline text-[18px]">chat</span>
              Questions? Chat with us on WhatsApp
            </a>

            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 w-full border border-border px-4 py-3 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-text hover:border-outline transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
