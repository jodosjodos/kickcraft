"use client";

import Link from "next/link";
import { useFeaturedProducts } from "@/hooks/api/use-products";
import { ProductCard } from "@/components/product/product-card";
import { Spinner } from "@/components/ui/spinner";

export function FeaturedSection() {
  const { data: products, isLoading, isError } = useFeaturedProducts();

  return (
    <section className="py-20 px-5 md:px-8 bg-surface">
      <div className="mx-auto max-w-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-secondary mb-1">
              Just in
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text">
              Fresh Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-primary" />
          </div>
        )}

        {isError && (
          <p className="text-center font-body text-sm text-error py-16">
            Could not load products. Please try again.
          </p>
        )}

        {products && (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
              {products.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[200px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Mobile: view all link */}
            <div className="md:hidden mt-6 text-center">
              <Link
                href="/shop"
                className="font-body text-sm font-semibold uppercase tracking-wider text-primary hover:underline underline-offset-4"
              >
                View all →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
