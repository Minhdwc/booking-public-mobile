import { Pressable, Text, View } from 'react-native';

type StarRatingPickerProps = {
  value: number;
  onChange: (rating: number) => void;
};

export function StarRatingPicker({ value, onChange }: StarRatingPickerProps) {
  return (
    <View className="flex-row gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} className="px-1 active:opacity-70">
          <Text className="text-3xl">{star <= value ? '★' : '☆'}</Text>
        </Pressable>
      ))}
    </View>
  );
}
