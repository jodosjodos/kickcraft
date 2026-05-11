"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

interface Review {
  id: string;
  product: string;
  productBrand: string;
  customer: string;
  customerInitials: string;
  avatarColor: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  status: ReviewStatus;
}

const MOCK_REVIEWS: Review[] = [
  { id: "1", product: "Air Max Pulse", productBrand: "Nike", customer: "Alice Uwimana", customerInitials: "AU", avatarColor: "bg-primary/20 text-primary", date: "2025-05-10", rating: 5, title: "Best sneakers I've ever owned!", body: "These are absolutely incredible. The cushioning is top notch and they look fire. Delivery was fast too. Will definitely order again.", verified: true, status: "pending" },
  { id: "2", product: "Yeezy Slide", productBrand: "Adidas", customer: "Bob Nkurunziza", customerInitials: "BN", avatarColor: "bg-secondary/20 text-secondary", date: "2025-05-09", rating: 4, title: "Great slides, minor sizing issue", body: "Really comfortable and stylish. Runs a bit small so I'd recommend going half a size up. Overall very happy with the purchase.", verified: true, status: "pending" },
  { id: "3", product: "Jordan 1 Retro High", productBrand: "Jordan", customer: "Chantal Mukamana", customerInitials: "CM", avatarColor: "bg-[#ffb5a0]/20 text-[#ffb5a0]", date: "2025-05-08", rating: 3, title: "Decent but expected more", body: "They're OK. Quality is fine but for the price I expected better finishing. The colorway looks slightly different from the photos.", verified: false, status: "pending" },
  { id: "4", product: "New Balance 990v6", productBrand: "New Balance", customer: "David Habimana", customerInitials: "DH", avatarColor: "bg-blue-500/20 text-blue-400", date: "2025-05-05", rating: 5, title: "Premium quality, worth every franc", body: "Absolutely love these. Very premium feel, extremely comfortable for all day wear. Kickcraft delivered in 2 days which was amazing.", verified: true, status: "approved" },
  { id: "5", product: "Vans Old Skool", productBrand: "Vans", customer: "Esperance Ingabire", customerInitials: "EI", avatarColor: "bg-purple-500/20 text-purple-400", date: "2025-05-03", rating: 5, title: "Classic look, great quality", body: "These never go out of style. Super sturdy build and very comfortable. Already got compliments from friends. Thanks Kickcraft!", verified: true, status: "approved" },
  { id: "6", product: "Puma RS-X", productBrand: "Puma", customer: "Frank Mugisha", customerInitials: "FM", avatarColor: "bg-primary/20 text-primary", date: "2025-04-28", rating: 1, title: "Received wrong item", body: "I ordered size 42 blue but got size 41 red. Very disappointed. Customer service hasn't responded. This is unacceptable.", verified: true, status: "flagged" },
  { id: "7", product: "Converse Chuck 70", productBrand: "Converse", customer: "Grace Umutoni", customerInitials: "GU", avatarColor: "bg-secondary/20 text-secondary", date: "2025-04-20", rating: 4, title: "Nice kicks, great value", body: "Clean look and super comfortable. The canvas is high quality and the sole grips well. Happy with the purchase overall.", verified: true, status: "approved" },
  { id: "8", product: "Air Max Pulse", productBrand: "Nike", customer: "Heri Kalisa", customerInitials: "HK", avatarColor: "bg-[#ffb5a0]/20 text-[#ffb5a0]", date: "2025-04-15", rating: 2, title: "Packaging was damaged", body: "Shoes arrived in a crushed box. The shoes themselves seem fine but this shouldn't happen. Please improve packaging.", verified: true, status: "rejected" },
];

const TABS: { value: ReviewStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "flagged", label: "Flagged" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("material-symbols-outlined text-[14px]", i < rating ? "icon-filled text-primary" : "icon-outline text-text-muted/30")}>
          star
        </span>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<ReviewStatus>("pending");
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const filtered = reviews.filter((r) => r.status === tab);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const flaggedCount = reviews.filter((r) => r.status === "flagged").length;

  function updateStatus(id: string, newStatus: ReviewStatus) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Commerce</p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Reviews</h1>
      </div>

      {/* Alert banner */}
      {pendingCount > 0 && (
        <div className="border-l-4 border-l-primary bg-primary/5 border border-primary/20 px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined icon-filled text-[18px] text-primary">pending_actions</span>
          <p className="font-body text-sm text-text">
            <span className="font-semibold">{pendingCount} review{pendingCount > 1 ? "s are" : " is"} awaiting approval</span>
            {flaggedCount > 0 && <span className="text-text-muted"> · {flaggedCount} flagged for review</span>}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ value, label }) => {
          const count = reviews.filter((r) => r.status === value).length;
          return (
            <button key={value} onClick={() => setTab(value)}
              className={cn("flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                tab === value ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
              )}>
              {label}
              {count > 0 && (
                <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                  tab === value
                    ? "bg-white/20 text-white"
                    : value === "pending" ? "bg-primary text-white"
                    : value === "flagged" ? "bg-error/20 text-error"
                    : "bg-surface-elevated text-text-muted"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Review cards */}
      {filtered.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/20 block mb-3">reviews</span>
          <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-1">
            {tab === "pending" ? "No reviews pending" : tab === "approved" ? "No approved reviews" : tab === "rejected" ? "No rejected reviews" : "No flagged reviews"}
          </p>
          <p className="font-body text-xs text-text-muted">Reviews in this category will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={cn(
                "border bg-surface",
                review.status === "flagged" ? "border-l-4 border-l-primary border-border" : "border-border"
              )}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Product info */}
                  <div className="min-w-0">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">{review.productBrand}</p>
                    <p className="font-body text-sm font-semibold text-primary truncate">{review.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StarRating rating={review.rating} />
                  <p className="font-body text-[10px] text-text-muted">
                    {new Date(review.date).toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {review.verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 font-body text-[10px] font-bold uppercase tracking-wider text-secondary">
                      <span className="material-symbols-outlined icon-filled text-[11px]">verified</span>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Review body */}
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  {/* Customer avatar */}
                  <div className={cn("w-8 h-8 flex items-center justify-center shrink-0 font-heading text-xs font-extrabold", review.avatarColor)}>
                    {review.customerInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-sm font-semibold text-text">{review.customer}</p>
                    </div>
                    <p className="font-body text-sm font-bold text-text mb-1">{review.title}</p>
                    <p className="font-body text-sm text-text-muted leading-relaxed">{review.body}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(tab === "pending" || tab === "flagged") && (
                <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(review.id, "approved")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-background font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined icon-filled text-[14px]">check_circle</span>
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(review.id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors"
                  >
                    <span className="material-symbols-outlined icon-outline text-[14px]">cancel</span>
                    Reject
                  </button>
                  {tab !== "flagged" && (
                    <button
                      onClick={() => updateStatus(review.id, "flagged")}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ffb5a0]/40 text-[#ffb5a0] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#ffb5a0]/10 transition-colors"
                    >
                      <span className="material-symbols-outlined icon-outline text-[14px]">flag</span>
                      Flag
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text-muted font-body text-xs font-semibold uppercase tracking-wider hover:text-text hover:border-outline transition-colors ml-auto">
                    <span className="material-symbols-outlined icon-outline text-[14px]">reply</span>
                    Reply
                  </button>
                </div>
              )}
              {tab === "approved" && (
                <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-secondary font-body text-xs font-semibold">
                    <span className="material-symbols-outlined icon-filled text-[14px]">check_circle</span>
                    Published
                  </span>
                  <button
                    onClick={() => updateStatus(review.id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors ml-auto"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
