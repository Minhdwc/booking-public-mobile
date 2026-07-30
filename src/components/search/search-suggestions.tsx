import { Pressable, Text, View } from 'react-native';

import type { SearchSuggestion } from '@/features/search';

type SearchSuggestionsProps = {
  suggestions: SearchSuggestion[];
  visible: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
};

export function SearchSuggestions({
  suggestions,
  visible,
  onSelect,
}: SearchSuggestionsProps) {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <View className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-lg dark:border-paper/10 dark:bg-court-deep">
      {suggestions.map((suggestion) => (
        <Pressable
          key={`${suggestion.type}-${suggestion.label}-${suggestion.venueId ?? ''}`}
          onPress={() => onSelect(suggestion)}
          className="flex-row items-start justify-between gap-3 border-b border-ink/5 px-4 py-3 active:bg-ink/5 dark:border-paper/5 dark:active:bg-paper/5"
        >
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-ink dark:text-paper" numberOfLines={1}>
              {suggestion.label}
            </Text>
            {suggestion.address ? (
              <Text className="mt-0.5 text-sm text-mist" numberOfLines={1}>
                {suggestion.address}
              </Text>
            ) : null}
          </View>
          <Text className="shrink-0 text-xs font-bold uppercase tracking-wider text-mist">
            {suggestion.type === 'venue' ? 'Cơ sở' : 'Phổ biến'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
