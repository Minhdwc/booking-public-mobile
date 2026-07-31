import * as GestureHandler from 'react-native-gesture-handler';
import '@/global.css';
import '@/lib/nativewind-interop';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/features/auth';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    void init();
  }, [init]);

  return (
    <GestureHandler.GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F7F5EF' }}>
      <SafeAreaProvider>
        <QueryProvider>
          <View style={{ flex: 1, backgroundColor: '#F7F5EF' }}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F7F5EF' },
                animation: 'default',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="venues" />
              <Stack.Screen name="courts" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="booking" />
              <Stack.Screen name="bookings" />
            </Stack>
          </View>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandler.GestureHandlerRootView>
  );
}
