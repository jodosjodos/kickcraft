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
      <div className="max-w-container mx-auto px-5 md:px-4 py-16 text-center">
        <span className="material-symbols-outlined icon-outline text-[64px] text-text-muted/30 mb-6 block">
          shopping_bag
        </span>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-3">
          Your cart is empty
        </h1>
        <p className="font-body text-sm text-text-muted mb-8">
          Browse our shoes and add something you love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider transition-all duration-200 bg-primary text-white hover:bg-primary-inverse active:scale-95 h-12 px-8 text-base"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const deliveryFee = total >= 20000 ? 0 : 2000;
  const orderTotal = total + deliveryFee;

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-8">
        Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Items */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-border bg-surface p-4"
            >
              {/* Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 relative bg-product-card overflow-hidden rounded">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined icon-outline text-[32px] text-text-muted/40">
                      footwear
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                  {item.brand}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-heading text-sm font-bold uppercase tracking-tight text-text hover:text-primary transition-colors truncate"
                >
                  {item.name}
                </Link>
                <p className="font-body text-xs text-text-muted">
                  Size: <span className="text-text font-semibold">{item.size}</span>
                </p>
                <p className="font-heading text-sm font-extrabold text-primary">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Qty + remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-text-muted hover:text-error transition-colors p-1"
                  aria-label="Remove item"
                >
                  <span className="material-symbols-outlined icon-outline text-[18px]">
                    close
                  </span>
                </button>

                <div className="flex items-center border border-border">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-text hover:bg-surface-elevated transition-colors"
                  >
                    <span className="material-symbols-outlined icon-outline text-[16px]">
                      remove
                    </span>
                  </button>
                  <span className="w-8 text-center font-body text-sm font-semibold text-text">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-text hover:bg-surface-elevated transition-colors"
                  >
                    <span className="material-symbols-outlined icon-outline text-[16px]">
                      add
                    </span>
                  </button>
                </div>

                <p className="font-heading text-sm font-extrabold text-text">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="border border-border bg-surface p-6 sticky top-[120px]">
            <h2 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex justify-between font-body text-sm text-text-muted">
                <span>Subtotal</span>
                <span className="text-text">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-text-muted">
                <span>Delivery (Kigali)</span>
                <span className={cn(deliveryFee === 0 ? "text-secondary font-semibold" : "text-text")}>
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                  Total
                </span>
                <span className="font-heading text-base font-extrabold text-primary">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>

            <div className="mb-3 p-3 bg-secondary/10 border border-secondary/20">
              <p className="font-body text-xs text-secondary font-semibold">
                50/50 MoMo Payment
              </p>
              <p className="font-body text-xs text-text-muted mt-1">
                Pay {formatPrice(Math.ceil(orderTotal / 2))} now + {formatPrice(Math.floor(orderTotal / 2))} on delivery
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider transition-all duration-200 bg-primary text-white hover:bg-primary-inverse active:scale-95 h-12 px-8 text-base"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="mt-4 block text-center font-body text-sm text-text-muted hover:text-primary transition-colors underline underline-offset-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
