import { Link, router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHero } from '@/components/auth/auth-hero';
import { SectionHeader } from '@/components/home/section-header';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth/use-auth';

export default function AccountTabScreen() {
  const { user, isLoggedIn, signOut, isSubmitting } = useAuth();

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <AuthHero
        eyebrow="Tài khoản"
        title={isLoggedIn && user ? user.name : 'Xin chào bạn'}
        subtitle={
          isLoggedIn && user
            ? `@${user.username} · ${user.phone}`
            : 'Đăng nhập để đặt sân và lưu lịch sử.'
        }
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-6 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoggedIn && user ? (
            <View className="gap-4 rounded-3xl border border-ink/10 p-5 dark:border-paper/10">
              <SectionHeader eyebrow="Hồ sơ" title={user.email} subtitle="Thông tin tài khoản" />

              {!user.emailVerified ? (
                <View className="rounded-2xl bg-clay/10 px-4 py-3">
                  <Text className="text-sm font-bold text-clay">Email chưa xác minh</Text>
                  <Text className="mt-1 text-sm text-mist">
                    Xác minh để nhận thông báo booking và ưu đãi.
                  </Text>
                  <Link href="/verify-email" className="mt-3">
                    <Text className="text-sm font-extrabold text-ink dark:text-paper">
                      Xác minh ngay →
                    </Text>
                  </Link>
                </View>
              ) : (
                <View className="rounded-2xl bg-line/20 px-4 py-3">
                  <Text className="text-sm font-extrabold text-ink">Email đã xác minh ✓</Text>
                  <Text className="mt-1 text-sm text-mist">Bạn có thể đặt sân và nhận thông báo.</Text>
                </View>
              )}

              <MenuRow label="Lịch đặt của tôi" hint="Xem booking" onPress={() => router.push('/bookings')} />
              <MenuRow label="Yêu thích" hint="Sắp có · Phase 7" disabled />
              <MenuRow label="Đổi mật khẩu" hint="Sắp có · Phase 7" disabled />

              <Pressable
                onPress={async () => {
                  await signOut();
                  router.replace('/login');
                }}
                disabled={isSubmitting}
                className="mt-2 items-center rounded-full border border-ink/15 py-4 active:opacity-80 disabled:opacity-50 dark:border-paper/20"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#10201A" />
                ) : (
                  <Text className="text-base font-extrabold text-ink dark:text-paper">Đăng xuất</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              <SectionHeader
                eyebrow="Bắt đầu"
                title="Đăng nhập để đặt sân"
                subtitle="Lưu lịch sử, theo dõi booking và nhận ưu đãi."
              />
              <AuthButton label="Đăng nhập" onPress={() => router.push('/login')} />
              <AuthButton
                label="Tạo tài khoản"
                className="border border-ink/15 bg-paper dark:bg-court-deep"
                onPress={() => router.push('/register')}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MenuRow({
  label,
  hint,
  onPress,
  disabled,
}: {
  label: string;
  hint: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      className="flex-row items-center justify-between rounded-2xl border border-ink/10 px-4 py-3 active:opacity-80 disabled:opacity-50 dark:border-paper/10"
    >
      <View>
        <Text className="text-sm font-extrabold text-ink dark:text-paper">{label}</Text>
        <Text className="text-xs text-mist">{hint}</Text>
      </View>
      <Text className="text-mist">{disabled ? '—' : '→'}</Text>
    </Pressable>
  );
}
