import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '@/lib/react-query/query-keys';
import { useVenues, VenueListItem } from '@/features/venues';

import { favoritesApi, isVenueFavorite } from './favorites';

export function useFavoritesSummary(enabled = true) {
  return useQuery({
    queryKey: queryKeys.favorites.summary(),
    queryFn: () => favoritesApi.getSummary(),
    enabled,
    staleTime: 30_000,
  });
}

export function useIsVenueFavorite(venueId: string | undefined, enabled = true) {
  const { data: summary } = useFavoritesSummary(enabled && Boolean(venueId));

  return useMemo(
    () => (venueId ? isVenueFavorite(summary, venueId) : false),
    [summary, venueId],
  );
}

export function useToggleFavoriteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (venueId: string) => favoritesApi.toggleVenue(venueId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favorites.summary() });
    },
  });
}

export function useFavoriteVenues(enabled = true) {
  const { data: summary, isLoading: isSummaryLoading, isError, refetch } = useFavoritesSummary(enabled);
  const venueIds = summary?.venueIds ?? [];

  const {
    data: venuesResult,
    isLoading: isVenuesLoading,
    isError: isVenuesError,
    refetch: refetchVenues,
  } = useVenues({ page: 1, limit: 100 });

  const venues = useMemo(() => {
    if (!venuesResult?.data?.length || !venueIds.length) return [] as VenueListItem[];
    const idSet = new Set(venueIds);
    return venuesResult.data.filter((venue) => idSet.has(venue.id));
  }, [venueIds, venuesResult?.data]);

  return {
    venueIds,
    venues,
    isLoading: isSummaryLoading || (venueIds.length > 0 && isVenuesLoading),
    isError: isError || isVenuesError,
    refetch: () => {
      void refetch();
      void refetchVenues();
    },
  };
}
