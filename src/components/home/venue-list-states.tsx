import { Pressable, Text, View } from 'react-native';

type VenueListStateProps = {
  onRetry?: () => void;
};

export function VenueListEmpty({ onRetry }: VenueListStateProps) {
  return (
    <View className="items-center rounded-3xl border border-ink/10 px-6 py-10 dark:border-paper/10">
      <Text className="text-4xl">🏟️</Text>
      <Text className="mt-4 text-base font-extrabold text-ink dark:text-paper">
        Chưa có sân khả dụng
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-mist">
        Thử tìm từ khóa khác hoặc quay lại sau khi có thêm sân active.
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-full bg-line px-5 py-3 active:opacity-80"
        >
          <Text className="text-sm font-extrabold text-ink">Thử lại</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function VenueListError({ onRetry }: VenueListStateProps) {
  return (
    <View className="items-center rounded-3xl border border-clay/30 bg-clay/5 px-6 py-10">
      <Text className="text-4xl">⚠️</Text>
      <Text className="mt-4 text-base font-extrabold text-ink dark:text-paper">
        Không tải được danh sách sân
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-mist">
        Kiểm tra kết nối mạng và API URL, rồi thử lại.
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-full bg-line px-5 py-3 active:opacity-80"
        >
          <Text className="text-sm font-extrabold text-ink">Thử lại</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
