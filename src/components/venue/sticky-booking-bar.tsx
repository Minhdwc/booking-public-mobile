import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';

type StickyBookingBarProps = {
  label?: string;
  subtitle?: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function StickyBookingBar({
  label = 'Chọn sân đặt',
  subtitle,
  disabled,
  onPress,
}: StickyBookingBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-ink/10 bg-paper px-6 pt-4 dark:border-paper/10 dark:bg-ink"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {subtitle ? <Text className="mb-2 text-center text-xs text-mist">{subtitle}</Text> : null}
      <PrimaryButton label={label} disabled={disabled} onPress={onPress} />
    </View>
  );
}
