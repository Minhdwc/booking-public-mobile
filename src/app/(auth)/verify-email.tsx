import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { verifyEmailSchema } from '@/features/auth/auth.schema';
import { useAuth } from '@/features/auth/use-auth';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function VerifyEmailScreen() {
  const theme = useTheme();
  const { token: tokenFromUrl } = useLocalSearchParams<{ token?: string }>();
  const { verifyEmailToken, isSubmitting, getErrorMessage, isLoggedIn } = useAuth();

  const [token, setToken] = useState(tokenFromUrl ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (tokenFromUrl) {
      void handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  async function handleVerify(value = token) {
    setError('');
    setMessage('');

    const parsed = verifyEmailSchema.safeParse({ token: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Mã xác minh không hợp lệ');
      return;
    }

    try {
      const successMessage = await verifyEmailToken(parsed.data.token);
      setMessage(successMessage);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Xác minh email' }} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}
        >
          <ThemedText type="title" style={styles.title}>
            Xác minh email
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Nhập mã 6 số đã gửi vào email của bạn
          </ThemedText>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
            placeholder="Mã xác minh"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={token}
            onChangeText={setToken}
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          {message ? <ThemedText style={styles.success}>{message}</ThemedText> : null}

          <Pressable
            style={[styles.button, { backgroundColor: theme.text }]}
            onPress={() => handleVerify()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                Xác minh
              </ThemedText>
            )}
          </Pressable>

          {message ? (
            <Pressable
              style={[styles.button, { backgroundColor: theme.backgroundElement }]}
              onPress={() => router.replace(isLoggedIn ? '/' : '/login')}
            >
              <ThemedText style={styles.buttonText}>Tiếp tục</ThemedText>
            </Pressable>
          ) : null}

          <Link href="/login" style={styles.link}>
            <ThemedText type="linkPrimary">Quay lại đăng nhập</ThemedText>
          </Link>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.three },
  form: { flex: 1, justifyContent: 'center', gap: Spacing.two },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 4,
  },
  error: { color: '#ef4444', textAlign: 'center' },
  success: { color: '#16a34a', textAlign: 'center' },
  button: {
    borderRadius: 10,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonText: { fontWeight: '600', fontSize: 16 },
  link: { alignSelf: 'center', marginTop: Spacing.three },
});
