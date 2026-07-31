import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { mapVenueDetail } from './venues.mapper';
import { venuesApi } from './venues.api';
import type { VenueDetail } from './venues.type';

export function useVenueDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.venue.detail(id ?? ''),
    queryFn: async (): Promise<VenueDetail> => {
      if (!id) {
        throw new Error('Thiếu mã cơ sở');
      }

      const [venue, amenityLinks] = await Promise.all([
        venuesApi.getById(id),
        venuesApi.getAmenities(id),
      ]);

      return mapVenueDetail(venue, amenityLinks);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
