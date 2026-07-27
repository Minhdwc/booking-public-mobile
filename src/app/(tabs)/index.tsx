import { Link, router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHero } from '@/components/auth/auth-hero';
import { QuickAction, QuickActionRow } from '@/components/home/quick-action';
import { SectionHeader } from '@/components/home/section-header';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth/use-auth';

export default function HomeScreen() {
  const { user, isLoggedIn, isLoading, signOut, isSubmitting } = useAuth();

  if (isLoading) {
    return (
      <View className="bg-paper dark:bg-ink flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#16342B" />
      </View>
    );
  }

  return (
    <View className="bg-paper dark:bg-ink flex-1">
      <AuthHero
        eyebrow={isLoggedIn ? 'Xin chào' : 'Book sân trong tầm tay'}
        title={isLoggedIn && user ? user.name : 'Đặt sân nhanh'}
        subtitle={
          isLoggedIn
            ? 'Chọn sân gần bạn, giữ chỗ ngay khi còn trống.'
            : 'Tìm sân trống, đặt lịch online — không cần gọi điện.'
        }
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-8 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <SectionHeader
              eyebrow="Hành động nhanh"
              title="Bạn muốn làm gì?"
            />

            <QuickActionRow>
              <QuickAction emoji="🔍" label="Tìm sân" hint="Lọc theo môn & khu vực" />
              <QuickAction emoji="📅" label="Lịch đặt" hint="Xem booking sắp tới" />
            </QuickActionRow>

            <QuickActionRow>
              <QuickAction emoji="⭐" label="Yêu thích" hint="Sân bạn hay đặt" />
              <QuickAction emoji="🎁" label="Ưu đãi" hint="Khuyến mãi tuần này" />
            </QuickActionRow>
          </View>

          {isLoggedIn && user ? (
            <View className="border-ink/10 dark:border-paper/10 gap-4 rounded-3xl border p-5">
              <SectionHeader
                eyebrow="Tài khoản"
                title={user.email}
                subtitle={`@${user.username} · ${user.phone}`}
              />

              {!user.emailVerified ? (
                <View className="bg-clay/10 rounded-2xl px-4 py-3">
                  <Text className="text-clay text-sm font-bold">Email chưa xác minh</Text>
                  <Text className="text-mist mt-1 text-sm">
                    Xác minh để nhận thông báo booking và ưu đãi.
                  </Text>
                  <Link href="/verify-email" className="mt-3">
                    <Text className="text-ink dark:text-paper text-sm font-extrabold">
                      Xác minh ngay →
                    </Text>
                  </Link>
                </View>
              ) : (
                <View className="bg-line/20 rounded-2xl px-4 py-3">
                  <Text className="text-ink text-sm font-extrabold">Email đã xác minh ✓</Text>
                  <Text className="text-mist mt-1 text-sm">Bạn có thể đặt sân và nhận thông báo.</Text>
                </View>
              )}

              <Pressable
                onPress={async () => {
                  await signOut();
                  router.replace('/login');
                }}
                disabled={isSubmitting}
                className="border-ink/15 dark:border-paper/20 mt-2 items-center rounded-full border py-4 active:opacity-80 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#10201A" />
                ) : (
                  <Text className="text-ink dark:text-paper text-base font-extrabold">Đăng xuất</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              <SectionHeader
                eyebrow="Bắt đầu ngay"
                title="Đăng nhập để đặt sân"
                subtitle="Lưu lịch sử, theo dõi booking và nhận ưu đãi riêng."
              />

              <AuthButton label="Đăng nhập" onPress={() => router.push('/login')} />

              <AuthButton
                label="Tạo tài khoản"
                className="bg-paper border-ink/15 dark:bg-court-deep border"
                onPress={() => router.push('/register')}
              />
            </View>
          )}

          <View className="bg-court gap-2 rounded-3xl p-5">
            <Text className="text-line text-xs font-bold uppercase tracking-widest">Mẹo nhỏ</Text>
            <Text className="text-paper text-base font-extrabold">
              Đặt sớm 2–3 ngày để có khung giờ đẹp
            </Text>
            <Text className="text-mist text-sm leading-5">
              Giờ cao điểm 17:00–20:00 thường kín nhanh. Thử khung sáng hoặc trưa để giá tốt hơn.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
