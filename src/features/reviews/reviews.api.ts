import { apiClient } from '@/services/http/client';
import type { PaginatedResult } from '@/services/http/response';
import { unwrapList } from '@/services/http/response';

import type { Review, ReviewsListParams } from './reviews.type';

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
};
