import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { mapVenuesToListItems } from './venues.mapper';
import { venuesApi } from './venues.api';
import type { VenuesListParams } from './venues.type';

export function useVenues(params: VenuesListParams = {}) {
  return useQuery({
    queryKey: queryKeys.venue.list(params),
    queryFn: async () => {
      const result = await venuesApi.getList(params);
      const items = mapVenuesToListItems(result.data);

      return {
        ...result,
        data: items,
        total: items.length,
      };
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}
