import apiClient from "@/lib/api/client";
import type {
  CreateProductRequest,
  Product,
  ProductFilters,
  UpdateProductRequest,
  UploadImageResponse,
} from "@/types/api/products";
import type { PaginatedResponse } from "@/types/api/common";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const res = await apiClient.get<PaginatedResponse<Product>>("/products", {
    params: filters,
  });
  return res.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${slug}`);
  return res.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>("/products/featured");
  return res.data;
}

export async function getSimilarProducts(
  productId: string,
  subCategory: string
): Promise<Product[]> {
  const res = await apiClient.get<PaginatedResponse<Product>>("/products", {
    params: { subCategory, limit: 5 },
  });
  return res.data.data.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getSaleProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>("/products/sale");
  return res.data;
}

export async function createProduct(
  data: CreateProductRequest
): Promise<Product> {
  const res = await apiClient.post<Product>("/products", data);
  return res.data;
}

export async function updateProduct(
  id: string,
  data: UpdateProductRequest
): Promise<Product> {
  const res = await apiClient.patch<Product>(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<UploadImageResponse>(
    "/products/upload-image",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}
