import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/auth/auth-hero';
import { AuthInput } from '@/components/auth/auth-input';
import { SectionHeader } from '@/components/home/section-header';
import { SportChip } from '@/components/home/sport-chip';
import { VenueCard, VenueCardSkeleton } from '@/components/home/venue-card';
import { VenueListEmpty, VenueListError } from '@/components/home/venue-list-states';
import { BottomTabInset } from '@/constants/theme';
import { useVenues } from '@/features/venues';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const SPORTS = [
  { id: 'all', label: 'Tất cả', emoji: '🏟️' },
  { id: 'badminton', label: 'Cầu lông', emoji: '🏸' },
  { id: 'football', label: 'Bóng đá', emoji: '⚽' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'pickleball', label: 'Pickleball', emoji: '🏓' },
] as const;

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<(typeof SPORTS)[number]['id']>('all');
  const debouncedSearch = useDebouncedValue(query.trim(), 300);

  const { data, isLoading, isError, refetch, isRefetching } = useVenues({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const venues = useMemo(() => {
    const items = data?.data ?? [];

    if (selectedSport === 'all') return items;

    const sportLabel =
      SPORTS.find((sport) => sport.id === selectedSport)?.label.toLowerCase() ?? '';

    return items.filter((venue) =>
      venue.sportNames.some((name) => name.toLowerCase().includes(sportLabel)),
    );
  }, [data?.data, selectedSport]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F5EF' }} className="flex-1 bg-paper">
      <AuthHero
        eyebrow="Khám phá"
        title="Tìm sân phù hợp"
        subtitle={
          isLoading
            ? 'Đang tải danh sách sân...'
            : isError
              ? 'Không kết nối được API'
              : `${venues.length} sân khả dụng · dữ liệu từ API`
        }
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-8 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
          }
        >
          <AuthInput
            label="Tìm kiếm"
            placeholder="Tên sân, quận, môn thể thao..."
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />

          <View className="gap-3">
            <SectionHeader eyebrow="Bộ lọc" title="Môn thể thao" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SPORTS.map((sport) => (
                <SportChip
                  key={sport.id}
                  label={sport.label}
                  emoji={sport.emoji}
                  selected={selectedSport === sport.id}
                  onPress={() => setSelectedSport(sport.id)}
                />
              ))}
            </ScrollView>
          </View>

          <View className="gap-4">
            <SectionHeader
              eyebrow="Gợi ý hôm nay"
              title="Sân nổi bật gần bạn"
              subtitle={`${venues.length} sân phù hợp`}
            />

            {isLoading ? (
              <>
                <VenueCardSkeleton />
                <VenueCardSkeleton />
              </>
            ) : isError ? (
              <VenueListError onRetry={() => void refetch()} />
            ) : venues.length > 0 ? (
              venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onPress={() => router.push({ pathname: '/venues/[id]', params: { id: venue.id } })}
                />
              ))
            ) : (
              <VenueListEmpty onRetry={() => void refetch()} />
            )}
          </View>

          <View className="gap-3">
            <SectionHeader eyebrow="Hướng dẫn" title="Đặt sân dễ hơn" />
            <TipCard
              step="01"
              title="Chọn sân & khung giờ"
              description="Xem slot trống theo thời gian thực, chọn sân phù hợp ngân sách."
            />
            <TipCard
              step="02"
              title="Thanh toán & giữ chỗ"
              description="Xác nhận booking trong vài bước, nhận mã đặt sân ngay."
            />
            <TipCard
              step="03"
              title="Ra sân & tận hưởng"
              description="Check-in tại sân, theo dõi lịch sử đặt trong tài khoản."
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TipCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row gap-4 rounded-2xl border border-ink/10 p-4 dark:border-paper/10">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-line">
        <Text className="text-xs font-extrabold text-ink">{step}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-sm font-extrabold text-ink dark:text-paper">{title}</Text>
        <Text className="text-sm leading-5 text-mist">{description}</Text>
      </View>
    </View>
  );
}
