import { Text, View, type ViewProps } from 'react-native';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'muted';

type BadgeProps = ViewProps & {
  label: string;
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  default: {
    container: 'bg-ink/5 dark:bg-paper/10',
    text: 'text-ink dark:text-paper',
  },
  accent: {
    container: 'bg-line/30',
    text: 'text-ink',
  },
  success: {
    container: 'bg-line/20',
    text: 'text-court',
  },
  warning: {
    container: 'bg-clay/15',
    text: 'text-clay',
  },
  muted: {
    container: 'bg-mist/20',
    text: 'text-mist',
  },
};

export function Badge({ label, variant = 'default', className = '', ...props }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`self-start rounded-full px-3 py-1 ${styles.container} ${className}`} {...props}>
      <Text className={`text-xs font-bold ${styles.text}`} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Map booking status → badge variant + Vietnamese label */
export function bookingStatusBadge(status: string): { label: string; variant: BadgeVariant } {
  switch (status) {
    case 'waiting_payment':
      return { label: 'Chờ thanh toán', variant: 'warning' };
    case 'confirmed':
      return { label: 'Đã xác nhận', variant: 'accent' };
    case 'completed':
      return { label: 'Hoàn thành', variant: 'success' };
    case 'cancelled':
      return { label: 'Đã hủy', variant: 'muted' };
    case 'expired':
      return { label: 'Hết hạn', variant: 'warning' };
    case 'paid_at_venue':
      return { label: 'Thanh toán tại sân', variant: 'accent' };
    default:
      return { label: status, variant: 'default' };
  }
}
