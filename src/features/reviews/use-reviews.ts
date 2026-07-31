import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { CreateReviewPayload, reviewsApi } from './reviews';

export function useVenueReviews(venueId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.review.list({ venueId }),
    queryFn: () => reviewsApi.getList({ venueId: venueId!, limit: 20 }),
    enabled: Boolean(venueId),
    staleTime: 60_000,
  });
}

export function useReviewEligibility(venueId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.review.eligibility(venueId ?? ''),
    queryFn: () => reviewsApi.getEligibility(venueId!),
    enabled: enabled && Boolean(venueId),
    staleTime: 30_000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.review.create(),
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.create(payload),
    onSuccess: (_review, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.review.list({ venueId: variables.venueId }),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.review.eligibility(variables.venueId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.venue.detail(variables.venueId) });
    },
  });
}
