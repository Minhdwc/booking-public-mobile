import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

type AuthInputProps = TextInputProps & {
  label: string;
};
export const AuthInput = forwardRef<TextInput, AuthInputProps>(function AuthInput(
  { label, className = '', ...props },
  ref,
) {
  return (
    <View className="gap-1.5">
      <Text className="text-mist text-xs font-bold uppercase tracking-widest">{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor="#8FA69B"
        className={`border-ink/15 text-ink dark:border-paper/20 dark:text-paper border-b pb-2.5 text-base ${className}`}
        {...props}
      />
    </View>
  );
});
