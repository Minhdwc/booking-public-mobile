import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VenueDetailPlaceholderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-base text-mist">
          Màn chi tiết sân sẽ có ở Sprint 3.
        </Text>
        <Text className="mt-2 text-center text-sm font-bold text-ink dark:text-paper">
          Venue ID: {id}
        </Text>
      </SafeAreaView>
    </View>
  );
}
