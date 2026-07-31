import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { formatBookingDate, formatSlotTime } from '@/components/booking/booking-utils';
import { Badge, bookingStatusBadge } from '@/components/ui';
import { Booking, getPrimaryBookingItem } from '@/features/bookings';
import { formatVnd } from '@/features/venues';

type BookingListItemProps = {
  booking: Booking;
};

export function BookingListItem({ booking }: BookingListItemProps) {
  const primaryItem = getPrimaryBookingItem(booking);
  const status = bookingStatusBadge(booking.status);

  return (
    <Pressable
      onPress={() => router.push(`/bookings/${booking.id}`)}
      className="gap-3 rounded-3xl border border-ink/10 bg-paper p-5 active:opacity-90 dark:border-paper/10 dark:bg-court-deep"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-extrabold text-ink dark:text-paper">
            {primaryItem?.court?.name ?? 'Sân'}
          </Text>
          <Text className="text-sm text-mist">
            {[primaryItem?.court?.venue?.name, primaryItem?.court?.sport?.name, booking.bookingCode]
              .filter(Boolean)
              .join(' · ') || '—'}
          </Text>
        </View>
        <Badge label={status.label} variant={status.variant} />
      </View>

      {primaryItem ? (
        <View className="gap-1">
          <Text className="text-sm text-ink dark:text-paper">
            {formatBookingDate(primaryItem.date)} · {formatSlotTime(primaryItem.startTime)}–
            {formatSlotTime(primaryItem.endTime)}
          </Text>
          {booking.items && booking.items.length > 1 ? (
            <Text className="text-sm text-mist">+ {booking.items.length - 1} khung giờ khác</Text>
          ) : null}
        </View>
      ) : null}

      <View className="flex-row items-center justify-between border-t border-ink/10 pt-3 dark:border-paper/10">
        <Text className="text-sm text-mist">Tổng thanh toán</Text>
        <Text className="text-base font-extrabold text-line">{formatVnd(booking.finalAmount)}</Text>
      </View>
    </Pressable>
  );
}
