import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/auth/auth-hero';
import { EmptyState } from '@/components/ui';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth/use-auth';

export default function NotificationsTabScreen() {
  const { isLoggedIn } = useAuth();

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <AuthHero
        eyebrow="Thông báo"
        title="Cập nhật mới nhất"
        subtitle="Trạng thái booking, thanh toán và ưu đãi sẽ hiện tại đây."
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-6 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {!isLoggedIn ? (
            <EmptyState
              title="Đăng nhập để nhận thông báo"
              message="Bạn sẽ nhận cập nhật khi booking được xác nhận hoặc sắp đến giờ chơi."
              emoji="🔔"
              actionLabel="Đăng nhập"
              onAction={() => router.push('/login')}
            />
          ) : (
            <EmptyState
              title="Chưa có thông báo"
              message="Thông báo real-time sẽ có ở Phase 6 (Socket.io)."
              emoji="🔔"
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
