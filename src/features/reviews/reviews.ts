import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';
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

export function useVenueReviews(venueId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.review.list({ venueId }),
    queryFn: () => reviewsApi.getList({ venueId: venueId!, limit: 20 }),
    enabled: Boolean(venueId),
    staleTime: 60_000,
  });
}
