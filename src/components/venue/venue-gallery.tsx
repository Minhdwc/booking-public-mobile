import { Image } from 'expo-image';
import { Dimensions, ScrollView, Text, View } from 'react-native';

import { CourtMotif } from '@/components/auth/court-motif';

type VenueGalleryProps = {
  imageUrls: string[];
  venueName: string;
};

const GALLERY_WIDTH = Dimensions.get('window').width - 48;

export function VenueGallery({ imageUrls, venueName }: VenueGalleryProps) {
  if (imageUrls.length === 0) {
    return (
      <View className="relative h-56 overflow-hidden rounded-3xl bg-court">
        <CourtMotif className="-right-10 -top-6 opacity-60" />
        <View className="h-full items-center justify-center">
          <Text className="text-5xl">🏟️</Text>
          <Text className="mt-2 text-sm font-bold text-paper/80">Chưa có ảnh</Text>
        </View>
      </View>
    );
  }

  if (imageUrls.length === 1) {
    return (
      <View className="h-56 overflow-hidden rounded-3xl">
        <Image
          source={{ uri: imageUrls[0] }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          accessibilityLabel={`Ảnh ${venueName}`}
        />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={GALLERY_WIDTH + 12}
      contentContainerClassName="gap-3"
    >
      {imageUrls.map((url, index) => (
        <View
          key={`${url}-${index}`}
          style={{ width: GALLERY_WIDTH }}
          className="h-56 overflow-hidden rounded-3xl"
        >
          <Image
            source={{ uri: url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            accessibilityLabel={`Ảnh ${venueName} ${index + 1}`}
          />
        </View>
      ))}
    </ScrollView>
  );
}
