import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { buildSportFilterOptions } from './sports.mapper';
import { sportsApi } from './sports.api';
import type { Sport, SportChipItem } from './sports.type';

type SportsQueryData = {
  sports: Sport[];
  chipOptions: SportChipItem[];
};

export function useSports() {
  return useQuery<Sport[], Error, SportsQueryData>({
    queryKey: queryKeys.sport.list(),
    queryFn: () => sportsApi.getList(),
    staleTime: 5 * 60_000,
    select: (sports) => ({
      sports,
      chipOptions: buildSportFilterOptions(sports),
    }),
  });
}
