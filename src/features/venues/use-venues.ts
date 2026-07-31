import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import {
  mapVenueDetail,
  mapVenuesToListItems,
  VenueDetail,
  VenuesListParams,
  venuesApi,
} from './venues';

export function useVenueDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.venue.detail(id ?? ''),
    queryFn: async (): Promise<VenueDetail> => {
      if (!id) throw new Error('Thiếu mã cơ sở');

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

export function useVenues(params: VenuesListParams = {}) {
  return useQuery({
    queryKey: queryKeys.venue.list(params),
    queryFn: async () => {
      const result = await venuesApi.getList(params);
      const items = mapVenuesToListItems(result.data);

      return { ...result, data: items, total: items.length };
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}
