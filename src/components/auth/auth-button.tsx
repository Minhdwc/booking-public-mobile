import { ActivityIndicator, Pressable, type PressableProps, Text } from 'react-native';

type AuthButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
};

export function AuthButton({
  label,
  loading,
  disabled,
  className = '',
  ...props
}: AuthButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={`bg-line mt-2 items-center rounded-full py-4 active:opacity-80 disabled:opacity-50 ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#10201A" />
      ) : (
        <Text className="text-ink text-base font-extrabold">{label}</Text>
      )}
    </Pressable>
  );
}
