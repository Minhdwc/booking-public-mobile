import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/navigation/tab-icon';
import { useAuth } from '@/features/auth';
import { useUnreadNotificationCount } from '@/features/notifications';

export default function AppTabs() {
  const { isLoggedIn } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotificationCount(isLoggedIn);

  const notificationBadge =
    unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#F7F5EF' },
        tabBarActiveTintColor: '#10201A',
        tabBarInactiveTintColor: '#8FA69B',
        tabBarStyle: {
          backgroundColor: '#F7F5EF',
          borderTopColor: 'rgba(16, 32, 26, 0.12)',
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Đặt sân',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} />,
          tabBarBadge: notificationBadge,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
