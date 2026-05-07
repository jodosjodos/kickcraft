"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types/api/products";

const SORT_OPTIONS: { value: SortOption | ""; label: string }[] = [
  { value: "", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (searchParams.get("sort") as SortOption) || "";
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === current)?.label ?? "Featured";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 border border-border bg-surface px-4 py-2.5",
          "font-body text-sm text-text hover:border-outline transition-colors duration-150",
          open && "border-outline"
        )}
      >
        <span className="text-text-muted text-xs uppercase tracking-wider font-semibold">
          Sort:
        </span>
        <span>{currentLabel}</span>
        <span
          className={cn(
            "material-symbols-outlined icon-outline text-[18px] text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 min-w-[200px] border border-border bg-surface shadow-lg">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 font-body text-sm",
                "hover:bg-surface-elevated transition-colors duration-100",
                current === opt.value
                  ? "text-primary font-semibold"
                  : "text-text"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
