import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productsService from "@/services/products.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  CreateProductRequest,
  Product,
  ProductFilters,
  UpdateProductRequest,
  UploadImageResponse,
} from "@/types/api/products";
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

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, ApiError, CreateProductRequest>({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation<
    Product,
    ApiError,
    { id: string; data: UpdateProductRequest }
  >({
    mutationFn: ({ id, data }) => productsService.updateProduct(id, data),
    onSuccess: (product) => {
      void qc.invalidateQueries({ queryKey: queryKeys.products.all });
      void qc.invalidateQueries({
        queryKey: queryKeys.products.detail(product.slug),
      });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUploadImage() {
  return useMutation<UploadImageResponse, ApiError, File>({
    mutationFn: productsService.uploadImage,
  });
}
