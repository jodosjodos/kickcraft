import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/api/products";

const CARD_GRADIENTS = [
  "from-orange-950/50 to-orange-900/20",
  "from-blue-950/50 to-blue-900/20",
  "from-violet-950/50 to-violet-900/20",
  "from-emerald-950/50 to-emerald-900/20",
  "from-rose-950/50 to-rose-900/20",
  "from-cyan-950/50 to-cyan-900/20",
  "from-amber-950/50 to-amber-900/20",
  "from-fuchsia-950/50 to-fuchsia-900/20",
];

function cardGradient(id: string): string {
  const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images[0];
  const gradient = cardGradient(product.id);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded border border-border bg-surface overflow-hidden",
        "hover:border-outline transition-colors duration-200",
        className
      )}
    >
      {/* Image area */}
      <div className="aspect-square bg-product-card relative overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain transition-all duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center bg-linear-to-br",
              gradient
            )}
          >
            <span className="material-symbols-outlined icon-outline text-[64px] text-text-muted/30">
              footwear
            </span>
          </div>
        )}

        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-error/90 text-background font-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}

        {product.status === "sold" && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-heading text-sm font-bold uppercase tracking-widest text-text-muted">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-0.5">
          {product.brand}
        </p>
        <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-text truncate mb-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="font-heading text-base font-extrabold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
