import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { CourtMotif } from '@/components/auth/court-motif';
import type { VenueListItem } from '@/features/venues';

type VenueCardProps = {
  venue: VenueListItem;
  compact?: boolean;
  onPress?: () => void;
};

export function VenueCard({ venue, compact, onPress }: VenueCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-3xl border border-ink/10 bg-paper active:opacity-90 dark:border-paper/10 dark:bg-court-deep"
    >
      <View className={`relative overflow-hidden bg-court ${compact ? 'h-32' : 'h-40'}`}>
        {venue.coverImageUrl ? (
          <Image source={{ uri: venue.coverImageUrl }} className="h-full w-full" contentFit="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <CourtMotif className="-right-8 -top-4 opacity-60" />
            <Text className="text-4xl">🏟️</Text>
          </View>
        )}
        <View className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1">
          <Text className="text-xs font-bold text-paper">
            {venue.ratingLabel === 'Mới' ? venue.ratingLabel : `★ ${venue.ratingLabel}`}
          </Text>
        </View>
      </View>

      <View className={`gap-2 ${compact ? 'p-3' : 'gap-3 p-4'}`}>
        <Text className="text-xs font-bold uppercase tracking-widest text-line">{venue.sportLabel}</Text>
        <Text
          className={`font-extrabold text-ink dark:text-paper ${compact ? 'text-base' : 'text-lg'}`}
          numberOfLines={2}
        >
          {venue.name}
        </Text>
        <Text className="text-sm text-mist" numberOfLines={1}>
          {venue.addressShort}
        </Text>

        {!compact ? (
          <View className="flex-row flex-wrap gap-2">
            {venue.priceLabel ? <Tag label={venue.priceLabel} highlight /> : null}
            <Tag label={venue.courtCountLabel} />
            {venue.hoursLabel ? <Tag label={venue.hoursLabel} /> : null}
          </View>
        ) : (
          <Text className="text-sm font-bold text-ink dark:text-paper">
            {venue.priceLabel ?? venue.courtCountLabel}
          </Text>
        )}

        {!compact ? (
          <View className="mt-1 items-center rounded-full bg-line py-3">
            <Text className="text-sm font-extrabold text-ink">Xem & đặt sân</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function Tag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <View
      className={`rounded-full px-3 py-1 ${highlight ? 'bg-line/30' : 'bg-ink/5 dark:bg-paper/10'}`}
    >
      <Text
        className={`text-xs font-bold ${highlight ? 'text-ink' : 'text-mist'}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export function VenueCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <View className="overflow-hidden rounded-3xl border border-ink/10 bg-paper dark:border-paper/10 dark:bg-court-deep">
      <View className={`bg-ink/10 dark:bg-paper/10 ${compact ? 'h-32' : 'h-40'}`} />
      <View className={`gap-3 ${compact ? 'p-3' : 'p-4'}`}>
        <View className="h-3 w-20 rounded bg-ink/10 dark:bg-paper/10" />
        <View className="h-5 w-4/5 rounded bg-ink/10 dark:bg-paper/10" />
        <View className="h-4 w-1/2 rounded bg-ink/10 dark:bg-paper/10" />
        {!compact ? <View className="mt-2 h-11 rounded-full bg-ink/10 dark:bg-paper/10" /> : null}
      </View>
    </View>
  );
}
