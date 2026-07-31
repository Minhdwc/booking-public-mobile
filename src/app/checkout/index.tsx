import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { formatSlotTime } from '@/components/booking/booking-utils';
import { ErrorState, PrimaryButton, ScreenHeader } from '@/components/ui';
import { useBookingDraftStore } from '@/features/bookings';
import { formatVnd } from '@/features/venues/venues.mapper';

export default function CheckoutPlaceholderScreen() {
  const draft = useBookingDraftStore((state) => state.draft);

  if (!draft || draft.selectedSlots.length === 0) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Thanh toán" />
        <View className="px-6 pt-4">
          <ErrorState
            title="Chưa có booking draft"
            message="Quay lại chọn sân và khung giờ trước khi thanh toán."
            actionLabel="Quay lại"
            onRetry={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const subtotal = draft.selectedSlots.reduce((sum, slot) => sum + slot.subtotal, 0);

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Xác nhận đặt sân" subtitle="Phase 4 sẽ tích hợp thanh toán VNPay" />

      <ScrollView contentContainerClassName="gap-4 px-6 pb-8 pt-4">
        <View className="gap-2 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
          <Text className="text-xs font-bold uppercase tracking-widest text-line">Cơ sở</Text>
          <Text className="text-lg font-extrabold text-ink dark:text-paper">{draft.venueName}</Text>
          <Text className="text-base font-bold text-ink dark:text-paper">{draft.courtName}</Text>
          <Text className="text-sm text-mist">Ngày {draft.date}</Text>
        </View>

        <View className="gap-3 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
          <Text className="text-base font-extrabold text-ink dark:text-paper">Khung giờ đã chọn</Text>
          {draft.selectedSlots.map((slot) => (
            <View key={`${slot.startTime}-${slot.endTime}`} className="flex-row justify-between">
              <Text className="text-sm text-ink dark:text-paper">
                {formatSlotTime(slot.startTime)}–{formatSlotTime(slot.endTime)}
              </Text>
              <Text className="text-sm font-bold text-ink dark:text-paper">
                {formatVnd(slot.subtotal)}
              </Text>
            </View>
          ))}
          <View className="mt-2 flex-row justify-between border-t border-ink/10 pt-3 dark:border-paper/10">
            <Text className="font-extrabold text-ink dark:text-paper">Tổng tạm tính</Text>
            <Text className="font-extrabold text-ink dark:text-paper">{formatVnd(subtotal)}</Text>
          </View>
        </View>

        <View className="rounded-2xl bg-court p-4">
          <Text className="text-sm leading-6 text-paper">
            Màn checkout đầy đủ (tạo booking + VNPay) sẽ có ở Phase 4.
          </Text>
        </View>

        <PrimaryButton label="Quay lại chọn giờ" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}
