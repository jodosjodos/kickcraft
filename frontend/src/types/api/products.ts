export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export type ProductStatus = "active" | "sold" | "draft";

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
  colors?: string[];
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
