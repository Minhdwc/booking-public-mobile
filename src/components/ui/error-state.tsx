import { Pressable, Text, View, type ViewProps } from 'react-native';

type ErrorStateProps = ViewProps & {
  title?: string;
  message?: string;
  emoji?: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu. Kiểm tra kết nối mạng và thử lại.',
  emoji = '⚠️',
  actionLabel = 'Thử lại',
  onRetry,
  className = '',
  ...props
}: ErrorStateProps) {
  return (
    <View
      className={`items-center rounded-3xl border border-clay/30 bg-clay/5 px-6 py-10 ${className}`}
      {...props}
    >
      <Text className="text-4xl">{emoji}</Text>
      <Text className="mt-4 text-center text-base font-extrabold text-ink dark:text-paper">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-mist">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-full bg-line px-5 py-3 active:opacity-80"
        >
          <Text className="text-sm font-extrabold text-ink">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
