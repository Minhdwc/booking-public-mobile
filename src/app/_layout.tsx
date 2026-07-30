import 'react-native-gesture-handler';
import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/features/auth';

const APP_BACKGROUND = '#F7F5EF';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    void init();
  }, [init]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: APP_BACKGROUND }}>
      <SafeAreaProvider>
        <QueryProvider>
          <View style={{ flex: 1, backgroundColor: APP_BACKGROUND }}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: APP_BACKGROUND },
                animation: 'default',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="venues" />
            </Stack>
          </View>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
