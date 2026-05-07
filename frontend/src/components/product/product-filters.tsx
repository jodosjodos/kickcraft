"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
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
  defaultCategory?: string;
}

export function ProductFilters({
  className,
  defaultCategory,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const activeCategory = selectedCategory ?? defaultCategory ?? "";
  const activeSize = searchParams.get("size") ?? "";
  const activeMin = searchParams.get("minPrice") ?? "";
  const activeMax = searchParams.get("maxPrice") ?? "";

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setPriceRange(
    min: number | undefined,
    max: number | undefined
  ) {
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
    router.push(`${pathname}?${params.toString()}`);
  }

  const activePriceKey = PRICE_RANGES.findIndex(
    (r) =>
      String(r.min ?? "") === activeMin && String(r.max ?? "") === activeMax
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Category */}
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "text-left font-body text-sm px-0 py-1",
                "transition-colors duration-100",
                activeCategory === cat.value
                  ? "text-primary font-semibold"
                  : "text-text hover:text-primary"
              )}
            >
              {cat.label}
            </button>
          ))}
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
              onClick={() =>
                setParam("size", activeSize === size ? undefined : size)
              }
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
                "text-left font-body text-sm py-1",
                "transition-colors duration-100",
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
      {(selectedCategory || activeSize || activeMin || activeMax) && (
        <button
          onClick={() => router.push(pathname)}
          className="font-body text-xs text-text-muted underline underline-offset-4 hover:text-primary transition-colors duration-100 text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
