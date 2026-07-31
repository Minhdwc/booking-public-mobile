import { apiClient } from '@/services/http/client';
import type { PaginatedResult } from '@/services/http/response';
import { unwrapList } from '@/services/http/response';

import type { Venue, VenueAmenityLink, VenuesListParams } from './venues.type';

export const venuesApi = {
  getList(params: VenuesListParams = {}) {
    return apiClient.get<PaginatedResult<Venue>>('/venues', { params });
  },

  getById(id: string) {
    return apiClient.get<Venue>(`/venues/${id}`);
  },

  async getAmenities(venueId: string) {
    const result = await apiClient.get<PaginatedResult<VenueAmenityLink> | VenueAmenityLink[]>(
      `/amenities/venue/${venueId}`,
      { params: { page: 1, limit: 100 } },
    );

    return unwrapList(result);
  },
};
