import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { bookingsApi, CreateBookingPayload } from './bookings';

type UseBookingDetailOptions = {
  refetchInterval?: number | false;
};

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
