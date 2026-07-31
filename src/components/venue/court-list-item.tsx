import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui';
import { VenueCourtListItem } from '@/features/venues';

type CourtListItemProps = {
  court: VenueCourtListItem;
  onPress?: () => void;
};

export function CourtListItem({ court, onPress }: CourtListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!court.isBookable}
      className="gap-3 rounded-3xl border border-ink/10 bg-paper p-4 active:opacity-90 disabled:opacity-60 dark:border-paper/10 dark:bg-court-deep"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-xs font-bold uppercase tracking-widest text-line">
            {court.sportName}
          </Text>
          <Text className="text-base font-extrabold text-ink dark:text-paper">{court.name}</Text>
          <Text className="text-sm font-bold text-ink dark:text-paper">{court.priceLabel}</Text>
          <Text className="text-xs text-mist">{court.durationLabel}</Text>
        </View>
        <Badge
          label={court.statusLabel}
          variant={court.isBookable ? 'accent' : 'muted'}
        />
      </View>

      {court.isBookable ? (
        <View className="items-center rounded-full bg-line py-3">
          <Text className="text-sm font-extrabold text-ink">Chọn sân này</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
