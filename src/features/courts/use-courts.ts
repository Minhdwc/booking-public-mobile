import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { courtsApi, CourtDetail, mapCourtDetail } from './courts';

export function useCourtDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.court.detail(id ?? ''),
    queryFn: async (): Promise<CourtDetail> => {
      if (!id) throw new Error('Thiếu mã sân');
      const court = await courtsApi.getById(id);
      return mapCourtDetail(court);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCourtAvailability(courtId: string | undefined, date: string) {
  return useQuery({
    queryKey: queryKeys.court.availability(courtId ?? '', date),
    queryFn: () => courtsApi.getAvailability(courtId!, date),
    enabled: Boolean(courtId && date),
    staleTime: 30_000,
  });
}
