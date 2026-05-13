export type DiscountType = "percentage" | "fixed" | "free_shipping";
export type DiscountStatus = "active" | "scheduled" | "expired" | "draft";

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  appliesTo: string;
  minOrder: number;
  maxUses: number;
  usageCount: number;
  isActive: boolean;
  validFrom: string | null;
  validTo: string | null;
  status: DiscountStatus;
}

export interface CreateDiscountRequest {
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  appliesTo?: string;
  minOrder?: number;
  maxUses?: number;
  isActive?: boolean;
  validFrom?: string;
  validTo?: string;
}

export interface UpdateDiscountRequest {
  name?: string;
  type?: DiscountType;
  value?: number;
  appliesTo?: string;
  minOrder?: number;
  maxUses?: number;
  isActive?: boolean;
  validFrom?: string;
  validTo?: string;
}

export interface ApplyDiscountResponse {
  discountAmount: number;
  discountId: string;
  code: string;
}
