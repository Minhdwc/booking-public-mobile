import { Pressable, ScrollView, Text, View } from 'react-native';

import { PopularSearchItem } from '@/features/search';

type PopularSearchChipsProps = {
  items: PopularSearchItem[];
  onSelect: (query: string) => void;
};

export function PopularSearchChips({ items, onSelect }: PopularSearchChipsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item) => (
        <Pressable
          key={item.query}
          onPress={() => onSelect(item.query)}
          className="mr-2 rounded-full border border-ink/15 bg-paper px-4 py-2 active:opacity-80 dark:border-paper/20 dark:bg-court-deep"
        >
          <Text className="text-sm font-bold text-ink dark:text-paper">{item.query}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

type PopularSearchSectionProps = {
  items: PopularSearchItem[];
  isLoading?: boolean;
  onSelect: (query: string) => void;
};

export function PopularSearchSection({ items, isLoading, onSelect }: PopularSearchSectionProps) {
  if (isLoading) {
    return (
      <View className="flex-row gap-2">
        <View className="h-9 w-24 rounded-full bg-ink/10 dark:bg-paper/10" />
        <View className="h-9 w-28 rounded-full bg-ink/10 dark:bg-paper/10" />
        <View className="h-9 w-20 rounded-full bg-ink/10 dark:bg-paper/10" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <Text className="text-sm text-mist">Chưa có từ khóa phổ biến. Hãy thử tìm kiếm sân.</Text>
    );
  }

  return <PopularSearchChips items={items} onSelect={onSelect} />;
}
