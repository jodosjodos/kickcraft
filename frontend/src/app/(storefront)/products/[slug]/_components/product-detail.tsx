"use client";

import { useState } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/api/use-products";
import { useCart } from "@/providers/cart-provider";
import { ImageGallery } from "./image-gallery";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CARD_GRADIENTS = [
  "from-orange-950/50 to-orange-900/20",
  "from-blue-950/50 to-blue-900/20",
  "from-violet-950/50 to-violet-900/20",
  "from-emerald-950/50 to-emerald-900/20",
  "from-rose-950/50 to-rose-900/20",
];

function cardGradient(id: string): string {
  const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

type TabKey = "description" | "sizing" | "reviews";

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data: product, isLoading, isError, error } = useProduct(slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-32 text-center">
        <p className="font-body text-sm text-error">
          {error?.message ?? "Product not found"}
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block font-body text-sm text-primary hover:underline underline-offset-4"
        >
          Browse all shoes
        </Link>
      </div>
    );
  }

  const isSoldOut = product.status === "sold" || product.stock === 0;
  const gradient = cardGradient(product.id);

  function handleAddToCart() {
    if (!selectedSize || isSoldOut || !product) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.images[0]?.url,
      size: selectedSize,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in: ${product.name} (Size: ${selectedSize || "?"})\n${typeof window !== "undefined" ? window.location.href : ""}`
  );

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 font-body text-xs text-text-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>›</span>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span>›</span>
            <Link
              href={`/shop/${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-text truncate max-w-[160px]">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ImageGallery
          images={product.images}
          productName={product.name}
          gradient={gradient}
        />

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Brand + name + price */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1">
              {product.brand}
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text mb-3">
              {product.name}
            </h1>
            <p className="font-heading text-2xl font-extrabold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock */}
          {product.stock <= 5 && !isSoldOut && (
            <p className="font-body text-sm text-error font-semibold">
              Only {product.stock} left in stock
            </p>
          )}

          {isSoldOut && (
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-text-muted bg-surface-elevated px-4 py-2 inline-block">
              Sold Out
            </p>
          )}

          {/* Size picker */}
          {!isSoldOut && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                  Select Size (EU)
                </p>
                {selectedSize && (
                  <span className="font-body text-xs text-text-muted">
                    Selected:{" "}
                    <span className="text-text font-semibold">
                      {selectedSize}
                    </span>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "border py-2.5 font-body text-sm font-semibold transition-colors duration-100",
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-text hover:border-outline"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="font-body text-xs text-text-muted mt-2">
                  Please select a size
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          {!isSoldOut && (
            <div className="flex items-center gap-4">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                Qty
              </p>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-text hover:bg-surface-elevated transition-colors"
                >
                  <span className="material-symbols-outlined icon-outline text-[18px]">
                    remove
                  </span>
                </button>
                <span className="w-10 text-center font-body text-sm font-semibold text-text">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center text-text hover:bg-surface-elevated transition-colors"
                >
                  <span className="material-symbols-outlined icon-outline text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSoldOut || !selectedSize}
              loading={addedToCart}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                "Added!"
              ) : (
                <>
                  <span className="material-symbols-outlined icon-outline text-[18px] mr-2">
                    shopping_cart
                  </span>
                  {isSoldOut ? "Sold Out" : "Add to Cart"}
                </>
              )}
            </Button>

            <a
              href={`https://wa.me/250788000000?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full flex items-center justify-center gap-2 border border-secondary py-3",
                "font-body text-sm font-semibold uppercase tracking-wider text-secondary",
                "hover:bg-secondary/10 transition-colors duration-150"
              )}
            >
              <span className="material-symbols-outlined icon-outline text-[18px]">
                chat
              </span>
              Order on WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-text-muted block mb-1">
                local_shipping
              </span>
              <p className="font-body text-[10px] text-text-muted leading-tight">
                Fast Delivery Kigali
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-secondary block mb-1">
                payments
              </span>
              <p className="font-body text-[10px] text-text-muted leading-tight">
                50/50 MoMo Accepted
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-text-muted block mb-1">
                verified
              </span>
              <p className="font-body text-[10px] text-text-muted leading-tight">
                100% Authentic
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-border">
          {(
            [
              { key: "description", label: "Description" },
              { key: "sizing", label: "Sizing & Fit" },
              { key: "reviews", label: "Reviews" },
            ] as { key: TabKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider transition-colors duration-150",
                activeTab === tab.key
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-text-muted hover:text-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 pb-2">
          {activeTab === "description" && (
            <p className="font-body text-sm text-text-muted leading-relaxed max-w-2xl">
              {product.description}
            </p>
          )}
          {activeTab === "sizing" && (
            <div className="font-body text-sm text-text-muted space-y-2 max-w-2xl">
              <p>All shoes are listed in EU sizing.</p>
              <p>When in doubt, size up — Rwandan feet run slightly wider on average.</p>
              <p>
                Questions? Message us on{" "}
                <a
                  href="https://wa.me/250788000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline underline-offset-4"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <p className="font-body text-sm text-text-muted">
              No reviews yet. Be the first to buy and leave one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
