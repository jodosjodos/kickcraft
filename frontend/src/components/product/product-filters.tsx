"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "sports", label: "Sports" },
];

const SHOE_TYPES = [
  { value: "sneakers", label: "Sneakers" },
  { value: "loafers", label: "Loafers" },
  { value: "boots", label: "Boots" },
  { value: "slides", label: "Slides" },
];

const SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

const PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under 70,000 RWF", min: undefined, max: 70000 },
  { label: "70,000 – 120,000 RWF", min: 70000, max: 120000 },
  { label: "120,000 – 200,000 RWF", min: 120000, max: 200000 },
  { label: "200,000+ RWF", min: 200000, max: undefined },
];

interface ProductFiltersProps {
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function ProductFilters({
  className,
  mobileOpen,
  onMobileClose,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategories = searchParams.getAll("category");
  const activeSubCategories = searchParams.getAll("subCategory");
  const activeSize = searchParams.get("size") ?? "";
  const activeMin = searchParams.get("minPrice") ?? "";
  const activeMax = searchParams.get("maxPrice") ?? "";

  function toggleMultiParam(paramKey: string, value: string) {
    const current = searchParams.getAll(paramKey);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    next.forEach((v) => params.append(paramKey, v));
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function setSize(value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("size", value);
    } else {
      params.delete("size");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function setPriceRange(min: number | undefined, max: number | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) {
      params.set("minPrice", String(min));
    } else {
      params.delete("minPrice");
    }
    if (max !== undefined) {
      params.set("maxPrice", String(max));
    } else {
      params.delete("maxPrice");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  const activePriceKey = PRICE_RANGES.findIndex(
    (r) =>
      String(r.min ?? "") === activeMin && String(r.max ?? "") === activeMax
  );

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeSubCategories.length > 0 ||
    activeSize ||
    activeMin ||
    activeMax;

  const filterContent = (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Category */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const checked = activeCategories.includes(cat.value);
            return (
              <button
                key={cat.value}
                onClick={() => toggleMultiParam("category", cat.value)}
                className="flex items-center gap-2.5 text-left py-0.5 group"
              >
                <span
                  className={cn(
                    "w-4 h-4 border shrink-0 flex items-center justify-center transition-colors duration-100",
                    checked
                      ? "border-primary bg-primary"
                      : "border-border group-hover:border-primary"
                  )}
                >
                  {checked && (
                    <span className="material-symbols-outlined icon-outline text-white leading-none text-[11px]">
                      check
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-body text-sm transition-colors duration-100",
                    checked
                      ? "text-primary font-semibold"
                      : "text-text group-hover:text-primary"
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shoe Type */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
          Shoe Type
        </p>
        <div className="flex flex-col gap-2">
          {SHOE_TYPES.map((type) => {
            const checked = activeSubCategories.includes(type.value);
            return (
              <button
                key={type.value}
                onClick={() => toggleMultiParam("subCategory", type.value)}
                className="flex items-center gap-2.5 text-left py-0.5 group"
              >
                <span
                  className={cn(
                    "w-4 h-4 border shrink-0 flex items-center justify-center transition-colors duration-100",
                    checked
                      ? "border-primary bg-primary"
                      : "border-border group-hover:border-primary"
                  )}
                >
                  {checked && (
                    <span className="material-symbols-outlined icon-outline text-white leading-none text-[11px]">
                      check
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-body text-sm transition-colors duration-100",
                    checked
                      ? "text-primary font-semibold"
                      : "text-text group-hover:text-primary"
                  )}
                >
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
          Size (EU)
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSize(activeSize === size ? undefined : size)}
              className={cn(
                "border font-body text-xs py-1.5 transition-colors duration-100",
                activeSize === size
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-text-muted hover:border-outline hover:text-text"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
          Price
        </p>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              onClick={() => setPriceRange(range.min, range.max)}
              className={cn(
                "text-left font-body text-sm py-1 transition-colors duration-100",
                activePriceKey === i
                  ? "text-primary font-semibold"
                  : "text-text hover:text-primary"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => router.push("/shop")}
          className="font-body text-xs text-text-muted underline underline-offset-4 hover:text-primary transition-colors duration-100 text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-52 shrink-0 gap-6">
        {filterContent}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
              <span className="font-heading text-sm font-bold uppercase tracking-tight text-text">
                Filters
              </span>
              <button
                onClick={onMobileClose}
                className="p-1 text-text-muted hover:text-primary transition-colors"
                aria-label="Close filters"
              >
                <span className="material-symbols-outlined icon-outline text-[20px]">
                  close
                </span>
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 flex-1">
              {filterContent}
            </div>
            <div className="px-5 pb-6 pt-4 border-t border-border shrink-0">
              <button
                onClick={onMobileClose}
                className="w-full bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider py-3 rounded hover:bg-primary-inverse active:scale-95 transition-all"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
