import { Pressable, Text, View, type ViewProps } from 'react-native';

type EmptyStateProps = ViewProps & {
  title: string;
  message?: string;
  emoji?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  message,
  emoji = '🏟️',
  actionLabel,
  onAction,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={`items-center rounded-3xl border border-ink/10 px-6 py-10 dark:border-paper/10 ${className}`}
      {...props}
    >
      <Text className="text-4xl">{emoji}</Text>
      <Text className="mt-4 text-center text-base font-extrabold text-ink dark:text-paper">
        {title}
      </Text>
      {message ? (
        <Text className="mt-2 text-center text-sm leading-5 text-mist">{message}</Text>
      ) : null}
      {onAction && actionLabel ? (
        <Pressable
          onPress={onAction}
          className="mt-5 rounded-full bg-line px-5 py-3 active:opacity-80"
        >
          <Text className="text-sm font-extrabold text-ink">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
