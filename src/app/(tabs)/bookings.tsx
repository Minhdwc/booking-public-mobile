import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatSlotTime } from '@/components/booking/booking-utils';
import { AuthHero } from '@/components/auth/auth-hero';
import { SectionHeader } from '@/components/home/section-header';
import { EmptyState, PrimaryButton } from '@/components/ui';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import { useBookingDraftStore } from '@/features/bookings';
import { formatVnd } from '@/features/venues';

export default function BookingsTabScreen() {
  const { isLoggedIn } = useAuth();
  const draft = useBookingDraftStore((state) => state.draft);

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <AuthHero
        eyebrow="Lịch đặt"
        title="Booking của bạn"
        subtitle={
          draft
            ? 'Bạn đang có lượt đặt dở — tiếp tục thanh toán.'
            : 'Theo dõi lịch sân và trạng thái thanh toán.'
        }
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-6 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {draft && draft.selectedSlots.length > 0 ? (
            <View className="gap-4 rounded-3xl border border-line/30 bg-line/10 p-5">
              <SectionHeader
                eyebrow="Đang đặt dở"
                title={draft.courtName}
                subtitle={`${draft.venueName} · ${draft.date}`}
              />
              <Text className="text-sm text-mist">
                {draft.selectedSlots.length} khung ·{' '}
                {formatVnd(draft.selectedSlots.reduce((sum, slot) => sum + slot.subtotal, 0))}
              </Text>
              {draft.selectedSlots.map((slot) => (
                <Text key={`${slot.startTime}-${slot.endTime}`} className="text-sm text-ink dark:text-paper">
                  {formatSlotTime(slot.startTime)}–{formatSlotTime(slot.endTime)}
                </Text>
              ))}
              <PrimaryButton
                label="Tiếp tục thanh toán"
                onPress={() => router.push('/checkout')}
              />
            </View>
          ) : null}

          {!isLoggedIn ? (
            <EmptyState
              title="Đăng nhập để xem lịch đặt"
              message="Lưu booking, theo dõi trạng thái và thanh toán nhanh hơn."
              emoji="📅"
              actionLabel="Đăng nhập"
              onAction={() => router.push('/login')}
            />
          ) : (
            <EmptyState
              title="Chưa có booking nào"
              message="Chưa có đặt sân nào. Hãy tìm sân từ tab Khám phá."
              emoji="🏟️"
              actionLabel="Tìm sân"
              onAction={() => router.push('/explore')}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
