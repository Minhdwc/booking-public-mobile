import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { AmenityGrid } from '@/components/venue/amenity-grid';
import { CourtListItem } from '@/components/venue/court-list-item';
import { StickyBookingBar } from '@/components/venue/sticky-booking-bar';
import { VenueGallery } from '@/components/venue/venue-gallery';
import { VenueInfoSection } from '@/components/venue/venue-info-section';
import { VenueMapSection } from '@/components/venue/venue-map-section';
import { VenueReviewList } from '@/components/venue/venue-review-list';
import { EmptyState, ErrorState, LoadingState, ScreenHeader } from '@/components/ui';
import { useVenueReviews } from '@/features/reviews';
import { useVenueDetail } from '@/features/venues';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const [courtsSectionY, setCourtsSectionY] = useState(0);

  const { data: venue, isLoading, isError, refetch, isRefetching } = useVenueDetail(id);
  const { data: reviews = [], isLoading: isReviewsLoading } = useVenueReviews(id);

  const firstBookableCourt = venue?.courts.find((court) => court.isBookable);

  const scrollToCourts = () => {
    if (courtsSectionY > 0) {
      scrollRef.current?.scrollTo({ y: courtsSectionY - 12, animated: true });
      return;
    }

    if (firstBookableCourt) {
      router.push({ pathname: '/courts/[id]', params: { id: firstBookableCourt.id } });
    }
  };

  const handleBookPress = () => {
    if (firstBookableCourt) {
      router.push({ pathname: '/courts/[id]', params: { id: firstBookableCourt.id } });
      return;
    }

    scrollToCourts();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Chi tiết sân" />
        <View className="gap-4 px-6 pt-4">
          <LoadingState variant="card" />
          <LoadingState variant="inline" />
          <LoadingState variant="inline" />
        </View>
      </View>
    );
  }

  if (isError || !venue) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Chi tiết sân" />
        <View className="px-6 pt-4">
          <ErrorState
            title="Không tìm thấy cơ sở"
            message="Cơ sở không tồn tại hoặc tạm thời không khả dụng."
            onRetry={() => void refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title={venue.name} subtitle={venue.addressShort} />

      <ScrollView
        ref={scrollRef}
        contentContainerClassName="gap-8 px-6 pb-36 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
      >
        {venue.status !== 'active' ? (
          <View className="rounded-2xl bg-clay/10 px-4 py-3">
            <Text className="text-sm font-bold text-clay">
              Cơ sở đang ở trạng thái {venue.status}. Một số tính năng có thể bị hạn chế.
            </Text>
          </View>
        ) : null}

        <VenueGallery imageUrls={venue.imageUrls} venueName={venue.name} />
        <VenueInfoSection venue={venue} />
        <VenueMapSection
          name={venue.name}
          address={venue.address}
          latitude={venue.latitude}
          longitude={venue.longitude}
        />
        <AmenityGrid amenities={venue.amenities} />

        <View
          onLayout={(event) => setCourtsSectionY(event.nativeEvent.layout.y)}
          className="gap-4"
        >
          <View className="gap-1">
            <Text className="text-lg font-extrabold text-ink dark:text-paper">Danh sách sân</Text>
            <Text className="text-sm text-mist">{venue.courtCountLabel} đang hoạt động</Text>
          </View>

          {venue.courts.length > 0 ? (
            venue.courts.map((court) => (
              <CourtListItem
                key={court.id}
                court={court}
                onPress={() =>
                  court.isBookable
                    ? router.push({ pathname: '/courts/[id]', params: { id: court.id } })
                    : undefined
                }
              />
            ))
          ) : (
            <EmptyState
              title="Chưa có sân hoạt động"
              message="Cơ sở này chưa có sân nào sẵn sàng để đặt."
              emoji="🎾"
            />
          )}
        </View>

        <View className="gap-4">
          <Text className="text-lg font-extrabold text-ink dark:text-paper">Đánh giá</Text>
          <VenueReviewList reviews={reviews} isLoading={isReviewsLoading} />
        </View>
      </ScrollView>

      <StickyBookingBar
        label={firstBookableCourt ? 'Đặt sân ngay' : 'Xem danh sách sân'}
        subtitle={venue.priceLabel ?? undefined}
        disabled={venue.courts.length === 0}
        onPress={handleBookPress}
      />
    </View>
  );
}
