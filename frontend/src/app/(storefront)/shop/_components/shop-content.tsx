"use client";

import { Suspense } from "react";
import { useProducts } from "@/hooks/api/use-products";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { SortOption } from "@/types/api/products";

function ShopGrid({ defaultCategory }: { defaultCategory?: string }) {
  const searchParams = useSearchParams();

  const filters = {
    category: searchParams.get("category") ?? defaultCategory ?? undefined,
    size: searchParams.get("size") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sort: (searchParams.get("sort") as SortOption) ?? undefined,
    search: searchParams.get("q") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 12,
  };

  const { data, isLoading, isError, error } = useProducts(filters);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="font-body text-sm text-error">
          {error?.message ?? "Failed to load products"}
        </p>
      </div>
    );
  }

  const products = data?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/40 mb-4 block">
          search_off
        </span>
        <p className="font-heading text-lg font-bold uppercase tracking-tight text-text mb-2">
          No shoes found
        </p>
        <p className="font-body text-sm text-text-muted">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {data && data.total > data.limit && (
        <Pagination
          page={filters.page ?? 1}
          total={data.total}
          limit={data.limit}
        />
      )}
    </>
  );
}

function Pagination({
  page,
  total,
  limit,
}: {
  page: number;
  total: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-10 pb-2">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="font-body text-sm text-text-muted hover:text-primary disabled:opacity-30 transition-colors"
      >
        ← Prev
      </button>
      <span className="font-body text-sm text-text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="font-body text-sm text-text-muted hover:text-primary disabled:opacity-30 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

function MobileFilterBar() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1 md:hidden">
      <Suspense fallback={null}>
        <SortDropdown />
      </Suspense>
    </div>
  );
}

export function ShopContent({
  title,
  defaultCategory,
}: {
  title: string;
  defaultCategory?: string;
}) {
  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text">
          {title}
        </h1>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop only */}
        <aside className="hidden md:block w-52 shrink-0">
          <Suspense fallback={null}>
            <ProductFilters defaultCategory={defaultCategory} />
          </Suspense>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <MobileFilterBar />
            <div className="hidden md:block ml-auto">
              <Suspense fallback={null}>
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg" className="text-primary" />
              </div>
            }
          >
            <ShopGrid defaultCategory={defaultCategory} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
