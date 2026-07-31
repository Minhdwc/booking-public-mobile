import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { formatBookingDate, formatDateTime, formatSlotTime } from '@/components/booking/booking-utils';
import {
  Badge,
  bookingStatusBadge,
  ErrorState,
  LoadingState,
  PrimaryButton,
  ScreenHeader,
} from '@/components/ui';
import {
  canCancelBooking,
  formatTimelineAction,
  getPrimaryBookingItem,
  useBookingDetail,
  useBookingTimeline,
  useCancelBooking,
} from '@/features/bookings';
import { isPaymentReturnSuccess, usePaymentFlow } from '@/features/payments';
import { formatVnd } from '@/features/venues';
import { useCountdown } from '@/lib/hooks/use-countdown';
import { ApiError } from '@/services/http/errors';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [actionError, setActionError] = useState('');
  const didExpireRef = useRef(false);

  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useBookingDetail(id, { refetchInterval: id ? 5_000 : false });
  const { data: timeline, isLoading: isTimelineLoading } = useBookingTimeline(id);
  const cancelBooking = useCancelBooking();
  const { payWithVnpay, isPaying } = usePaymentFlow();

  const { formatted, isExpired } = useCountdown(booking?.expiresAt);

  useEffect(() => {
    if (!isExpired || didExpireRef.current || !id) return;
    didExpireRef.current = true;
    void refetch();
  }, [isExpired, id, refetch]);

  const handleCancel = () => {
    if (!id) return;

    Alert.alert('Hủy đặt sân', 'Bạn có chắc muốn hủy lịch đặt này?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Hủy lịch',
        style: 'destructive',
        onPress: () => {
          setActionError('');
          cancelBooking.mutate(id, {
            onError: (error) => {
              const message = error instanceof ApiError ? error.message : 'Không thể hủy đặt sân';
              setActionError(message);
            },
          });
        },
      },
    ]);
  };

  const handlePayWithVnpay = async () => {
    if (!id) return;

    setActionError('');

    try {
      const result = await payWithVnpay(id);

      if (isPaymentReturnSuccess(result)) {
        router.replace({
          pathname: '/booking/success',
          params: { bookingId: id, paymentId: result.paymentId ?? '' },
        });
        return;
      }

      router.replace({
        pathname: '/booking/failed',
        params: { bookingId: id, status: result.status },
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể mở VNPay';
      setActionError(message);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Chi tiết đặt sân" showBack />
        <LoadingState message="Đang tải..." />
      </View>
    );
  }

  if (isError || !booking) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Chi tiết đặt sân" showBack />
        <View className="px-6 pt-4">
          <ErrorState
            title="Không tải được đặt sân"
            message="Vui lòng thử lại."
            actionLabel="Thử lại"
            onRetry={() => void refetch()}
          />
        </View>
      </View>
    );
  }

  const primaryItem = getPrimaryBookingItem(booking);
  const status = bookingStatusBadge(booking.status);
  const canPay = booking.status === 'waiting_payment' && !isExpired;
  const showCancel = canCancelBooking(booking);

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Chi tiết đặt sân" subtitle={booking.bookingCode} showBack />

      <ScrollView contentContainerClassName="gap-4 px-6 pb-8 pt-4">
        <View className="gap-3 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-xl font-extrabold text-ink dark:text-paper">
                {primaryItem?.court?.name ?? 'Sân'}
              </Text>
              <Text className="text-sm text-mist">
                {[primaryItem?.court?.venue?.name, primaryItem?.court?.sport?.name]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </Text>
            </View>
            <Badge label={status.label} variant={status.variant} />
          </View>

          {canPay ? (
            <View className="rounded-2xl bg-clay/15 px-3 py-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-clay">
                Còn lại để thanh toán
              </Text>
              <Text className="text-xl font-extrabold tabular-nums text-clay">{formatted}</Text>
            </View>
          ) : null}

          {booking.items?.map((item) => (
            <View
              key={item.id}
              className="gap-1 border-t border-ink/10 pt-3 dark:border-paper/10"
            >
              <Text className="text-sm text-ink dark:text-paper">
                Ngày: <Text className="font-bold">{formatBookingDate(item.date)}</Text>
              </Text>
              <Text className="text-sm text-ink dark:text-paper">
                Giờ:{' '}
                <Text className="font-bold">
                  {formatSlotTime(item.startTime)}–{formatSlotTime(item.endTime)}
                </Text>
              </Text>
              <Text className="text-sm text-mist">{formatVnd(item.subtotal)}</Text>
            </View>
          ))}

          <View className="flex-row justify-between border-t border-ink/10 pt-3 dark:border-paper/10">
            <Text className="font-extrabold text-ink dark:text-paper">Tổng thanh toán</Text>
            <Text className="font-extrabold text-line">{formatVnd(booking.finalAmount)}</Text>
          </View>
        </View>

        {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}

        {canPay ? (
          <>
            <PrimaryButton
              label={isPaying ? 'Đang chuyển VNPay...' : 'Thanh toán VNPay'}
              loading={isPaying}
              onPress={() => void handlePayWithVnpay()}
            />
            <PrimaryButton
              label="Tiếp tục tại checkout"
              variant="secondary"
              onPress={() => router.push({ pathname: '/checkout', params: { bookingId: id } })}
            />
          </>
        ) : null}

        {showCancel ? (
          <PrimaryButton
            label={cancelBooking.isPending ? 'Đang hủy...' : 'Hủy đặt sân'}
            variant="secondary"
            loading={cancelBooking.isPending}
            onPress={handleCancel}
          />
        ) : null}

        <View className="gap-3 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
          <Text className="text-base font-extrabold text-ink dark:text-paper">Lịch sử</Text>

          {isTimelineLoading ? (
            <Text className="text-sm text-mist">Đang tải lịch sử...</Text>
          ) : !timeline?.length ? (
            <Text className="text-sm text-mist">Chưa có sự kiện nào.</Text>
          ) : (
            timeline.map((event, index) => (
              <View
                key={event.id}
                className={`gap-1 ${index > 0 ? 'border-t border-ink/10 pt-3 dark:border-paper/10' : ''}`}
              >
                <Text className="text-sm font-bold text-ink dark:text-paper">
                  {formatTimelineAction(event.action)}
                </Text>
                {event.fromValue && event.toValue ? (
                  <Text className="text-sm text-mist">
                    {event.fromValue} → {event.toValue}
                  </Text>
                ) : null}
                {event.note ? <Text className="text-sm text-mist">{event.note}</Text> : null}
                <Text className="text-xs text-mist">{formatDateTime(event.createdAt)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
