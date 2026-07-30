import type { Venue } from '@/features/venues/venues.type';

export type SearchVenuesParams = {
  q: string;
  page?: number;
  limit?: number;
};

export type PopularSearchItem = {
  query: string;
  count: number;
};

export type SearchSuggestion = {
  type: 'popular' | 'venue';
  label: string;
  count?: number;
  venueId?: string;
  address?: string;
};

export type { Venue as RecentlyViewedVenue };
