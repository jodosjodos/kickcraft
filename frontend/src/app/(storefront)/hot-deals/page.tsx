"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSaleProducts } from "@/hooks/api/use-products";
import { ProductCard } from "@/components/product/product-card";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";

const SALE_END = new Date();
SALE_END.setHours(SALE_END.getHours() + 47, 59, 59, 0);

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h, m, s });
    }
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-surface-elevated border border-border rounded px-4 py-3 min-w-[64px] text-center">
        <span className="font-heading text-3xl md:text-4xl font-extrabold text-text tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </span>
    </div>
  );
}

export default function HotDealsPage() {
  const { data: products, isLoading, isError } = useSaleProducts();
  const { h, m, s } = useCountdown(SALE_END);

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded border border-border bg-surface-elevated mb-10 px-6 py-10 md:py-14 text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <p className="relative font-body text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Flash Sale
        </p>
        <h1 className="relative font-heading text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-text mb-2">
          Hot Deals
        </h1>
        <p className="relative font-body text-sm text-text-muted mb-8 max-w-sm mx-auto">
          Exclusive discounts on premium kicks. Sale ends when the timer hits zero.
        </p>

        {/* Countdown */}
        <div className="relative flex items-start justify-center gap-3 md:gap-4">
          <Digit value={h} label="Hours" />
          <span className="font-heading text-3xl md:text-4xl font-extrabold text-primary mt-3">
            :
          </span>
          <Digit value={m} label="Mins" />
          <span className="font-heading text-3xl md:text-4xl font-extrabold text-primary mt-3">
            :
          </span>
          <Digit value={s} label="Secs" />
        </div>
      </div>

      {/* Deals section heading */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
            All deals
          </p>
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
            On Sale Now
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center gap-1 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
        >
          Browse all →
        </Link>
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-primary" />
        </div>
      )}

      {isError && (
        <div className="py-20 text-center">
          <p className="font-body text-sm text-error">Failed to load deals</p>
        </div>
      )}

      {products && products.length === 0 && (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/40 mb-4 block">
            sell
          </span>
          <p className="font-heading text-lg font-bold uppercase tracking-tight text-text mb-2">
            No active deals
          </p>
          <p className="font-body text-sm text-text-muted">
            Check back soon — new sales drop every week.
          </p>
        </div>
      )}

      {products && products.length > 0 && (
        <>
          {/* Stats strip */}
          <div className="flex items-center gap-6 mb-6 p-4 bg-surface-elevated rounded border border-border">
            <div>
              <p className="font-heading text-xl font-extrabold text-primary">
                {products.length}
              </p>
              <p className="font-body text-xs text-text-muted">deals active</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-heading text-xl font-extrabold text-primary">
                Up to{" "}
                {Math.max(
                  ...products.map((p) =>
                    p.originalPrice
                      ? Math.round(
                          ((p.originalPrice - p.price) / p.originalPrice) * 100
                        )
                      : 0
                  )
                )}
                % off
              </p>
              <p className="font-body text-xs text-text-muted">max savings</p>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <p className="font-heading text-xl font-extrabold text-secondary">
                {formatPrice(Math.min(...products.map((p) => p.price)))}
              </p>
              <p className="font-body text-xs text-text-muted">lowest price</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
