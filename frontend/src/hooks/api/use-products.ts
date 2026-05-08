import { useQuery } from "@tanstack/react-query";
import * as productsService from "@/services/products.service";
import { queryKeys } from "@/lib/query-keys";
import type { ProductFilters } from "@/types/api/products";
import type { Product } from "@/types/api/products";
import type { ApiError } from "@/types/api/common";
import type { PaginatedResponse } from "@/types/api/common";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<PaginatedResponse<Product>, ApiError>({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getProducts(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product, ApiError>({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[], ApiError>({
    queryKey: queryKeys.products.featured(),
    queryFn: productsService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSimilarProducts(productId: string, subCategory: string) {
  return useQuery<Product[], ApiError>({
    queryKey: queryKeys.products.similar(productId, subCategory),
    queryFn: () => productsService.getSimilarProducts(productId, subCategory),
    enabled: !!productId && !!subCategory,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaleProducts() {
  return useQuery<Product[], ApiError>({
    queryKey: queryKeys.products.sale(),
    queryFn: productsService.getSaleProducts,
    staleTime: 5 * 60 * 1000,
  });
}
