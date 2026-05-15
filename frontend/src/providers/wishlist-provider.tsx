"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "@/types/api/products";
import { useAuth } from "@/providers/auth-provider";

const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  addedAt: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function getKey(userId: string | undefined): string {
  return userId ? `kc_wishlist_${userId}` : "kc_wishlist_guest";
}

function loadWishlist(userId: string | undefined): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    const now = Date.now();
    return parsed.filter((i) => now - i.addedAt < EXPIRY_MS);
  } catch {
    return [];
  }
}

function saveWishlist(userId: string | undefined, items: WishlistItem[]) {
  localStorage.setItem(getKey(userId), JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (isLoading) return;
    setItems(loadWishlist(user?.id));
  }, [user?.id, isLoading]);

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const toggle = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === product.id);
        let next: WishlistItem[];
        if (exists) {
          next = prev.filter((i) => i.productId !== product.id);
        } else {
          next = [
            ...prev,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              price: product.price,
              imageUrl: product.images[0]?.url,
              addedAt: Date.now(),
            },
          ];
        }
        saveWishlist(user?.id, next);
        return next;
      });
    },
    [user?.id],
  );

  const remove = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        saveWishlist(user?.id, next);
        return next;
      });
    },
    [user?.id],
  );

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggle, remove, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
