import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { courtsApi } from './courts.api';

export function useCourtAvailability(courtId: string | undefined, date: string) {
  return useQuery({
    queryKey: queryKeys.court.availability(courtId ?? '', date),
    queryFn: () => courtsApi.getAvailability(courtId!, date),
    enabled: Boolean(courtId && date),
    staleTime: 30_000,
  });
}
