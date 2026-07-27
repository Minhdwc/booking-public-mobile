import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type QuickActionProps = {
  emoji: string;
  label: string;
  hint: string;
  onPress?: () => void;
};

export function QuickAction({ emoji, label, hint, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-paper dark:bg-court-deep border-ink/10 dark:border-paper/10 active:bg-line/10 flex-1 rounded-2xl border p-4"
    >
      <Text className="text-2xl">{emoji}</Text>
      <Text className="text-ink dark:text-paper mt-3 text-sm font-extrabold">{label}</Text>
      <Text className="text-mist mt-1 text-xs leading-4">{hint}</Text>
    </Pressable>
  );
}

type QuickActionRowProps = {
  children: ReactNode;
};

export function QuickActionRow({ children }: QuickActionRowProps) {
  return <View className="flex-row gap-3">{children}</View>;
}
