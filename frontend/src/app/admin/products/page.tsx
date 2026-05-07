"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/api/use-products";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/api/products";

const STATUS_COLORS: Record<ProductStatus, string> = {
  active: "text-secondary",
  sold: "text-error",
  draft: "text-text-muted",
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useProducts({
    search: search || undefined,
    limit: 50,
  });

  const products = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
            Products
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            {data?.total ?? 0} listings
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95">
          <span className="material-symbols-outlined icon-outline text-[18px]">
            add
          </span>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <span className="material-symbols-outlined icon-outline text-[18px] text-text-muted absolute left-3 top-1/2 -translate-y-1/2">
          search
        </span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-surface pl-9 pr-4 py-2.5 font-body text-sm text-text placeholder-text-muted/50 focus:outline-none focus:border-primary transition-colors max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <p className="font-body text-sm text-error py-8">Failed to load products</p>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Brand", "Category", "Price", "Stock", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-elevated transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-body text-sm font-semibold text-text hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-muted">
                    {product.brand}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-muted capitalize">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 font-heading text-sm font-bold text-text">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-body text-xs font-semibold uppercase tracking-wider",
                        STATUS_COLORS[product.status]
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-body text-xs text-text-muted hover:text-primary transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="px-5 py-10 text-center font-body text-sm text-text-muted">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
