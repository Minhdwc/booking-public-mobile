import { Pressable, Text } from 'react-native';

type SportChipProps = {
  label: string;
  emoji: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SportChip({ label, emoji, selected, onPress }: SportChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 flex-row items-center gap-2 rounded-full border px-4 py-2.5 ${
        selected
          ? 'border-line bg-line'
          : 'border-ink/15 bg-paper dark:border-paper/20 dark:bg-court-deep'
      }`}
    >
      <Text>{emoji}</Text>
      <Text className={`text-sm font-bold ${selected ? 'text-ink' : 'text-ink dark:text-paper'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
