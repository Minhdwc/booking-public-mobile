import { router } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

import { VenueCard } from '@/components/home/venue-card';
import { EmptyState, ErrorState, LoadingState, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useFavoriteVenues } from '@/features/favorites';

export default function FavoritesScreen() {
  const { isLoggedIn } = useAuth();
  const { venueIds, venues, isLoading, isError, refetch } = useFavoriteVenues(isLoggedIn);

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Yêu thích" showBack />
        <View className="px-6 pt-4">
          <EmptyState
            title="Đăng nhập để xem yêu thích"
            message="Lưu các cơ sở bạn quan tâm để xem lại nhanh."
            emoji="⭐"
            actionLabel="Đăng nhập"
            onAction={() => router.push('/login')}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader
        title="Cơ sở yêu thích"
        subtitle={venueIds.length > 0 ? `${venues.length} cơ sở đã lưu` : 'Chưa có cơ sở nào'}
        showBack
      />

      <ScrollView
        contentContainerClassName="gap-4 px-6 pb-8 pt-4"
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => void refetch()} />}
      >
        {isLoading ? (
          <LoadingState message="Đang tải yêu thích..." />
        ) : isError ? (
          <ErrorState
            title="Không tải được yêu thích"
            message="Vui lòng thử lại."
            actionLabel="Thử lại"
            onRetry={() => void refetch()}
          />
        ) : venueIds.length === 0 ? (
          <EmptyState
            title="Chưa có cơ sở yêu thích"
            message="Nhấn biểu tượng trái tim trên trang cơ sở để thêm vào danh sách."
            emoji="⭐"
            actionLabel="Khám phá sân"
            onAction={() => router.push('/explore')}
          />
        ) : venues.length === 0 ? (
          <EmptyState
            title="Không tìm thấy cơ sở đã lưu"
            message="Một số cơ sở có thể đã ngừng hoạt động."
            emoji="🏟️"
            actionLabel="Khám phá sân"
            onAction={() => router.push('/explore')}
          />
        ) : (
          venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() => router.push({ pathname: '/venues/[id]', params: { id: venue.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
