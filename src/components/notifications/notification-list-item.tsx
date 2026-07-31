import { Pressable, Text, View } from 'react-native';

import { formatDateTime } from '@/components/booking/booking-utils';
import { Badge } from '@/components/ui';
import { Notification } from '@/features/notifications';

type NotificationListItemProps = {
  notification: Notification;
  onPress: (notification: Notification) => void;
};

export function NotificationListItem({ notification, onPress }: NotificationListItemProps) {
  return (
    <Pressable
      onPress={() => onPress(notification)}
      className={`gap-2 rounded-3xl border p-5 active:opacity-90 ${
        notification.isRead
          ? 'border-ink/10 bg-paper dark:border-paper/10 dark:bg-court-deep'
          : 'border-line/30 bg-line/10'
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-base font-extrabold text-ink dark:text-paper">
          {notification.title}
        </Text>
        {!notification.isRead ? <Badge label="Mới" variant="accent" /> : null}
      </View>

      <Text className="text-xs text-mist">{formatDateTime(notification.createdAt)}</Text>
      <Text className="text-sm leading-6 text-ink dark:text-paper">{notification.message}</Text>
    </Pressable>
  );
}
