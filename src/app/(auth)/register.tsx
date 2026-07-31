import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHero } from '@/components/auth/auth-hero';
import { AuthInput } from '@/components/auth/auth-input';
import { registerSchema, useAuth } from '@/features/auth';

export default function RegisterScreen() {
  const { signUp, isSubmitting, getErrorMessage } = useAuth();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRegister() {
    setError('');

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ');
      return;
    }

    try {
      await signUp(parsed.data);
      router.replace('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <Stack.Screen options={{ headerShown: false }} />

      <AuthHero
        eyebrow="Chỉ mất 1 phút"
        title="Tạo tài khoản"
        subtitle="Đăng ký để giữ chỗ, theo dõi lịch sử đặt sân và ưu đãi riêng."
        showBack
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <SafeAreaView edges={['bottom']} className="flex-1">
          <ScrollView
            contentContainerClassName="gap-5 px-6 pb-10 pt-8"
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row gap-4">
              <AuthInput
                className="flex-1"
                label="Họ tên"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChangeText={(value) => updateField('name', value)}
              />
              <AuthInput
                className="flex-1"
                label="Username"
                placeholder="vana"
                autoCapitalize="none"
                value={form.username}
                onChangeText={(value) => updateField('username', value)}
              />
            </View>

            <AuthInput
              label="Email"
              placeholder="ban@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => updateField('email', value)}
            />

            <AuthInput
              label="Số điện thoại"
              placeholder="0901 234 567"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
            />

            <View className="flex-row gap-4">
              <AuthInput
                className="flex-1"
                label="Mật khẩu"
                placeholder="••••••••"
                secureTextEntry
                value={form.password}
                onChangeText={(value) => updateField('password', value)}
              />
              <AuthInput
                className="flex-1"
                label="Xác nhận"
                placeholder="••••••••"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
              />
            </View>

            {error ? <Text className="text-sm text-clay">{error}</Text> : null}

            <AuthButton label="Đăng ký" loading={isSubmitting} onPress={handleRegister} />

            <View className="mt-2 flex-row justify-center">
              <Text className="text-sm text-mist">Đã có tài khoản? </Text>
              <Link href="/login">
                <Text className="text-sm font-extrabold text-ink dark:text-paper">Đăng nhập</Text>
              </Link>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
