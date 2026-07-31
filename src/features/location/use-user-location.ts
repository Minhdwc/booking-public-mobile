import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { getCurrentPosition, isLocationAvailable, type UserCoordinates } from './location.service';

type UseUserLocationOptions = {
  auto?: boolean;
};

export function useUserLocation(options: UseUserLocationOptions = {}) {
  const { auto = false } = options;
  const canUseLocation = isLocationAvailable();

  return useQuery<UserCoordinates, Error>({
    queryKey: queryKeys.location.current(),
    queryFn: getCurrentPosition,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
    retry: false,
    enabled: auto && canUseLocation,
  });
}

export { isLocationAvailable };
