"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-5 md:px-8 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined icon-outline text-[36px] text-text-muted/40">
            shopping_bag
          </span>
        </div>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-3">
          Your bag is empty
        </h1>
        <p className="font-body text-sm text-text-muted mb-8">
          Browse our collection and add something you love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm uppercase tracking-wider px-8 py-3 hover:bg-primary-inverse active:scale-95 transition-all"
        >
          Shop Now
          <span className="material-symbols-outlined icon-outline text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    );
  }

  const deliveryFee = total >= 20000 ? 0 : 2000;
  const orderTotal = total + deliveryFee;

  return (
    <div className="max-w-container mx-auto px-5 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Shopping Bag
        </h1>
        <span className="font-body text-xs font-bold uppercase tracking-wider text-text-muted bg-surface-elevated border border-border px-2.5 py-1">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Items list */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-border bg-surface p-4 hover:border-outline transition-colors duration-150 group"
            >
              {/* Product image */}
              <Link
                href={`/products/${item.slug}`}
                className="w-24 h-24 md:w-28 md:h-28 shrink-0 relative bg-product-card overflow-hidden"
                tabIndex={-1}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined icon-outline text-[36px] text-text-muted/30">
                      footwear
                    </span>
                  </div>
                )}
              </Link>

              {/* Info column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-primary mb-0.5">
                    {item.brand}
                  </p>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-heading text-sm font-extrabold tracking-tight text-text hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="font-body text-xs text-text-muted mt-1">
                    Size <span className="font-semibold text-text">{item.size}</span>
                  </p>
                </div>
                <p className="font-heading text-base font-extrabold text-text mt-2">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Controls column */}
              <div className="flex flex-col items-end justify-between shrink-0">
                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-text-muted/50 hover:text-error transition-colors"
                  aria-label="Remove"
                >
                  <span className="material-symbols-outlined icon-outline text-[18px]">
                    close
                  </span>
                </button>

                {/* Qty stepper */}
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-surface-elevated hover:text-text transition-colors"
                    aria-label="Decrease"
                  >
                    <span className="material-symbols-outlined icon-outline text-[14px]">
                      remove
                    </span>
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center font-body text-sm font-bold text-text border-x border-border">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-surface-elevated hover:text-text transition-colors"
                    aria-label="Increase"
                  >
                    <span className="material-symbols-outlined icon-outline text-[14px]">
                      add
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="border border-border bg-surface sticky top-[120px]">
            {/* Summary header */}
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                Order Summary
              </h2>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex justify-between font-body text-sm text-text-muted">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span className="text-text font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-text-muted">
                <span>Delivery (Kigali)</span>
                <span
                  className={cn(
                    "font-semibold",
                    deliveryFee === 0 ? "text-secondary" : "text-text"
                  )}
                >
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </span>
              </div>

              {deliveryFee === 0 && (
                <div className="flex items-center gap-1.5 bg-secondary/5 border border-secondary/20 px-3 py-2">
                  <span className="material-symbols-outlined icon-filled text-[14px] text-secondary">
                    check_circle
                  </span>
                  <p className="font-body text-xs text-secondary font-semibold">
                    You qualify for free delivery!
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                  Total
                </span>
                <span className="font-heading text-lg font-extrabold text-primary">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>

            {/* MoMo info */}
            <div className="mx-5 mb-4 p-4 bg-secondary/5 border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined icon-filled text-[16px] text-secondary">
                  payments
                </span>
                <p className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                  50/50 MoMo Payment
                </p>
              </div>
              <p className="font-body text-xs text-text-muted leading-relaxed">
                Pay{" "}
                <span className="text-text font-semibold">
                  {formatPrice(Math.ceil(orderTotal / 2))}
                </span>{" "}
                now via MTN Mobile Money, then{" "}
                <span className="text-text font-semibold">
                  {formatPrice(Math.floor(orderTotal / 2))}
                </span>{" "}
                on delivery.
              </p>
            </div>

            <div className="px-5 pb-5 flex flex-col gap-2">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-body font-bold text-sm uppercase tracking-wider h-12 hover:bg-primary-inverse active:scale-[0.99] transition-all"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined icon-outline text-[16px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/shop"
                className="block text-center font-body text-xs text-text-muted hover:text-primary transition-colors py-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
