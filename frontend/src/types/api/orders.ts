export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentPhase = "pending" | "upfront_paid" | "fully_paid";

export type DeliveryMethod = "delivery" | "pickup";

export interface OrderItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productBrand: string;
  price: number;
  imageUrl?: string | null;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderToken: string;
  status: OrderStatus;
  paymentPhase: PaymentPhase;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string | null;
  phone: string;
  email?: string | null;
  userId?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    size: string;
    quantity: number;
  }[];
  deliveryMethod: DeliveryMethod;
  phone: string;
  email?: string;
  deliveryAddress?: string;
}

export interface LocalCartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  size: string;
  quantity: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentPhase?: PaymentPhase;
  page?: number;
  limit?: number;
}
