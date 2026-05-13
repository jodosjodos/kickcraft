import apiClient from "@/lib/api/client";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewStatusRequest,
  ReviewStatus,
} from "@/types/api/reviews";

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const res = await apiClient.get<Review[]>(`/reviews/product/${productId}`);
  return res.data;
}

export async function getAdminReviews(status?: ReviewStatus): Promise<Review[]> {
  const res = await apiClient.get<Review[]>("/reviews", {
    params: status ? { status } : undefined,
  });
  return res.data;
}

export async function createReview(data: CreateReviewRequest): Promise<Review> {
  const res = await apiClient.post<Review>("/reviews", data);
  return res.data;
}

export async function updateReviewStatus(
  id: string,
  data: UpdateReviewStatusRequest,
): Promise<Review> {
  const res = await apiClient.patch<Review>(`/reviews/${id}/status`, data);
  return res.data;
}
