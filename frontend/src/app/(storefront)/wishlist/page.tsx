"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/providers/wishlist-provider";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { items, remove, count } = useWishlist();

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
          Saved items
        </p>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text">
          My Wishlist
          {count > 0 && (
            <span className="ml-3 font-body text-base font-semibold text-text-muted normal-case tracking-normal">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          )}
        </h1>
      </div>

      {count === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="material-symbols-outlined icon-outline text-[64px] text-text-muted/30">
            favorite
          </span>
          <p className="font-heading text-xl font-bold uppercase tracking-tight text-text">
            Nothing saved yet
          </p>
          <p className="font-body text-sm text-text-muted text-center max-w-xs">
            Tap the heart on any product to save it here. Items expire after 30 days.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-2 bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-primary-inverse active:scale-95 transition-all duration-200"
          >
            Browse Shoes
            <span className="material-symbols-outlined icon-outline text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col rounded border border-border bg-surface overflow-hidden hover:border-outline transition-colors duration-200"
              >
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="aspect-square bg-product-card relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                        <span className="material-symbols-outlined icon-outline text-[64px] text-text-muted/30">
                          footwear
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => remove(item.productId)}
                  aria-label="Remove from wishlist"
                  className={cn(
                    "absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full",
                    "bg-background/80 text-primary opacity-0 group-hover:opacity-100 focus:opacity-100",
                    "hover:bg-primary hover:text-white transition-all duration-200"
                  )}
                >
                  <span className="material-symbols-outlined icon-fill text-[16px] leading-none">
                    favorite
                  </span>
                </button>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                    {item.brand}
                  </p>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-text truncate hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-heading text-base font-extrabold text-primary mt-auto pt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-3 pb-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="block w-full text-center bg-primary text-white font-body text-xs font-semibold uppercase tracking-wider py-2.5 rounded hover:bg-primary-inverse transition-colors duration-150"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
            >
              Continue Shopping
              <span className="material-symbols-outlined icon-outline text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
