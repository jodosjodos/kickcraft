"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/api/products";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  gradient: string;
}

export function ImageGallery({
  images,
  productName,
  gradient,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square bg-product-card relative overflow-hidden rounded">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center bg-linear-to-br",
              gradient
            )}
          >
            <span className="material-symbols-outlined icon-outline text-[80px] text-text-muted/30">
              footwear
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-16 h-16 shrink-0 relative overflow-hidden rounded border-2 transition-colors duration-150",
                activeIndex === i
                  ? "border-primary"
                  : "border-border hover:border-outline"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain bg-product-card"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
