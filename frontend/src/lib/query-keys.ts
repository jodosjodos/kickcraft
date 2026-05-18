import type { ProductFilters } from "@/types/api/products";
import type { OrderFilters } from "@/types/api/orders";
import type { ReviewStatus } from "@/types/api/reviews";
import type { UserFilters } from "@/types/api/users";
import type { AnalyticsPeriod } from "@/types/api/analytics";

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters: ProductFilters) =>
      ["products", "list", filters] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    similar: (id: string, sub: string) =>
      ["products", "similar", id, sub] as const,
    sale: () => ["products", "sale"] as const,
    featured: () => ["products", "featured"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (filters: OrderFilters) => ["orders", "list", filters] as const,
    mine: () => ["orders", "mine"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    byToken: (token: string) => ["orders", "token", token] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: UserFilters) => ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    byProduct: (productId: string) =>
      ["reviews", "product", productId] as const,
    admin: (status?: ReviewStatus) => ["reviews", "admin", status] as const,
  },
  agents: {
    all: ["agents"] as const,
  },
  discounts: {
    all: ["discounts"] as const,
  },
  analytics: {
    dashboard: () => ["analytics", "dashboard"] as const,
    revenue: (period: AnalyticsPeriod) => ["analytics", "revenue", period] as const,
    orders: (period: AnalyticsPeriod) => ["analytics", "orders", period] as const,
    customers: () => ["analytics", "customers"] as const,
  },
};
