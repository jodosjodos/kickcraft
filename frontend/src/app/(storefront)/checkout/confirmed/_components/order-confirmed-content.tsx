"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface StoredOrderItem {
  name: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string | null;
}

interface StoredOrder {
  orderNumber: string;
  items: StoredOrderItem[];
  subtotal: number;
  deliveryFee: number;
  orderTotal: number;
  upfront: number;
  onDelivery: number;
  deliveryMethod: "delivery" | "pickup";
  deliveryAddress: string | null;
  phone: string;
}

export function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "KC-00000";
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("last_order");
      if (raw) setOrder(JSON.parse(raw) as StoredOrder);
    } catch {}
  }, []);

  const whatsappMsg = encodeURIComponent(
    `Hi! I just placed order #${orderNumber} on Kickcraft. Can you confirm my order and delivery details?`
  );

  const subtotal = order?.subtotal ?? 0;
  const deliveryFee = order?.deliveryFee ?? 0;
  const orderTotal = order?.orderTotal ?? 0;
  const onDelivery = order?.onDelivery ?? 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-5 py-12 md:py-16">
      <div className="w-full max-w-lg">
        {/* Check icon — square bordered */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 border-2 border-primary flex items-center justify-center"
            style={{ animation: "scale-up 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <span className="material-symbols-outlined icon-outline text-[32px] text-primary">
              check
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text text-center mb-3"
          style={{ animation: "fade-up 0.4s ease both", animationDelay: "0.1s" }}
        >
          Order Confirmed!
        </h1>

        {/* Subtitle */}
        <p
          className="font-body text-sm text-text-muted text-center mb-2"
          style={{ animation: "fade-up 0.4s ease both", animationDelay: "0.18s" }}
        >
          We&apos;ll call you within 30 minutes to confirm delivery details.
        </p>
        <p
          className="font-body text-sm text-text-muted text-center"
          style={{ animation: "fade-up 0.4s ease both", animationDelay: "0.22s" }}
        >
          Your receipt has been sent to your email.
        </p>

        {/* Orange divider */}
        <div
          className="h-px bg-primary mt-8 mb-8 w-full"
          style={{ animation: "fade-in 0.4s ease both", animationDelay: "0.28s" }}
        />

        {/* Order summary card */}
        <div
          className="border border-border bg-surface-elevated w-full"
          style={{ animation: "fade-up 0.4s ease both", animationDelay: "0.32s" }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Order Summary
            </p>
            <p className="font-heading text-base font-extrabold text-text">
              #{orderNumber}
            </p>
          </div>

          {/* Items */}
          {order?.items && order.items.length > 0 ? (
            <div className="divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 shrink-0 bg-product-card relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined icon-outline text-[20px] text-text-muted/40">
                          footwear
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xs font-extrabold uppercase tracking-tight text-text truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-[11px] text-text-muted mt-0.5">
                      Size: {item.size}
                      {item.quantity > 1 && ` · ×${item.quantity}`}
                    </p>
                  </div>
                  <p className="font-heading text-sm font-extrabold text-text shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6">
              <p className="font-body text-sm text-text-muted text-center">
                No item details available
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="px-5 py-4 border-t border-border flex flex-col gap-2">
            <div className="flex justify-between font-body text-sm text-text-muted">
              <span>Subtotal</span>
              <span className="text-text">{formatPrice(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between font-body text-sm text-text-muted">
                <span>Shipping (Kigali Express)</span>
                <span className="text-text">{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm">
              <span className="font-bold uppercase tracking-wider text-text">Amount Paid</span>
              <span className="font-bold text-text">{formatPrice(orderTotal - onDelivery)}</span>
            </div>
            <div className="flex justify-between items-baseline mt-1">
              <span className="font-body text-xs font-bold uppercase tracking-[0.12em] text-primary">
                Amount Due at Delivery
              </span>
              <span className="font-heading text-2xl font-extrabold text-primary">
                {formatPrice(onDelivery)}
              </span>
            </div>
          </div>

          {/* Delivery address */}
          {order?.deliveryAddress && (
            <div className="px-5 pb-5">
              <div className="border border-border bg-surface p-4">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-2">
                  Delivery Address
                </p>
                <p className="font-body text-sm text-text">{order.deliveryAddress}</p>
                {order.phone && (
                  <p className="font-body text-sm text-text-muted mt-1">
                    Contact: +250 {order.phone}
                  </p>
                )}
              </div>
            </div>
          )}
          {order?.deliveryMethod === "pickup" && (
            <div className="px-5 pb-5">
              <div className="border border-border bg-surface p-4">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-1">
                  Pickup Location
                </p>
                <p className="font-body text-sm text-text">Kickcraft Store, Kigali</p>
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col gap-3 mt-5"
          style={{ animation: "fade-up 0.4s ease both", animationDelay: "0.4s" }}
        >
          <a
            href={`https://wa.me/250794050537?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-secondary text-background py-4 font-body text-sm font-bold uppercase tracking-wider hover:bg-secondary/90 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined icon-filled text-[18px]">
              chat
            </span>
            Track via WhatsApp
          </a>

          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 border border-border text-text py-4 font-body text-sm font-bold uppercase tracking-wider hover:border-outline hover:text-text active:scale-[0.99] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
