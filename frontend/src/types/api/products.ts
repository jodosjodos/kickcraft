export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export type ProductStatus = "active" | "draft" | "archived";

export type SubCategory = "sneakers" | "loafers" | "boots" | "slides";

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
  originalPrice?: number;
  images: ProductImage[];
  sizes: string[];
  category: string;
  subCategory: SubCategory;
  description: string;
  stock: number;
  status: ProductStatus;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilters {
  category?: string;
  subCategory?: SubCategory;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  search?: string;
  brand?: string;
  status?: ProductStatus | "all";
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  category: string;
  subCategory: SubCategory;
  description: string;
  stock: number;
  status?: ProductStatus;
  isNew?: boolean;
  images?: { url: string; alt: string; order: number }[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface UploadImageResponse {
  url: string;
}
