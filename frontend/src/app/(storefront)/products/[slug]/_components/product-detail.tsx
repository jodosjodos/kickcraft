"use client";

import { useState } from "react";
import Link from "next/link";
import { useProduct, useSimilarProducts } from "@/hooks/api/use-products";
import { useProductReviews, useCreateReview } from "@/hooks/api/use-reviews";
import { useMyOrders } from "@/hooks/api/use-orders";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { ImageGallery } from "./image-gallery";
import { ProductCard } from "@/components/product/product-card";
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

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <span
              key={star}
              className={cn(
                "material-symbols-outlined text-[16px] leading-none",
                filled || half ? "text-amber-400" : "text-text-muted/40",
                filled ? "icon-fill" : half ? "icon-half" : "icon-outline"
              )}
            >
              {half ? "star_half" : "star"}
            </span>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="font-body text-xs text-text-muted">
          ({count})
        </span>
      )}
    </div>
  );
}

type TabKey = "description" | "sizing" | "reviews";

interface ProductDetailProps {
  slug: string;
}

interface ReviewFormState {
  rating: number;
  title: string;
  body: string;
  name: string;
  email: string;
}

const EMPTY_REVIEW_FORM: ReviewFormState = { rating: 0, title: "", body: "", name: "", email: "" };

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data: product, isLoading, isError, error } = useProduct(slug);
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(EMPTY_REVIEW_FORM);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const subCategory = product?.subCategory ?? "sneakers";
  const productId = product?.id ?? "";
  const { data: similarProducts } = useSimilarProducts(productId, subCategory);
  const { data: reviews = [] } = useProductReviews(productId);
  const { data: myOrders = [] } = useMyOrders();
  const createReview = useCreateReview();

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

  const isSoldOut = product.stock === 0;
  const isOnSale =
    product.originalPrice !== undefined && product.originalPrice > product.price;
  const gradient = cardGradient(product.id);
  const wishlisted = isWishlisted(product.id);

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

  function handleWishlistToggle() {
    if (!product) return;
    toggle(product);
  }

  function handleOpenReviewForm() {
    setReviewForm({
      rating: 0,
      title: "",
      body: "",
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
    setReviewSubmitted(false);
    setShowReviewForm(true);
  }

  function handleSubmitReview() {
    if (!product || reviewForm.rating === 0 || !reviewForm.title.trim() || !reviewForm.body.trim() || !reviewForm.name.trim()) return;
    const linkedOrder = myOrders.find((o) => o.items.some((i) => i.productId === product.id));
    createReview.mutate(
      {
        productId: product.id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        body: reviewForm.body.trim(),
        customerName: reviewForm.name.trim(),
        customerEmail: reviewForm.email.trim() || undefined,
        orderId: linkedOrder?.id,
      },
      {
        onSuccess: () => {
          setReviewSubmitted(true);
          setShowReviewForm(false);
          setReviewForm(EMPTY_REVIEW_FORM);
        },
      },
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in: ${product.name} (Size: ${selectedSize || "?"})\n${typeof window !== "undefined" ? window.location.href : ""}`
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "sizing", label: "Sizing & Fit" },
    {
      key: "reviews",
      label:
        product.reviewCount !== undefined
          ? `Reviews (${product.reviewCount})`
          : "Reviews",
    },
  ];

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
        <div className="flex flex-col gap-5">
          {/* Brand + name */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1">
              {product.brand}
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-text mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="mb-3">
                <StarRating rating={Number(product.rating)} count={product.reviewCount} />
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="font-heading text-2xl font-extrabold text-primary">
                {formatPrice(product.price)}
              </p>
              {isOnSale && (
                <p className="font-body text-sm text-text-muted line-through">
                  {formatPrice(product.originalPrice!)}
                </p>
              )}
              {isOnSale && (
                <span className="bg-primary/10 text-primary font-body text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && !isSoldOut && (
            <p className="font-body text-sm text-error font-semibold">
              Only {product.stock} left in stock — order soon
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
                    <span className="text-text font-semibold">{selectedSize}</span>
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
                "Added to Cart!"
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
              href={`https://wa.me/250794050537?text=${whatsappMsg}`}
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

            <button
              onClick={handleWishlistToggle}
              className={cn(
                "w-full flex items-center justify-center gap-2 border py-3",
                "font-body text-sm font-semibold uppercase tracking-wider transition-colors duration-150",
                wishlisted
                  ? "border-primary text-primary bg-primary/5 hover:bg-primary/10"
                  : "border-border text-text-muted hover:border-outline hover:text-text"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]",
                  wishlisted ? "icon-fill" : "icon-outline"
                )}
              >
                favorite
              </span>
              {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-text-muted block mb-1">
                local_shipping
              </span>
              <p className="font-body text-[10px] font-semibold text-text-muted leading-tight">
                Fast Delivery
              </p>
              <p className="font-body text-[10px] text-text-muted/60 leading-tight">
                2,000 RWF · Kigali
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-secondary block mb-1">
                payments
              </span>
              <p className="font-body text-[10px] font-semibold text-text-muted leading-tight">
                50/50 MoMo
              </p>
              <p className="font-body text-[10px] text-text-muted/60 leading-tight">
                Pay half upfront
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined icon-outline text-[24px] text-text-muted block mb-1">
                verified
              </span>
              <p className="font-body text-[10px] font-semibold text-text-muted leading-tight">
                100% Authentic
              </p>
              <p className="font-body text-[10px] text-text-muted/60 leading-tight">
                Verified pairs only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-border overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-150",
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
              <p>
                When in doubt, size up — Rwandan feet run slightly wider on average.
              </p>
              <p>
                Questions? Message us on{" "}
                <a
                  href="https://wa.me/250794050537"
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
            <div>
              {product.rating !== undefined && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="font-heading text-4xl font-extrabold text-text">
                      {Number(product.rating).toFixed(1)}
                    </p>
                    <StarRating rating={Number(product.rating)} />
                    <p className="font-body text-xs text-text-muted mt-1">
                      {product.reviewCount ?? 0} reviews
                    </p>
                  </div>
                </div>
              )}
              {reviews.length === 0 ? (
                <p className="font-body text-sm text-text-muted">
                  No written reviews yet. Be the first to buy and share your experience.
                </p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 font-heading text-xs font-extrabold bg-primary/20 text-primary">
                          {review.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-body text-sm font-semibold text-text">
                                {review.customerName}
                              </p>
                              {review.verified && (
                                <span className="flex items-center gap-0.5 font-body text-[10px] font-bold uppercase text-secondary">
                                  <span className="material-symbols-outlined icon-filled text-[11px]">verified</span>
                                  Verified
                                </span>
                              )}
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="font-body text-sm font-bold text-text mb-1">{review.title}</p>
                          <p className="font-body text-sm text-text-muted leading-relaxed">{review.body}</p>
                          <p className="font-body text-[10px] text-text-muted mt-2">
                            {new Date(review.createdAt).toLocaleDateString("en-RW", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Write review section */}
              <div className="mt-8 pt-6 border-t border-border">
                {reviewSubmitted ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/10 border border-secondary/30">
                    <span className="material-symbols-outlined icon-filled text-[18px] text-secondary">check_circle</span>
                    <p className="font-body text-sm text-secondary font-semibold">
                      Thank you! Your review is pending approval and will appear shortly.
                    </p>
                  </div>
                ) : !showReviewForm ? (
                  <button
                    onClick={handleOpenReviewForm}
                    className="flex items-center gap-2 border border-border px-4 py-2.5 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-text hover:border-outline transition-colors"
                  >
                    <span className="material-symbols-outlined icon-outline text-[16px]">rate_review</span>
                    Write a Review
                  </button>
                ) : (
                  <div className="border border-border bg-surface p-5 space-y-4">
                    <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">
                      Write a Review
                    </p>

                    {/* Star picker */}
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Rating <span className="text-error">*</span>
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setReviewHoverRating(star)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                            className="text-[28px] leading-none transition-colors"
                          >
                            <span
                              className={cn(
                                "material-symbols-outlined text-[28px] leading-none",
                                (reviewHoverRating || reviewForm.rating) >= star
                                  ? "icon-fill text-amber-400"
                                  : "icon-outline text-text-muted/30",
                              )}
                            >
                              star
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                        Review Title <span className="text-error">*</span>
                      </label>
                      <input
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Summarize your experience"
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                        Your Review <span className="text-error">*</span>
                      </label>
                      <textarea
                        value={reviewForm.body}
                        onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                        placeholder="What did you think? How was the fit, quality, delivery?"
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                        Your Name <span className="text-error">*</span>
                      </label>
                      <input
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                        disabled={!!user}
                        placeholder="Your name"
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                        Email{" "}
                        <span className="normal-case font-normal text-text-muted/60">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm((f) => ({ ...f, email: e.target.value }))}
                        disabled={!!user}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {createReview.isError && (
                      <p className="font-body text-xs text-error">Something went wrong. Please try again.</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSubmitReview}
                        disabled={
                          createReview.isPending ||
                          reviewForm.rating === 0 ||
                          !reviewForm.title.trim() ||
                          !reviewForm.body.trim() ||
                          !reviewForm.name.trim()
                        }
                        className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
                      >
                        {createReview.isPending ? "Submitting..." : "Submit Review"}
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-16">
          <div className="mb-6">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
              Similar picks
            </p>
            <h2 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {similarProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
