"use client";

import { useState } from "react";
import { useAdminReviews, useUpdateReviewStatus } from "@/hooks/api/use-reviews";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types/api/reviews";

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
        <span
          key={i}
          className={cn(
            "material-symbols-outlined text-[14px]",
            i < rating ? "icon-filled text-primary" : "icon-outline text-text-muted/30",
          )}
        >
          star
        </span>
      ))}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<ReviewStatus>("pending");
  const { data: reviews = [], isLoading, isError } = useAdminReviews();
  const updateStatus = useUpdateReviewStatus();

  const filtered = reviews.filter((r) => r.status === tab);
  const countOf = (s: ReviewStatus) => reviews.filter((r) => r.status === s).length;
  const pendingCount = countOf("pending");
  const flaggedCount = countOf("flagged");

  function handleStatus(id: string, status: ReviewStatus) {
    updateStatus.mutate({ id, status });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Commerce
        </p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">
          Reviews
        </h1>
      </div>

      {/* Alert banner */}
      {pendingCount > 0 && (
        <div className="border-l-4 border-l-primary bg-primary/5 border border-primary/20 px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined icon-filled text-[18px] text-primary">
            pending_actions
          </span>
          <p className="font-body text-sm text-text">
            <span className="font-semibold">
              {pendingCount} review{pendingCount > 1 ? "s are" : " is"} awaiting approval
            </span>
            {flaggedCount > 0 && (
              <span className="text-text-muted"> · {flaggedCount} flagged for review</span>
            )}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ value, label }) => {
          const count = countOf(value);
          return (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                tab === value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-muted border-border hover:text-text hover:border-outline",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                    tab === value
                      ? "bg-white/20 text-white"
                      : value === "pending"
                        ? "bg-primary text-white"
                        : value === "flagged"
                          ? "bg-error/20 text-error"
                          : "bg-surface-elevated text-text-muted",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <div className="border border-error/30 bg-error/5 px-5 py-4">
          <p className="font-body text-sm text-error">Failed to load reviews</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/20 block mb-3">
            reviews
          </span>
          <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-1">
            {tab === "pending"
              ? "No reviews pending"
              : tab === "approved"
                ? "No approved reviews"
                : tab === "rejected"
                  ? "No rejected reviews"
                  : "No flagged reviews"}
          </p>
          <p className="font-body text-xs text-text-muted">
            Reviews in this category will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={cn(
                "border bg-surface",
                review.status === "flagged"
                  ? "border-l-4 border-l-primary border-border"
                  : "border-border",
              )}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
                <div className="min-w-0">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {review.productBrand}
                  </p>
                  <p className="font-body text-sm font-semibold text-primary truncate">
                    {review.productName}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StarRating rating={review.rating} />
                  <p className="font-body text-[10px] text-text-muted">
                    {new Date(review.createdAt).toLocaleDateString("en-RW", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {review.verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 font-body text-[10px] font-bold uppercase tracking-wider text-secondary">
                      <span className="material-symbols-outlined icon-filled text-[11px]">
                        verified
                      </span>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Review body */}
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 font-heading text-xs font-extrabold bg-primary/20 text-primary">
                    {initials(review.customerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-text mb-1">
                      {review.customerName}
                    </p>
                    <p className="font-body text-sm font-bold text-text mb-1">
                      {review.title}
                    </p>
                    <p className="font-body text-sm text-text-muted leading-relaxed">
                      {review.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(tab === "pending" || tab === "flagged") && (
                <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
                  <button
                    onClick={() => handleStatus(review.id, "approved")}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-background font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined icon-filled text-[14px]">
                      check_circle
                    </span>
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(review.id, "rejected")}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined icon-outline text-[14px]">
                      cancel
                    </span>
                    Reject
                  </button>
                  {tab !== "flagged" && (
                    <button
                      onClick={() => handleStatus(review.id, "flagged")}
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ffb5a0]/40 text-[#ffb5a0] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#ffb5a0]/10 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined icon-outline text-[14px]">
                        flag
                      </span>
                      Flag
                    </button>
                  )}
                </div>
              )}
              {tab === "approved" && (
                <div className="px-5 py-3.5 border-t border-border flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-secondary font-body text-xs font-semibold">
                    <span className="material-symbols-outlined icon-filled text-[14px]">
                      check_circle
                    </span>
                    Published
                  </span>
                  <button
                    onClick={() => handleStatus(review.id, "rejected")}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors ml-auto disabled:opacity-50"
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
