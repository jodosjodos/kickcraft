"use client";

import { use } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/api/use-products";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export default function AdminProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-8">
        <p className="font-body text-sm text-error mb-4">Product not found</p>
        <Link
          href="/admin/products"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="font-body text-xs text-text-muted hover:text-primary transition-colors"
        >
          ← Products
        </Link>
        <span className="text-text-muted">/</span>
        <span className="font-body text-xs text-text">{product.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          {product.name}
        </h1>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="font-body text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined icon-outline text-[14px]">
            open_in_new
          </span>
          View in store
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
            Details
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Brand", value: product.brand },
              { label: "Category", value: product.category },
              { label: "Price", value: formatPrice(product.price) },
              { label: "Stock", value: String(product.stock) },
              { label: "Status", value: product.status },
              { label: "Sizes", value: product.sizes.join(", ") },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between font-body text-sm">
                <span className="text-text-muted">{label}</span>
                <span className="text-text capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border bg-surface p-5">
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
            Description
          </h2>
          <p className="font-body text-sm text-text-muted leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 border border-border/50 bg-surface-elevated">
        <p className="font-body text-xs text-text-muted">
          Slug: <span className="text-text">{product.slug}</span>
        </p>
      </div>
    </div>
  );
}
