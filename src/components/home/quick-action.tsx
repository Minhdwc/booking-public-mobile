import { ReactNode } from 'react';
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
      className="flex-1 rounded-2xl border border-ink/10 bg-paper p-4 active:bg-line/10 dark:border-paper/10 dark:bg-court-deep"
    >
      <Text className="text-2xl">{emoji}</Text>
      <Text className="mt-3 text-sm font-extrabold text-ink dark:text-paper">{label}</Text>
      <Text className="mt-1 text-xs leading-4 text-mist">{hint}</Text>
    </Pressable>
  );
}

type QuickActionRowProps = {
  children: ReactNode;
};

export function QuickActionRow({ children }: QuickActionRowProps) {
  return <View className="flex-row gap-3">{children}</View>;
}
