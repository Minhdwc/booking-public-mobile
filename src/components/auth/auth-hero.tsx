import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourtMotif } from './court-motif';

type AuthHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  showBack?: boolean;
};
export function AuthHero({ eyebrow, title, subtitle, showBack }: AuthHeroProps) {
  return (
    <View className="bg-court">
      <SafeAreaView edges={['top']}>
        <View className="relative overflow-hidden px-6 pb-9 pt-4">
          <CourtMotif className="-right-12 -top-4" />

          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              className="border-paper/15 active:bg-paper/10 mb-8 h-9 w-9 items-center justify-center rounded-full border"
            >
              <Text className="text-paper text-base">←</Text>
            </Pressable>
          ) : (
            <View className="mb-8 h-9" />
          )}

          <Text className="text-line text-xs font-bold uppercase tracking-widest">{eyebrow}</Text>
          <Text className="text-paper mt-3 text-4xl font-extrabold">{title}</Text>
          <Text className="text-mist mt-2 max-w-[85%] text-base leading-6">{subtitle}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
