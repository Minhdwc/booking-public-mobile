import { z } from 'zod';

import { apiClient } from '@/services/http/client';
import { PaginatedResult, unwrapList } from '@/services/http/response';

export interface ReviewUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Review {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: ReviewUser;
}

export interface ReviewsListParams {
  venueId?: string;
  page?: number;
  limit?: number;
}

export interface CreateReviewPayload {
  venueId: string;
  rating: number;
  comment?: string;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: 'no_confirmed_booking' | 'already_reviewed';
  message: string;
}

export const createReviewSchema = z.object({
  venueId: z.string().min(1),
  rating: z.number().int().min(1, 'Chọn số sao').max(5),
  comment: z.string().max(1000, 'Nhận xét quá dài').optional(),
});

export interface CreateReviewInput extends z.infer<typeof createReviewSchema> {}

export const reviewsApi = {
  async getList(params: ReviewsListParams = {}) {
    const result = await apiClient.get<PaginatedResult<Review> | Review[]>('/reviews', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        venueId: params.venueId,
      },
    });

    return unwrapList(result);
  },

  create(payload: CreateReviewPayload) {
    return apiClient.post<Review>('/reviews', payload);
  },

  getEligibility(venueId: string) {
    return apiClient.get<ReviewEligibility>('/reviews/eligibility/check', {
      params: { venueId },
    });
  },
};
