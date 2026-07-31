import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function AppTabs() {
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@assets/images/tabIcons/home.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@assets/images/tabIcons/explore.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
