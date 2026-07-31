import { apiClient } from '@/services/http/client';

import type { Court, CourtAvailability } from './courts.type';

export const courtsApi = {
  getById(id: string) {
    return apiClient.get<Court>(`/courts/${id}`);
  },

  getAvailability(courtId: string, date: string) {
    return apiClient.get<CourtAvailability>(`/courts/${courtId}/availability`, {
      params: { date },
    });
  },
};
