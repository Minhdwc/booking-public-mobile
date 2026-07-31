import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingListItem } from '@/components/booking/booking-list-item';
import { formatSlotTime } from '@/components/booking/booking-utils';
import { AuthHero } from '@/components/auth/auth-hero';
import { SectionHeader } from '@/components/home/section-header';
import { EmptyState, ErrorState, LoadingState, PrimaryButton } from '@/components/ui';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import {
  BookingListTab,
  filterBookingsByTab,
  useBookingDraftStore,
  useBookingsList,
} from '@/features/bookings';
import { formatVnd } from '@/features/venues';

const TAB_ITEMS: { id: BookingListTab; label: string }[] = [
  { id: 'upcoming', label: 'Sắp tới' },
  { id: 'past', label: 'Đã chơi' },
  { id: 'cancelled', label: 'Đã hủy' },
];

export default function BookingsTabScreen() {
  const { isLoggedIn } = useAuth();
  const draft = useBookingDraftStore((state) => state.draft);
  const [activeTab, setActiveTab] = useState<BookingListTab>('upcoming');

  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useBookingsList(isLoggedIn);

  const filteredBookings = useMemo(
    () => filterBookingsByTab(bookings ?? [], activeTab),
    [bookings, activeTab],
  );

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
          refreshControl={
            isLoggedIn ? (
              <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
            ) : undefined
          }
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
              <PrimaryButton label="Tiếp tục thanh toán" onPress={() => router.push('/checkout')} />
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
          ) : isLoading ? (
            <LoadingState message="Đang tải lịch đặt..." />
          ) : isError ? (
            <ErrorState
              title="Không tải được lịch đặt"
              message="Vui lòng thử lại."
              actionLabel="Thử lại"
              onRetry={() => void refetch()}
            />
          ) : !bookings?.length ? (
            <EmptyState
              title="Chưa có booking nào"
              message="Hãy tìm sân từ tab Khám phá và đặt khung giờ phù hợp."
              emoji="🏟️"
              actionLabel="Tìm sân"
              onAction={() => router.push('/explore')}
            />
          ) : (
            <View className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                {TAB_ITEMS.map((tab) => {
                  const selected = activeTab === tab.id;

                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
                      className={`rounded-full px-4 py-2 ${
                        selected
                          ? 'bg-line'
                          : 'border border-ink/10 bg-paper dark:border-paper/10 dark:bg-court-deep'
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          selected ? 'text-ink' : 'text-mist'
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {filteredBookings.length === 0 ? (
                <EmptyState
                  title="Không có lịch trong mục này"
                  message="Thử chọn tab khác hoặc đặt sân mới."
                  emoji="📭"
                  actionLabel="Tìm sân"
                  onAction={() => router.push('/explore')}
                />
              ) : (
                filteredBookings.map((booking) => (
                  <BookingListItem key={booking.id} booking={booking} />
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
