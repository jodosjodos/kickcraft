"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { LocalCartItem } from "@/types/api/orders";

interface CartContextValue {
  items: LocalCartItem[];
  addItem: (item: Omit<LocalCartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  switchUser: (userId?: string) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const GUEST_KEY = "kickcraft_cart";

function storageKey(userId?: string) {
  return userId ? `kickcraft_cart_u_${userId}` : GUEST_KEY;
}

function loadFrom(key: string): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  } catch {
    return [];
  }
}

function saveTo(key: string, items: LocalCartItem[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const keyRef = useRef<string>(GUEST_KEY);

  useEffect(() => {
    setItems(loadFrom(GUEST_KEY));
  }, []);

  function save(next: LocalCartItem[]) {
    saveTo(keyRef.current, next);
  }

  function switchUser(userId?: string) {
    const newKey = storageKey(userId);
    keyRef.current = newKey;
    const loaded = loadFrom(newKey);
    setItems(loaded);
  }

  function addItem(item: Omit<LocalCartItem, "id">) {
    const id = `${item.productId}-${item.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      const next = existing
        ? prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i)
        : [...prev, { ...item, id }];
      save(next);
      return next;
    });
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      save(next);
      return next;
    });
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) { removeItem(id); return; }
    setItems((prev) => {
      const next = prev.map((i) => i.id === id ? { ...i, quantity } : i);
      save(next);
      return next;
    });
  }

  function clearCart() {
    const next: LocalCartItem[] = [];
    setItems(next);
    save(next);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, switchUser, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
