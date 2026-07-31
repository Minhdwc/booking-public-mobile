import { apiClient } from '@/services/http/client';

export interface FavoritesSummary {
  venueIds: string[];
}

export interface ToggleFavoriteResponse extends FavoritesSummary {
  isFavorite: boolean;
}

export const favoritesApi = {
  getSummary() {
    return apiClient.get<FavoritesSummary>('/favorites');
  },

  toggleVenue(venueId: string) {
    return apiClient.post<ToggleFavoriteResponse>(`/favorites/venues/${venueId}/toggle`);
  },
};

export function isVenueFavorite(summary: FavoritesSummary | undefined, venueId: string) {
  return summary?.venueIds.includes(venueId) ?? false;
}
