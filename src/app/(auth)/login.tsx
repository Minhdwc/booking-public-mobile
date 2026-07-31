import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHero } from '@/components/auth/auth-hero';
import { AuthInput } from '@/components/auth/auth-input';
import { loginSchema } from '@/features/auth/auth.schema';
import { useAuth } from '@/features/auth/use-auth';
import { useBookingDraftStore } from '@/features/bookings';

export default function LoginScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { signIn, isSubmitting, getErrorMessage } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }

    try {
      await signIn(parsed.data);

      const draft = useBookingDraftStore.getState().draft;
      if (draft && draft.selectedSlots.length > 0) {
        router.replace('/checkout');
        return;
      }

      if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
        router.replace(returnTo as `/courts/${string}` | '/');
        return;
      }

      router.replace('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <Stack.Screen options={{ headerShown: false }} />

      <AuthHero
        eyebrow="Sân bãi trong tầm tay"
        title="Đăng nhập"
        subtitle="Vào sân nhanh trong 30 giây, đặt chỗ ngay khi còn trống."
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <SafeAreaView edges={['bottom']} className="flex-1">
          <ScrollView
            contentContainerClassName="flex-1 justify-between px-6 pb-8 pt-8"
            keyboardShouldPersistTaps="handled"
          >
            <View className="gap-5">
              <AuthInput
                label="Email"
                placeholder="ban@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <AuthInput
                label="Mật khẩu"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {error ? <Text className="text-sm text-clay">{error}</Text> : null}

              <AuthButton label="Đăng nhập" loading={isSubmitting} onPress={handleLogin} />
            </View>

            <View className="mt-8 flex-row justify-center">
              <Text className="text-sm text-mist">Chưa có tài khoản? </Text>
              <Link href="/register">
                <Text className="text-sm font-extrabold text-ink dark:text-paper">Đăng ký</Text>
              </Link>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
