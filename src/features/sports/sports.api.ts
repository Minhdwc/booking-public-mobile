import { apiClient } from '@/services/http/client';
import type { PaginatedResult } from '@/services/http/response';
import { unwrapList } from '@/services/http/response';

import type { Sport } from './sports.type';

export const sportsApi = {
  async getList(limit = 100) {
    const result = await apiClient.get<PaginatedResult<Sport> | Sport[]>('/sports', {
      params: { page: 1, limit },
    });

    return unwrapList(result);
  },
};
