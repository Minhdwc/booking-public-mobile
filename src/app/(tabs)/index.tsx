import { Link, router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthHero } from '@/components/auth/auth-hero';
import { QuickAction, QuickActionRow } from '@/components/home/quick-action';
import { SectionHeader } from '@/components/home/section-header';
import { VenueCard, VenueCardSkeleton } from '@/components/home/venue-card';
import { VenueListEmpty, VenueListError } from '@/components/home/venue-list-states';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth/use-auth';
import { useVenues } from '@/features/venues';

export default function HomeScreen() {
  const { user, isLoggedIn, signOut, isSubmitting } = useAuth();
  const {
    data: featuredVenues,
    isLoading: isVenuesLoading,
    isError: isVenuesError,
    refetch: refetchVenues,
  } = useVenues({ page: 1, limit: 3 });

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F5EF' }} className="flex-1 bg-paper">
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
            <SectionHeader eyebrow="Hành động nhanh" title="Bạn muốn làm gì?" />

            <QuickActionRow>
              <QuickAction
                emoji="🔍"
                label="Tìm sân"
                hint="Lọc theo môn & khu vực"
                onPress={() => router.push('/explore')}
              />
              <QuickAction emoji="📅" label="Lịch đặt" hint="Xem booking sắp tới" />
            </QuickActionRow>

            <QuickActionRow>
              <QuickAction emoji="⭐" label="Yêu thích" hint="Sân bạn hay đặt" />
              <QuickAction emoji="🎁" label="Ưu đãi" hint="Khuyến mãi tuần này" />
            </QuickActionRow>
          </View>

          <View className="gap-4">
            <SectionHeader
              eyebrow="Gợi ý"
              title="Sân gần bạn"
              subtitle="Dữ liệu từ API · chỉ hiện sân active"
            />

            {isVenuesLoading ? (
              <View className="gap-3">
                <VenueCardSkeleton compact />
                <VenueCardSkeleton compact />
              </View>
            ) : isVenuesError ? (
              <VenueListError onRetry={() => void refetchVenues()} />
            ) : (featuredVenues?.data.length ?? 0) > 0 ? (
              <View className="gap-3">
                {featuredVenues?.data.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    compact
                    onPress={() => router.push({ pathname: '/venues/[id]', params: { id: venue.id } })}
                  />
                ))}
                <Pressable onPress={() => router.push('/explore')} className="self-center py-2">
                  <Text className="text-sm font-extrabold text-ink dark:text-paper">
                    Xem tất cả →
                  </Text>
                </Pressable>
              </View>
            ) : (
              <VenueListEmpty onRetry={() => void refetchVenues()} />
            )}
          </View>

          {isLoggedIn && user ? (
            <View className="gap-4 rounded-3xl border border-ink/10 p-5 dark:border-paper/10">
              <SectionHeader
                eyebrow="Tài khoản"
                title={user.email}
                subtitle={`@${user.username} · ${user.phone}`}
              />

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
                  <Text className="mt-1 text-sm text-mist">
                    Bạn có thể đặt sân và nhận thông báo.
                  </Text>
                </View>
              )}

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
                  <Text className="text-base font-extrabold text-ink dark:text-paper">
                    Đăng xuất
                  </Text>
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
                className="border border-ink/15 bg-paper dark:bg-court-deep"
                onPress={() => router.push('/register')}
              />
            </View>
          )}

          <View className="gap-2 rounded-3xl bg-court p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-line">Mẹo nhỏ</Text>
            <Text className="text-base font-extrabold text-paper">
              Đặt sớm 2–3 ngày để có khung giờ đẹp
            </Text>
            <Text className="text-sm leading-5 text-mist">
              Giờ cao điểm 17:00–20:00 thường kín nhanh. Thử khung sáng hoặc trưa để giá tốt hơn.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
