import type { ProductFilters } from "@/types/api/products";

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters: ProductFilters) =>
      ["products", "list", filters] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
  },
  orders: {
    all: ["orders"] as const,
    mine: () => ["orders", "mine"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    byToken: (token: string) => ["orders", "token", token] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => ["users", "list"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
};
