import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { mapCourtDetail } from './courts.mapper';
import { courtsApi } from './courts.api';
import type { CourtDetail } from './courts.type';

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
