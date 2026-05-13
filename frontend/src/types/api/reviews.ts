export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

export interface Review {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productBrand: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  orderId: string | null;
  verified: boolean;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  body: string;
  customerName: string;
  customerEmail?: string;
  orderId?: string;
}

export interface UpdateReviewStatusRequest {
  status: ReviewStatus;
}
