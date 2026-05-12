"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import type { Product } from "@/types/api/products";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const primaryImage = product.images[0];
  const wishlisted = isWishlisted(product.id);
  const isOnSale = product.originalPrice !== undefined && product.originalPrice > product.price;

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded border border-border bg-surface overflow-hidden",
        "hover:border-outline transition-colors duration-200",
        className
      )}
    >
      {/* Image area */}
      <div className="aspect-square bg-product-card relative overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-all duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
            <span className="material-symbols-outlined icon-outline text-[64px] text-text-muted/30">
              footwear
            </span>
          </div>
        )}

        {/* Badges */}
        {product.isNew && product.status !== "sold" && (
          <span className="absolute top-2 left-2 bg-secondary text-background font-body text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            New
          </span>
        )}
        {isOnSale && !product.isNew && product.status !== "sold" && (
          <span className="absolute top-2 left-2 bg-primary text-white font-body text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Sale
          </span>
        )}

        {product.stock <= 3 && product.stock > 0 && product.status !== "sold" && (
          <span className="absolute top-2 right-2 bg-error/90 text-background font-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}

        {product.status === "sold" && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-heading text-sm font-bold uppercase tracking-widest text-text-muted">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
            "opacity-0 group-hover:opacity-100 focus:opacity-100",
            wishlisted
              ? "bg-primary text-white opacity-100"
              : "bg-background/80 text-text-muted hover:text-primary"
          )}
        >
          <span
            className={cn(
              "material-symbols-outlined text-[18px] leading-none",
              wishlisted ? "icon-fill" : "icon-outline"
            )}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Details */}
      <div className="p-3 md:p-4">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-0.5">
          {product.brand}
        </p>
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-text truncate mb-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <p className="font-heading text-base font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          {isOnSale && (
            <p className="font-body text-xs text-text-muted line-through">
              {formatPrice(product.originalPrice!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
