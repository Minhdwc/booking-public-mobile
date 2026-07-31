import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { formatBookingDate, formatSlotTime } from '@/components/booking/booking-utils';
import { ErrorState, LoadingState, PrimaryButton, ScreenHeader } from '@/components/ui';
import {
  bookingsApi,
  draftToCreateBookingPayload,
  useBookingDetail,
  useBookingDraftStore,
  useCreateBooking,
} from '@/features/bookings';
import { isPaymentReturnSuccess, usePaymentFlow } from '@/features/payments';
import { formatVnd } from '@/features/venues';
import { useCountdown } from '@/lib/hooks/use-countdown';
import { ApiError } from '@/services/http/errors';

export default function CheckoutScreen() {
  const { bookingId: bookingIdParam } = useLocalSearchParams<{ bookingId?: string }>();
  const draft = useBookingDraftStore((state) => state.draft);
  const clearDraft = useBookingDraftStore((state) => state.clearDraft);

  const [bookingId, setBookingId] = useState<string | undefined>(
    typeof bookingIdParam === 'string' ? bookingIdParam : undefined,
  );
  const [actionError, setActionError] = useState('');
  const didExpireRef = useRef(false);

  const createBooking = useCreateBooking();
  const { payWithVnpay, isPaying } = usePaymentFlow();

  const {
    data: booking,
    isLoading: isBookingLoading,
    isError: isBookingError,
    refetch: refetchBooking,
  } = useBookingDetail(bookingId, { refetchInterval: bookingId ? 5_000 : false });

  const { formatted, isExpired } = useCountdown(booking?.expiresAt);

  useEffect(() => {
    if (typeof bookingIdParam === 'string' && bookingIdParam.length > 0) {
      setBookingId(bookingIdParam);
    }
  }, [bookingIdParam]);

  useEffect(() => {
    if (!isExpired || didExpireRef.current || !bookingId) return;
    didExpireRef.current = true;
    void refetchBooking();
  }, [isExpired, bookingId, refetchBooking]);

  const handleConfirmBooking = async () => {
    if (!draft || draft.selectedSlots.length === 0) return;

    setActionError('');

    try {
      const created = await createBooking.mutateAsync(draftToCreateBookingPayload(draft));
      setBookingId(created.id);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể tạo đặt sân';
      setActionError(message);
    }
  };

  const handlePayWithVnpay = async () => {
    if (!bookingId) return;

    setActionError('');

    try {
      const result = await payWithVnpay(bookingId);

      if (isPaymentReturnSuccess(result)) {
        clearDraft();
        router.replace({
          pathname: '/booking/success',
          params: { bookingId, paymentId: result.paymentId ?? '' },
        });
        return;
      }

      router.replace({
        pathname: '/booking/failed',
        params: { bookingId, status: result.status },
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể mở VNPay';
      setActionError(message);
    }
  };

  const handleCancelHold = async () => {
    if (!bookingId) return;

    setActionError('');

    try {
      await bookingsApi.cancel(bookingId);
      clearDraft();
      router.back();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể hủy giữ chỗ';
      setActionError(message);
    }
  };

  if (!bookingId && (!draft || draft.selectedSlots.length === 0)) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Thanh toán" />
        <View className="px-6 pt-4">
          <ErrorState
            title="Chưa có thông tin đặt sân"
            message="Quay lại chọn sân và khung giờ trước khi thanh toán."
            actionLabel="Quay lại"
            onRetry={() => router.back()}
          />
        </View>
      </View>
    );
  }

  if (!bookingId && draft) {
    const subtotal = draft.selectedSlots.reduce((sum, slot) => sum + slot.subtotal, 0);

    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader
          title="Xác nhận đặt sân"
          subtitle="Kiểm tra thông tin trước khi giữ chỗ"
        />

        <ScrollView contentContainerClassName="gap-4 px-6 pb-8 pt-4">
          <View className="gap-2 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
            <Text className="text-xs font-bold uppercase tracking-widest text-line">Cơ sở</Text>
            <Text className="text-lg font-extrabold text-ink dark:text-paper">{draft.venueName}</Text>
            <Text className="text-base font-bold text-ink dark:text-paper">{draft.courtName}</Text>
            <Text className="text-sm text-mist">Ngày {formatBookingDate(draft.date)}</Text>
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

          {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}

          <PrimaryButton
            label={createBooking.isPending ? 'Đang giữ chỗ...' : 'Xác nhận & giữ chỗ'}
            loading={createBooking.isPending}
            onPress={() => void handleConfirmBooking()}
          />
          <PrimaryButton label="Quay lại chọn giờ" variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </View>
    );
  }

  if (isBookingLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Thanh toán" />
        <LoadingState message="Đang tải thông tin đặt sân..." />
      </View>
    );
  }

  if (isBookingError || !booking) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Thanh toán" />
        <View className="px-6 pt-4">
          <ErrorState
            title="Không tải được thông tin đặt sân"
            message="Vui lòng thử lại."
            actionLabel="Thử lại"
            onRetry={() => void refetchBooking()}
          />
        </View>
      </View>
    );
  }

  const primaryItem = booking.items?.[0];
  const canPay = booking.status === 'waiting_payment' && !isExpired;

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader
        title="Xác nhận & thanh toán"
        subtitle={`Mã đặt sân: ${booking.bookingCode}`}
      />

      <ScrollView contentContainerClassName="gap-4 px-6 pb-8 pt-4">
        <View className="gap-3 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-lg font-extrabold text-ink dark:text-paper">
                {primaryItem?.court?.name ?? draft?.courtName ?? 'Sân'}
              </Text>
              <Text className="text-sm text-mist">
                {[primaryItem?.court?.venue?.name ?? draft?.venueName, booking.bookingCode]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>

            {canPay ? (
              <View className="rounded-2xl bg-clay/15 px-3 py-2">
                <Text className="text-xs font-bold uppercase tracking-widest text-clay">Còn lại</Text>
                <Text className="text-xl font-extrabold tabular-nums text-clay">{formatted}</Text>
              </View>
            ) : null}
          </View>

          {primaryItem ? (
            <View className="gap-1">
              <Text className="text-sm text-ink dark:text-paper">
                Ngày:{' '}
                <Text className="font-bold">{formatBookingDate(primaryItem.date)}</Text>
              </Text>
              <Text className="text-sm text-ink dark:text-paper">
                Giờ:{' '}
                <Text className="font-bold">
                  {formatSlotTime(primaryItem.startTime)}–{formatSlotTime(primaryItem.endTime)}
                </Text>
              </Text>
              {booking.items && booking.items.length > 1 ? (
                <Text className="text-sm text-mist">+ {booking.items.length - 1} khung giờ khác</Text>
              ) : null}
            </View>
          ) : null}

          <View className="mt-2 flex-row justify-between border-t border-ink/10 pt-3 dark:border-paper/10">
            <Text className="font-extrabold text-ink dark:text-paper">Tổng thanh toán</Text>
            <Text className="font-extrabold text-line">{formatVnd(booking.finalAmount)}</Text>
          </View>
        </View>

        {!canPay ? (
          <View className="rounded-2xl bg-court p-4">
            <Text className="text-sm leading-6 text-paper">
              {isExpired
                ? 'Giữ chỗ đã hết hạn. Vui lòng đặt lại khung giờ mới.'
                : 'Đơn đặt này không còn chờ thanh toán.'}
            </Text>
          </View>
        ) : null}

        {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}

        {canPay ? (
          <PrimaryButton
            label={isPaying ? 'Đang chuyển VNPay...' : 'Thanh toán VNPay'}
            loading={isPaying}
            onPress={() => void handlePayWithVnpay()}
          />
        ) : null}

        {canPay ? (
          <PrimaryButton
            label="Hủy giữ chỗ"
            variant="secondary"
            onPress={() => void handleCancelHold()}
          />
        ) : (
          <PrimaryButton
            label="Quay lại sân"
            variant="secondary"
            onPress={() =>
              router.replace(`/courts/${primaryItem?.courtId ?? draft?.courtId ?? ''}`)
            }
          />
        )}
      </ScrollView>
    </View>
  );
}
