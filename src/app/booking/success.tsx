import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { LoadingState, PrimaryButton, ScreenHeader } from '@/components/ui';
import { useBookingDetail, useBookingDraftStore } from '@/features/bookings';
import { formatVnd } from '@/features/venues';

export default function BookingSuccessScreen() {
  const { bookingId, paymentId } = useLocalSearchParams<{ bookingId?: string; paymentId?: string }>();
  const clearDraft = useBookingDraftStore((state) => state.clearDraft);

  const { data: booking, isLoading } = useBookingDetail(bookingId);

  useEffect(() => {
    clearDraft();
  }, [clearDraft]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Thanh toán thành công" />
        <LoadingState message="Đang tải..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Thanh toán thành công" />

      <View className="flex-1 gap-6 px-6 pt-6">
        <View className="items-center gap-3 rounded-3xl border border-line/30 bg-line/10 p-8">
          <Text className="text-5xl">✓</Text>
          <Text className="text-center text-2xl font-extrabold text-ink dark:text-paper">
            Đặt sân thành công!
          </Text>
          <Text className="text-center text-sm leading-6 text-mist">
            Thanh toán đã được xác nhận. Bạn có thể xem chi tiết trong tab Đặt sân.
          </Text>
        </View>

        {booking ? (
          <View className="gap-2 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
            <Text className="text-sm text-mist">Mã đặt sân</Text>
            <Text className="text-lg font-extrabold text-ink dark:text-paper">{booking.bookingCode}</Text>
            <Text className="text-sm text-mist">Số tiền</Text>
            <Text className="text-base font-bold text-line">{formatVnd(booking.finalAmount)}</Text>
          </View>
        ) : null}

        {paymentId ? (
          <Text className="text-center text-xs text-mist">Mã thanh toán: {paymentId}</Text>
        ) : null}

        <PrimaryButton label="Về trang chủ" onPress={() => router.replace('/')} />
        <PrimaryButton
          label="Xem đặt sân của tôi"
          variant="secondary"
          onPress={() => router.replace('/(tabs)/bookings')}
        />
      </View>
    </View>
  );
}
