import type { Product } from "./products";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentPhase =
  | "pending"
  | "upfront_paid"
  | "delivery_paid"
  | "fully_paid";

export type DeliveryMethod = "delivery" | "pickup";

export interface OrderItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderToken: string;
  status: OrderStatus;
  paymentPhase: PaymentPhase;
  items: OrderItem[];
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  phone: string;
  email?: string;
  userId?: string;
  createdAt: string;
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

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  quantity: number;
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
