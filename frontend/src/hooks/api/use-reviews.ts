"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as reviewsService from "@/services/reviews.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  Review,
  CreateReviewRequest,
  ReviewStatus,
} from "@/types/api/reviews";
import type { ApiError } from "@/types/api/common";

export function useProductReviews(productId: string) {
  return useQuery<Review[], ApiError>({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: () => reviewsService.getReviewsByProduct(productId),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
}

export function useAdminReviews(status?: ReviewStatus) {
  return useQuery<Review[], ApiError>({
    queryKey: queryKeys.reviews.admin(status),
    queryFn: () => reviewsService.getAdminReviews(status),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation<Review, ApiError, CreateReviewRequest>({
    mutationFn: reviewsService.createReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation<Review, ApiError, { id: string; status: ReviewStatus }>({
    mutationFn: ({ id, status }) =>
      reviewsService.updateReviewStatus(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
