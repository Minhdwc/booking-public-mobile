import { Text, View } from 'react-native';

import type { Amenity } from '@/features/venues';

type AmenityGridProps = {
  amenities: Amenity[];
};

export function AmenityGrid({ amenities }: AmenityGridProps) {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <View className="gap-3">
      <Text className="text-lg font-extrabold text-ink dark:text-paper">Tiện ích</Text>
      <View className="flex-row flex-wrap gap-2">
        {amenities.map((amenity) => (
          <View
            key={amenity.id}
            className="min-w-[46%] flex-1 rounded-2xl border border-ink/10 bg-paper px-4 py-3 dark:border-paper/10 dark:bg-court-deep"
          >
            <Text className="text-sm font-bold text-ink dark:text-paper">{amenity.name}</Text>
            {amenity.description ? (
              <Text className="mt-1 text-xs text-mist" numberOfLines={2}>
                {amenity.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
