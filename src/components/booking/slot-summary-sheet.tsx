import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SelectedSlot } from '@/features/bookings';
import { formatVnd } from '@/features/venues/venues.mapper';
import { PrimaryButton } from '@/components/ui';

import { calculateSlotsSubtotal, formatSlotTime } from './booking-utils';

type SlotSummarySheetProps = {
  selectedSlots: SelectedSlot[];
  buttonLabel: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
};

export function SlotSummarySheet({
  selectedSlots,
  buttonLabel,
  disabled,
  loading,
  onPress,
}: SlotSummarySheetProps) {
  const insets = useSafeAreaInsets();
  const subtotal = calculateSlotsSubtotal(selectedSlots);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-ink/10 bg-paper px-6 pt-4 dark:border-paper/10 dark:bg-ink"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="mb-3 gap-1 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/10">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-mist">Tạm tính</Text>
          <Text className="text-base font-extrabold text-ink dark:text-paper">
            {formatVnd(subtotal)}
          </Text>
        </View>
        {selectedSlots.length > 0 ? (
          <Text className="text-xs text-mist" numberOfLines={2}>
            {selectedSlots.length} khung ·{' '}
            {selectedSlots
              .map(
                (slot) =>
                  `${formatSlotTime(slot.startTime)}–${formatSlotTime(slot.endTime)}`,
              )
              .join(', ')}
          </Text>
        ) : (
          <Text className="text-xs text-mist">Chưa chọn khung giờ</Text>
        )}
      </View>

      <PrimaryButton
        label={buttonLabel}
        disabled={disabled || selectedSlots.length === 0}
        loading={loading}
        onPress={onPress}
      />
    </View>
  );
}
