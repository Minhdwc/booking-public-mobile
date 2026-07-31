import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ui';

export default function CourtDetailPlaceholderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Chi tiết sân con" subtitle={`Court ID: ${id}`} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-base text-mist">
          Màn chọn khung giờ sẽ có ở Sprint 4 (Phase 3).
        </Text>
      </View>
    </View>
  );
}
