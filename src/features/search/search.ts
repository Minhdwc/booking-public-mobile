import { useQuery } from '@tanstack/react-query';

import { mapVenuesToListItems, Venue, VenueListItem, venuesApi } from '@/features/venues';
import { queryKeys } from '@/lib/react-query/query-keys';
import { apiClient } from '@/services/http/client';
import { PaginatedResult, unwrapPage } from '@/services/http/response';

export interface SearchVenuesParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface PopularSearchItem {
  query: string;
  count: number;
}

export interface SearchSuggestion {
  type: 'popular' | 'venue';
  label: string;
  count?: number;
  venueId?: string;
  address?: string;
}

export interface RecentlyViewedVenue extends Venue {}

export const searchApi = {
  searchVenues(params: SearchVenuesParams) {
    return apiClient.get<PaginatedResult<Venue> | Venue[]>('/search/venues', {
      params: {
        q: params.q,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    });
  },

  async searchVenuesPage(params: SearchVenuesParams) {
    const payload = await this.searchVenues(params);
    return unwrapPage(payload);
  },

  getPopular(limit = 8) {
    return apiClient.get<PopularSearchItem[]>('/search/popular', { params: { limit } });
  },

  getSuggestions(q = '', limit = 8) {
    return apiClient.get<SearchSuggestion[]>('/search/suggestions', {
      params: { q, limit },
    });
  },

  getRecentlyViewed() {
    return apiClient.get<Venue[]>('/search/recently-viewed');
  },
};

type ExploreVenuesParams = {
  search?: string;
  page?: number;
  limit?: number;
};

type ExploreVenuesResult = {
  page: number;
  limit: number;
  total: number;
  data: VenueListItem[];
};

export function useExploreVenues(params: ExploreVenuesParams = {}) {
  const keyword = params.search?.trim() ?? '';
  const hasKeyword = keyword.length > 0;

  return useQuery({
    queryKey: hasKeyword
      ? queryKeys.search.venues({ q: keyword, page: params.page, limit: params.limit })
      : queryKeys.venue.list(params),
    queryFn: async (): Promise<ExploreVenuesResult> => {
      if (hasKeyword) {
        const result = await searchApi.searchVenuesPage({
          q: keyword,
          page: params.page,
          limit: params.limit,
        });
        const items = mapVenuesToListItems(result.data);
        return { ...result, data: items, total: items.length };
      }

      const result = await venuesApi.getList(params);
      const items = mapVenuesToListItems(result.data);
      return { ...result, data: items, total: items.length };
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useSearchSuggestions(q: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search.suggestions(q, 8),
    queryFn: () => searchApi.getSuggestions(q, 8),
    enabled,
    staleTime: 30_000,
  });
}

export function usePopularSearches(limit = 8) {
  return useQuery({
    queryKey: queryKeys.search.popular(limit),
    queryFn: () => searchApi.getPopular(limit),
    staleTime: 5 * 60_000,
  });
}

export function useRecentlyViewed(enabled = true) {
  return useQuery({
    queryKey: queryKeys.search.recentlyViewed(),
    queryFn: async () => {
      const venues = await searchApi.getRecentlyViewed();
      return mapVenuesToListItems(venues);
    },
    enabled,
    staleTime: 60_000,
  });
}

export function filterVenuesBySport(
  venues: VenueListItem[],
  sportId: string,
  sportName?: string,
): VenueListItem[] {
  if (sportId === 'all' || !sportName) return venues;

  const normalizedSport = sportName.toLowerCase();

  return venues.filter((venue) =>
    venue.sportNames.some((name) => {
      const normalizedName = name.toLowerCase();
      return (
        normalizedName === normalizedSport ||
        normalizedName.includes(normalizedSport) ||
        normalizedSport.includes(normalizedName)
      );
    }),
  );
}
