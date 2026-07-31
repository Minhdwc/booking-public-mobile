import { router } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationListItem } from '@/components/notifications/notification-list-item';
import { AuthHero } from '@/components/auth/auth-hero';
import { EmptyState, ErrorState, LoadingState, PrimaryButton } from '@/components/ui';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import {
  Notification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/features/notifications';

export default function NotificationsTabScreen() {
  const { isLoggedIn } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotificationCount(isLoggedIn);
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useNotifications(isLoggedIn);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const handlePressNotification = (notification: Notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <AuthHero
        eyebrow="Thông báo"
        title="Cập nhật mới nhất"
        subtitle={
          isLoggedIn && unreadCount > 0
            ? `${unreadCount} thông báo chưa đọc`
            : 'Trạng thái booking, thanh toán và ưu đãi sẽ hiện tại đây.'
        }
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-6 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            isLoggedIn ? (
              <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
            ) : undefined
          }
        >
          {!isLoggedIn ? (
            <EmptyState
              title="Đăng nhập để nhận thông báo"
              message="Bạn sẽ nhận cập nhật khi booking được xác nhận hoặc sắp đến giờ chơi."
              emoji="🔔"
              actionLabel="Đăng nhập"
              onAction={() => router.push('/login')}
            />
          ) : isLoading ? (
            <LoadingState message="Đang tải thông báo..." />
          ) : isError ? (
            <ErrorState
              title="Không tải được thông báo"
              message="Vui lòng thử lại."
              actionLabel="Thử lại"
              onRetry={() => void refetch()}
            />
          ) : (
            <View className="gap-4">
              {unreadCount > 0 ? (
                <PrimaryButton
                  label={markAllRead.isPending ? 'Đang cập nhật...' : 'Đánh dấu tất cả đã đọc'}
                  variant="secondary"
                  loading={markAllRead.isPending}
                  onPress={() => markAllRead.mutate()}
                />
              ) : null}

              {!notifications?.length ? (
                <EmptyState
                  title="Chưa có thông báo"
                  message="Thông báo sẽ hiển thị tại đây khi bạn có booking mới."
                  emoji="🔔"
                />
              ) : (
                notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    onPress={handlePressNotification}
                  />
                ))
              )}

              {markRead.isError ? (
                <Text className="text-sm text-clay">Không thể đánh dấu đã đọc. Thử lại sau.</Text>
              ) : null}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
