import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { DatePickerRow } from '@/components/booking/date-picker-row';
import { SlotGrid } from '@/components/booking/slot-grid';
import { SlotSummarySheet } from '@/components/booking/slot-summary-sheet';
import {
  buildCourtReturnPath,
  next7Days,
  todayLocalIsoDate,
} from '@/components/booking/booking-utils';
import { ErrorState, LoadingState, ScreenHeader } from '@/components/ui';
import { useAuthStore } from '@/features/auth/auth.store';
import type { SelectedSlot } from '@/features/bookings';
import { useBookingDraftStore } from '@/features/bookings';
import { useCourtAvailability, useCourtDetail } from '@/features/courts';

export default function CourtDetailScreen() {
  const { id, date: dateParam } = useLocalSearchParams<{ id: string; date?: string }>();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const setDraft = useBookingDraftStore((state) => state.setDraft);
  const storedDraft = useBookingDraftStore((state) => state.draft);

  const days = useMemo(() => next7Days(), []);
  const [selectedDate, setSelectedDate] = useState(dateParam ?? todayLocalIsoDate());
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  const { data: court, isLoading, isError, refetch, isRefetching } = useCourtDetail(id);
  const {
    data: availability,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
    refetch: refetchAvailability,
  } = useCourtAvailability(id, selectedDate);

  useEffect(() => {
    if (typeof dateParam === 'string' && dateParam.length > 0) {
      setSelectedDate(dateParam);
    }
  }, [dateParam]);

  useEffect(() => {
    if (!id || !storedDraft || storedDraft.courtId !== id) return;
    if (storedDraft.date) setSelectedDate(storedDraft.date);
    if (storedDraft.selectedSlots.length > 0) {
      setSelectedSlots(storedDraft.selectedSlots);
    }
  }, [id, storedDraft]);

  const handleContinue = () => {
    if (!court || selectedSlots.length === 0) return;

    const draft = {
      courtId: court.id,
      courtName: court.name,
      venueId: court.venueId,
      venueName: court.venueName,
      date: selectedDate,
      selectedSlots,
    };

    setDraft(draft);

    if (!isLoggedIn) {
      router.push({
        pathname: '/(auth)/login',
        params: { returnTo: buildCourtReturnPath(court.id) },
      });
      return;
    }

    router.push('/checkout');
  };

  const buttonLabel = !isAuthLoading && !isLoggedIn ? 'Đăng nhập để tiếp tục' : 'Tiếp tục';

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Đặt sân" />
        <View className="gap-4 px-6 pt-4">
          <LoadingState variant="card" />
        </View>
      </View>
    );
  }

  if (isError || !court) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Đặt sân" />
        <View className="px-6 pt-4">
          <ErrorState
            title="Không tìm thấy sân"
            message="Sân không tồn tại hoặc tạm thời không khả dụng."
            onRetry={() => void refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title={court.name} subtitle={court.venueName} />

      <ScrollView
        contentContainerClassName="gap-6 px-6 pb-44 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              void refetch();
              void refetchAvailability();
            }}
          />
        }
      >
        {!court.isBookable ? (
          <View className="rounded-2xl bg-clay/10 px-4 py-3">
            <Text className="text-sm font-bold text-clay">
              Sân đang tạm ngưng. Vui lòng chọn sân khác.
            </Text>
          </View>
        ) : null}

        <View className="overflow-hidden rounded-3xl bg-court">
          {court.coverImageUrl ? (
            <Image source={{ uri: court.coverImageUrl }} className="h-40 w-full" contentFit="cover" />
          ) : (
            <View className="h-40 items-center justify-center">
              <Text className="text-5xl">🎾</Text>
            </View>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-line">
            {court.sportName}
          </Text>
          <Text className="text-xl font-extrabold text-ink dark:text-paper">{court.name}</Text>
          <Text className="text-sm text-mist">{court.venueAddress}</Text>
          <Text className="text-sm font-bold text-ink dark:text-paper">{court.priceLabel}</Text>
          <Text className="text-xs text-mist">{court.durationLabel}</Text>
        </View>

        {court.description ? (
          <Text className="text-sm leading-6 text-mist">{court.description}</Text>
        ) : null}

        <View className="gap-3">
          <Text className="text-base font-extrabold text-ink dark:text-paper">Ngày chơi</Text>
          <DatePickerRow
            days={days}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlots([]);
            }}
          />
        </View>

        <View className="gap-3">
          <Text className="text-base font-extrabold text-ink dark:text-paper">Khung giờ</Text>
          <SlotGrid
            slots={availability?.slots ?? []}
            selectedSlots={selectedSlots}
            onChange={setSelectedSlots}
            isLoading={isAvailabilityLoading}
            isError={isAvailabilityError}
            errorMessage={
              availabilityError instanceof Error ? availabilityError.message : undefined
            }
          />
        </View>
      </ScrollView>

      <SlotSummarySheet
        selectedSlots={selectedSlots}
        buttonLabel={buttonLabel}
        disabled={!court.isBookable}
        onPress={handleContinue}
      />
    </View>
  );
}
