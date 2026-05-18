export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Sku {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  size: string;
  color: string | null;
  stock: number;
  reserved: number;
  available: number;
  threshold: number;
  lastRestocked: string | null;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkuPayload {
  productId: string;
  size: string;
  color?: string;
  stock?: number;
  threshold?: number;
}

export interface UpdateSkuPayload {
  stock?: number;
  threshold?: number;
  color?: string;
  lastRestocked?: string;
}
