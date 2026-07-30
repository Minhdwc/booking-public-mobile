import { apiClient } from '@/services/http/client';
import type { PaginatedResult } from '@/services/http/response';

import type { Venue, VenuesListParams } from './venues.type';

export const venuesApi = {
  getList(params: VenuesListParams = {}) {
    return apiClient.get<PaginatedResult<Venue>>('/venues', { params });
  },
};
