import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type PrimaryButtonVariant = 'primary' | 'secondary' | 'ghost';
type PrimaryButtonSize = 'md' | 'lg';

type PrimaryButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: PrimaryButtonVariant;
  size?: PrimaryButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<PrimaryButtonVariant, string> = {
  primary: 'bg-line active:opacity-80',
  secondary: 'border border-ink/15 bg-paper active:opacity-80 dark:border-paper/15 dark:bg-court-deep',
  ghost: 'bg-transparent active:opacity-70',
};

const sizeClasses: Record<PrimaryButtonSize, string> = {
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
};

const textVariantClasses: Record<PrimaryButtonVariant, string> = {
  primary: 'text-ink',
  secondary: 'text-ink dark:text-paper',
  ghost: 'text-ink dark:text-paper',
};

const textSizeClasses: Record<PrimaryButtonSize, string> = {
  md: 'text-sm',
  lg: 'text-base',
};

export function PrimaryButton({
  label,
  loading,
  disabled,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={`items-center rounded-full disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#10201A' : '#8FA69B'} />
      ) : (
        <Text
          className={`font-extrabold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
