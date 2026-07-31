import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { reviewsApi } from './reviews.api';

export function useVenueReviews(venueId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.review.list({ venueId }),
    queryFn: () => reviewsApi.getList({ venueId: venueId!, limit: 20 }),
    enabled: Boolean(venueId),
    staleTime: 60_000,
  });
}
