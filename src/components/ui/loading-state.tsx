import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

type SkeletonBoxProps = ViewProps & {
  className?: string;
};

export function SkeletonBox({ className = '', ...props }: SkeletonBoxProps) {
  return (
    <View
      className={`rounded bg-ink/10 dark:bg-paper/10 ${className}`}
      accessibilityLabel="Đang tải"
      accessibilityRole="progressbar"
      {...props}
    />
  );
}

type LoadingStateProps = ViewProps & {
  variant?: 'card' | 'list' | 'inline';
  count?: number;
  children?: ReactNode;
};

export function LoadingState({
  variant = 'list',
  count = 3,
  className = '',
  children,
  ...props
}: LoadingStateProps) {
  if (children) {
    return (
      <View className={className} {...props}>
        {children}
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <View className={`flex-row items-center gap-2 ${className}`} {...props}>
        <SkeletonBox className="h-4 w-4 rounded-full" />
        <SkeletonBox className="h-4 flex-1" />
      </View>
    );
  }

  if (variant === 'card') {
    return (
      <View className={`overflow-hidden rounded-3xl border border-ink/10 bg-paper dark:border-paper/10 dark:bg-court-deep ${className}`} {...props}>
        <SkeletonBox className="h-40 w-full rounded-none" />
        <View className="gap-3 p-4">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-5 w-4/5" />
          <SkeletonBox className="h-4 w-1/2" />
          <SkeletonBox className="mt-2 h-11 rounded-full" />
        </View>
      </View>
    );
  }

  return (
    <View className={`gap-3 ${className}`} {...props}>
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          className="overflow-hidden rounded-3xl border border-ink/10 bg-paper dark:border-paper/10 dark:bg-court-deep"
        >
          <SkeletonBox className="h-32 w-full rounded-none" />
          <View className="gap-2 p-3">
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
          </View>
        </View>
      ))}
    </View>
  );
}
