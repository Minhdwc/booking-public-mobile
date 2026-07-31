import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { bookingsApi, CreateBookingPayload, isBookingHoldActive } from './bookings';

type UseBookingDetailOptions = {
  refetchInterval?: number | false;
};

export function useBookingsList(enabled = true) {
  return useQuery({
    queryKey: queryKeys.booking.list(),
    queryFn: () => bookingsApi.list(),
    enabled,
    refetchInterval: (query) => {
      const items = query.state.data ?? [];
      const hasPendingHold = items.some((booking) => isBookingHoldActive(booking));
      return hasPendingHold ? 5_000 : 30_000;
    },
    staleTime: 10_000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.booking.create(),
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.create(payload),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.list() });
      void queryClient.setQueryData(queryKeys.booking.detail(booking.id), booking);

      for (const item of booking.items ?? []) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.court.availability(item.courtId, item.date),
        });
      }
    },
  });
}

export function useBookingDetail(id: string | undefined, options: UseBookingDetailOptions = {}) {
  return useQuery({
    queryKey: queryKeys.booking.detail(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('Thiếu mã đặt sân');
      return bookingsApi.getById(id);
    },
    enabled: Boolean(id),
    refetchInterval: options.refetchInterval,
    staleTime: 5_000,
  });
}

export function useBookingTimeline(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.booking.timeline(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('Thiếu mã đặt sân');
      return bookingsApi.getTimeline(id);
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.booking.edit('cancel'),
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.list() });
      void queryClient.setQueryData(queryKeys.booking.detail(booking.id), booking);
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.timeline(booking.id) });

      for (const item of booking.items ?? []) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.court.availability(item.courtId, item.date),
        });
      }
    },
  });
}
