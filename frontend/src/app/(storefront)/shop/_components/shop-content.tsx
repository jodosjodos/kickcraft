"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/api/use-products";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SortOption, SubCategory, Product } from "@/types/api/products";

const CATEGORY_TITLES: Record<string, string> = {
  men: "Men's Shoes",
  women: "Women's Shoes",
  kids: "Kids' Shoes",
  sports: "Sports Shoes",
};

function TitleBar() {
  const searchParams = useSearchParams();
  const categories = searchParams.getAll("category");
  const q = searchParams.get("q");

  let title = "Shop All Shoes";
  if (categories.length === 1 && CATEGORY_TITLES[categories[0]]) {
    title = CATEGORY_TITLES[categories[0]];
  } else if (q) {
    title = `Results for "${q}"`;
  }

  return (
    <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text">
      {title}
    </h1>
  );
}

function EditorsPick({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col md:flex-row overflow-hidden rounded border border-border bg-surface mb-6 hover:border-outline transition-colors duration-200"
    >
      <span className="absolute top-3 left-3 z-10 bg-primary text-white font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
        Editor&apos;s Pick
      </span>

      <div className="relative w-full md:w-[42%] aspect-4/3 md:aspect-auto bg-product-card overflow-hidden shrink-0">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined icon-outline text-[80px] text-text-muted/20">
              footwear
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center p-6 md:p-10 gap-3">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          {product.brand}
        </p>
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-sm text-text-muted leading-relaxed max-w-md line-clamp-2">
          {product.description}
        </p>
        <p className="font-heading text-2xl font-extrabold text-primary mt-1">
          {formatPrice(product.price)}
        </p>
        <span className="inline-flex items-center justify-center gap-2 self-start bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-primary-inverse active:scale-95 transition-all duration-200 mt-2">
          Add to Bag
          <span className="material-symbols-outlined icon-outline text-[16px]">
            shopping_bag
          </span>
        </span>
      </div>
    </Link>
  );
}

function ShopGrid() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const categoryParams = searchParams.getAll("category");
  const subCategoryParams = searchParams.getAll("subCategory");

  const filters = {
    category: categoryParams.length > 0 ? categoryParams : undefined,
    subCategory:
      subCategoryParams.length > 0
        ? (subCategoryParams as SubCategory[])
        : undefined,
    size: searchParams.get("size") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sort: (searchParams.get("sort") as SortOption) ?? undefined,
    search: searchParams.get("q") ?? undefined,
    page: 1,
    limit: page * 9,
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
  const total = data?.total ?? 0;
  const shown = products.length;

  const hasActiveFilters =
    (Array.isArray(filters.category)
      ? filters.category.length > 0
      : !!filters.category) ||
    (Array.isArray(filters.subCategory)
      ? filters.subCategory.length > 0
      : !!filters.subCategory) ||
    filters.size ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search;
  const editorsPick =
    !hasActiveFilters && products.length > 0 ? products[0] : null;
  const gridProducts = editorsPick ? products.slice(1) : products;

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
      {editorsPick && <EditorsPick product={editorsPick} />}

      <div className={cn("grid gap-3 md:gap-4", "grid-cols-2 md:grid-cols-3")}>
        {gridProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {shown < total && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="font-body text-sm font-semibold uppercase tracking-wider border border-border text-text px-8 py-3 rounded hover:border-primary hover:text-primary transition-colors duration-150"
          >
            Load More Shoes
          </button>
        </div>
      )}
    </>
  );
}

export function ShopContent() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      <div className="mb-6">
        <Suspense
          fallback={
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text">
              Shop All Shoes
            </h1>
          }
        >
          <TitleBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop visible, mobile drawer */}
        <Suspense fallback={<div className="hidden md:block w-52 shrink-0" />}>
          <ProductFilters
            mobileOpen={filterOpen}
            onMobileClose={() => setFilterOpen(false)}
          />
        </Suspense>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile toolbar */}
          <div className="flex items-center justify-between mb-5 md:hidden">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 border border-border px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider text-text hover:border-primary hover:text-primary transition-colors duration-150"
            >
              <span className="material-symbols-outlined icon-outline text-[16px]">
                tune
              </span>
              Filters
            </button>
            <Suspense fallback={null}>
              <SortDropdown />
            </Suspense>
          </div>

          {/* Desktop sort */}
          <div className="hidden md:flex items-center justify-end mb-5">
            <Suspense fallback={null}>
              <SortDropdown />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg" className="text-primary" />
              </div>
            }
          >
            <ShopGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
