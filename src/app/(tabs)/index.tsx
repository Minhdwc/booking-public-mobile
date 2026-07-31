import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/auth/auth-hero';
import { QuickAction, QuickActionRow } from '@/components/home/quick-action';
import { SectionHeader } from '@/components/home/section-header';
import { VenueCard, VenueCardSkeleton } from '@/components/home/venue-card';
import { VenueListEmpty, VenueListError } from '@/components/home/venue-list-states';
import { PopularSearchSection } from '@/components/search/popular-search-chips';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import { useUserLocation, isLocationAvailable } from '@/features/location';
import { usePopularSearches, useRecentlyViewed } from '@/features/search';
import { attachDistanceToVenues, useVenues, VenueListItem } from '@/features/venues';

export default function HomeScreen() {
  const { user, isLoggedIn } = useAuth();
  const {
    data: featuredVenues,
    isLoading: isVenuesLoading,
    isError: isVenuesError,
    refetch: refetchVenues,
  } = useVenues({ page: 1, limit: 3 });

  const { data: popularSearches = [], isLoading: isPopularLoading } = usePopularSearches(8);
  const {
    data: recentlyViewed = [],
    isLoading: isRecentlyViewedLoading,
    isError: isRecentlyViewedError,
  } = useRecentlyViewed(isLoggedIn);

  const {
    data: userLocation,
    isLoading: isLocationLoading,
    isError: isLocationError,
    refetch: refetchLocation,
  } = useUserLocation({ auto: false });

  const canUseLocation = isLocationAvailable();

  const nearbyVenues = useMemo(
    () => attachDistanceToVenues(featuredVenues?.data ?? [], userLocation),
    [featuredVenues?.data, userLocation],
  );

  const nearbySubtitle = userLocation
    ? 'Đã sắp xếp theo khoảng cách từ vị trí của bạn'
    : isLocationLoading
      ? 'Đang xác định vị trí…'
      : !canUseLocation
        ? 'GPS cần Expo Go SDK 57 hoặc npm run android:build'
        : isLocationError
          ? 'Không lấy được vị trí · thử lại'
          : 'Bấm 📍 để xem sân gần nhất';

  const handleNearbyPress = () => {
    if (!canUseLocation) {
      Alert.alert(
        'GPS chưa khả dụng',
        'Expo Go hiện tại chưa có module vị trí.\n\n• Cập nhật Expo Go lên SDK 57\n• Hoặc chạy: npm run android:build',
      );
      return;
    }

    void refetchLocation();
  };

  const handlePopularSearchSelect = (query: string) => {
    router.push({ pathname: '/explore', params: { q: query } });
  };

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
              <QuickAction
                emoji="📅"
                label="Lịch đặt"
                hint="Xem booking sắp tới"
                onPress={() => router.push('/bookings')}
              />
            </QuickActionRow>

            <QuickActionRow>
              <QuickAction
                emoji="⭐"
                label="Yêu thích"
                hint="Sân bạn hay đặt"
                onPress={() => router.push('/account')}
              />
              <QuickAction emoji="🎁" label="Ưu đãi" hint="Khuyến mãi tuần này" />
            </QuickActionRow>
          </View>

          <View className="gap-3">
            <SectionHeader
              eyebrow="Khám phá"
              title="Tìm kiếm phổ biến"
              subtitle="Từ khóa được tìm nhiều nhất"
            />
            <PopularSearchSection
              items={popularSearches}
              isLoading={isPopularLoading}
              onSelect={handlePopularSearchSelect}
            />
          </View>

          {isLoggedIn ? (
            <View className="gap-4">
              <SectionHeader
                eyebrow="Dành cho bạn"
                title="Đã xem gần đây"
                subtitle="Sân bạn vừa mở gần đây"
              />

              {isRecentlyViewedLoading ? (
                <View className="gap-3">
                  <VenueCardSkeleton compact />
                  <VenueCardSkeleton compact />
                </View>
              ) : isRecentlyViewedError ? (
                <Text className="text-sm text-mist">Không tải được lịch sử xem gần đây.</Text>
              ) : recentlyViewed.length > 0 ? (
                <View className="gap-3">
                  {recentlyViewed.slice(0, 3).map((venue: VenueListItem) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      compact
                      onPress={() =>
                        router.push({ pathname: '/venues/[id]', params: { id: venue.id } })
                      }
                    />
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-mist">
                  Chưa có sân xem gần đây. Mở chi tiết sân để lưu lịch sử.
                </Text>
              )}
            </View>
          ) : null}

          <View className="gap-4">
            <View className="flex-row items-end justify-between gap-3">
              <View className="flex-1">
                <SectionHeader
                  eyebrow="Gợi ý"
                  title="Sân gần bạn"
                  subtitle={nearbySubtitle}
                />
              </View>
              <Pressable
                onPress={handleNearbyPress}
                disabled={isLocationLoading}
                className={`rounded-full border px-3 py-2 active:opacity-80 disabled:opacity-60 ${
                  canUseLocation
                    ? 'border-line/40 bg-line/25'
                    : 'border-mist/30 bg-mist/10'
                }`}
              >
                {isLocationLoading ? (
                  <ActivityIndicator size="small" color="#16342B" />
                ) : (
                  <Text
                    className={`text-xs font-extrabold ${canUseLocation ? 'text-ink' : 'text-mist'}`}
                  >
                    📍 Gần tôi
                  </Text>
                )}
              </Pressable>
            </View>

            {isVenuesLoading ? (
              <View className="gap-3">
                <VenueCardSkeleton compact />
                <VenueCardSkeleton compact />
              </View>
            ) : isVenuesError ? (
              <VenueListError onRetry={() => void refetchVenues()} />
            ) : nearbyVenues.length > 0 ? (
              <View className="gap-3">
                {nearbyVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    compact
                    onPress={() =>
                      router.push({ pathname: '/venues/[id]', params: { id: venue.id } })
                    }
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

          <Pressable
            onPress={() => router.push('/account')}
            className="flex-row items-center justify-between rounded-3xl border border-ink/10 bg-paper px-5 py-4 active:opacity-90 dark:border-paper/10 dark:bg-court-deep"
          >
            <View className="gap-1">
              <Text className="text-xs font-bold uppercase tracking-widest text-mist">Tài khoản</Text>
              <Text className="text-base font-extrabold text-ink dark:text-paper">
                {isLoggedIn && user ? user.name : 'Đăng nhập / Đăng ký'}
              </Text>
              <Text className="text-sm text-mist">
                {isLoggedIn && user ? user.email : 'Quản lý hồ sơ và lịch đặt'}
              </Text>
            </View>
            <Text className="text-lg text-ink dark:text-paper">→</Text>
          </Pressable>

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
