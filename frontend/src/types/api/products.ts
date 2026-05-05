export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export type ProductStatus = "active" | "sold" | "draft";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  images: ProductImage[];
  sizes: string[];
  category: string;
  description: string;
  stock: number;
  status: ProductStatus;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  price: number;
  sizes: string[];
  category: string;
  description: string;
  stock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  status?: ProductStatus;
}
