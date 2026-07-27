import { Pressable, Text, View } from 'react-native';

import { CourtMotif } from '@/components/auth/court-motif';

export type VenuePreview = {
  id: string;
  name: string;
  sport: string;
  distance: string;
  price: string;
  rating: string;
  slots: string;
};

type VenueCardProps = {
  venue: VenuePreview;
  onPress?: () => void;
};

export function VenueCard({ venue, onPress }: VenueCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-court relative overflow-hidden rounded-3xl active:opacity-90"
    >
      <CourtMotif className="-right-16 -top-6 opacity-40" />

      <View className="gap-3 p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-line text-xs font-bold uppercase tracking-widest">
              {venue.sport}
            </Text>
            <Text className="text-paper text-lg font-extrabold">{venue.name}</Text>
          </View>
          <View className="bg-line/15 rounded-full px-2.5 py-1">
            <Text className="text-line text-xs font-bold">★ {venue.rating}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <Tag label={venue.distance} />
          <Tag label={venue.price} />
          <Tag label={venue.slots} highlight />
        </View>
      </View>
    </Pressable>
  );
}

function Tag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <View
      className={`rounded-full px-3 py-1 ${highlight ? 'bg-line' : 'bg-paper/10'}`}
    >
      <Text
        className={`text-xs font-bold ${highlight ? 'text-ink' : 'text-paper'}`}
      >
        {label}
      </Text>
    </View>
  );
}
