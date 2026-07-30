import { apiClient } from '@/services/http/client';
import type { PaginatedResult } from '@/services/http/response';
import { unwrapPage } from '@/services/http/response';

import type { Venue } from '@/features/venues/venues.type';

import type { PopularSearchItem, SearchSuggestion, SearchVenuesParams } from './search.type';

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
