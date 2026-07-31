import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, Text, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  right,
  className = '',
  ...props
}: ScreenHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={['top']} className={`bg-paper dark:bg-ink ${className}`} {...props}>
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        {showBack ? (
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            className="h-10 w-10 items-center justify-center rounded-full bg-ink/5 active:opacity-70 dark:bg-paper/10"
          >
            <Text className="text-lg font-bold text-ink dark:text-paper">←</Text>
          </Pressable>
        ) : (
          <View className="h-10 w-10" />
        )}

        <View className="min-w-0 flex-1">
          <Text className="text-lg font-extrabold text-ink dark:text-paper" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-sm text-mist" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {right ?? <View className="h-10 w-10" />}
      </View>
    </SafeAreaView>
  );
}
