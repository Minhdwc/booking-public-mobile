import { Pressable, Text, View } from 'react-native';

import { SelectedSlot } from '@/features/bookings';
import { AvailabilitySlot } from '@/features/courts';
import { formatVnd } from '@/features/venues';

import {
  formatSlotTime,
  isSlotSelectable,
  isSlotSelected,
  slotKey,
  toggleSelectedSlot,
} from './booking-utils';

type SlotGridProps = {
  slots: AvailabilitySlot[];
  selectedDate: string;
  selectedSlots: SelectedSlot[];
  onChange: (slots: SelectedSlot[]) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

export function SlotGrid({
  slots,
  selectedDate,
  selectedSlots,
  onChange,
  isLoading,
  isError,
  errorMessage,
}: SlotGridProps) {
  if (isLoading) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <View key={index} className="h-11 w-[31%] rounded-2xl bg-ink/10 dark:bg-paper/10" />
        ))}
      </View>
    );
  }

  if (isError) {
    return <Text className="text-sm text-clay">{errorMessage ?? 'Không tải được khung giờ'}</Text>;
  }

  if (slots.length === 0) {
    return <Text className="text-sm text-mist">Chưa có khung giờ khả dụng cho ngày này.</Text>;
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {slots.map((slot) => {
        const normalized: SelectedSlot = {
          startTime: slot.startTime,
          endTime: slot.endTime,
          subtotal: slot.subtotal,
        };
        const booked = slot.status === 'booked';
        const past = slot.status === 'past' || !isSlotSelectable(selectedDate, slot);
        const unavailable = booked || past;
        const selected = isSlotSelected(selectedSlots, normalized);
        const label = `${formatSlotTime(slot.startTime)}–${formatSlotTime(slot.endTime)}`;

        return (
          <Pressable
            key={slotKey(normalized)}
            disabled={unavailable}
            onPress={() => onChange(toggleSelectedSlot(selectedSlots, normalized))}
            className={`w-[31%] rounded-2xl border px-2 py-3 ${
              unavailable
                ? 'border-ink/5 bg-ink/5 opacity-50 dark:border-paper/5 dark:bg-paper/5'
                : selected
                  ? 'border-line bg-line'
                  : 'border-ink/15 bg-paper dark:border-paper/20 dark:bg-court-deep'
            }`}
          >
            <Text
              className={`text-center text-xs font-bold ${
                unavailable ? 'text-mist' : selected ? 'text-ink' : 'text-ink dark:text-paper'
              }`}
              numberOfLines={2}
            >
              {booked ? `${label}\n(hết)` : past ? `${label}\n(đã qua)` : label}
            </Text>
            {!unavailable ? (
              <Text className="mt-1 text-center text-[10px] font-semibold text-mist">
                {formatVnd(slot.subtotal)}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
