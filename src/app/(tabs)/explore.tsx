import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/auth/auth-hero';
import { AuthInput } from '@/components/auth/auth-input';
import { SectionHeader } from '@/components/home/section-header';
import { SportChip } from '@/components/home/sport-chip';
import { VenueCard, VenueCardSkeleton } from '@/components/home/venue-card';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { EmptyState, ErrorState } from '@/components/ui';
import { BottomTabInset } from '@/constants/theme';
import {
  filterVenuesBySport,
  SearchSuggestion,
  useExploreVenues,
  useSearchSuggestions,
} from '@/features/search';
import { useSports, SportChipItem } from '@/features/sports';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export default function ExploreScreen() {
  const { q: initialQuery } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [selectedSportId, setSelectedSportId] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebouncedValue(query.trim(), 300);

  useEffect(() => {
    if (typeof initialQuery === 'string' && initialQuery.length > 0) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const { data: sportsData, isLoading: isSportsLoading } = useSports();
  const defaultSportOptions: SportChipItem[] = [{ id: 'all', label: 'Tất cả', emoji: '🏟️' }];
  const sportOptions: SportChipItem[] = sportsData?.chipOptions ?? defaultSportOptions;

  const selectedSportName = sportOptions.find((sport) => sport.id === selectedSportId)?.label;

  const { data, isLoading, isError, refetch, isRefetching } = useExploreVenues({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const { data: suggestions = [] } = useSearchSuggestions(debouncedSearch, showSuggestions);

  const venues = useMemo(() => {
    const items = data?.data ?? [];
    return filterVenuesBySport(items, selectedSportId, selectedSportName);
  }, [data?.data, selectedSportId, selectedSportName]);

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false);

    if (suggestion.type === 'venue' && suggestion.venueId) {
      router.push({ pathname: '/venues/[id]', params: { id: suggestion.venueId } });
      return;
    }

    setQuery(suggestion.label);
  };

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
              : `${venues.length} sân khả dụng · ${debouncedSearch ? 'Elasticsearch' : 'API venues'}`
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
          <View className="relative z-10">
            <AuthInput
              label="Tìm kiếm"
              placeholder="Tên sân, quận, môn thể thao..."
              value={query}
              onChangeText={setQuery}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoCapitalize="none"
            />
            <SearchSuggestions
              suggestions={suggestions}
              visible={showSuggestions}
              onSelect={handleSuggestionSelect}
            />
          </View>

          <View className="gap-3">
            <SectionHeader eyebrow="Bộ lọc" title="Môn thể thao" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {isSportsLoading ? (
                <>
                  <View className="mr-2 h-10 w-24 rounded-full bg-ink/10 dark:bg-paper/10" />
                  <View className="mr-2 h-10 w-28 rounded-full bg-ink/10 dark:bg-paper/10" />
                  <View className="mr-2 h-10 w-24 rounded-full bg-ink/10 dark:bg-paper/10" />
                </>
              ) : (
                sportOptions.map((sport) => (
                  <SportChip
                    key={sport.id}
                    label={sport.label}
                    emoji={sport.emoji}
                    selected={selectedSportId === sport.id}
                    onPress={() => setSelectedSportId(sport.id)}
                  />
                ))
              )}
            </ScrollView>
          </View>

          <View className="gap-4">
            <SectionHeader
              eyebrow="Gợi ý hôm nay"
              title={debouncedSearch ? 'Kết quả tìm kiếm' : 'Sân nổi bật gần bạn'}
              subtitle={`${venues.length} sân phù hợp`}
            />

            {isLoading ? (
              <>
                <VenueCardSkeleton />
                <VenueCardSkeleton />
              </>
            ) : isError ? (
              <ErrorState
                title="Không tải được danh sách sân"
                message="Kiểm tra kết nối mạng và API URL, rồi thử lại."
                onRetry={() => void refetch()}
              />
            ) : venues.length > 0 ? (
              venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onPress={() => router.push({ pathname: '/venues/[id]', params: { id: venue.id } })}
                />
              ))
            ) : (
              <EmptyState
                title="Chưa có sân phù hợp"
                message={
                  debouncedSearch
                    ? 'Thử từ khóa khác hoặc bỏ bộ lọc môn thể thao.'
                    : 'Thử tìm từ khóa khác hoặc quay lại sau khi có thêm sân active.'
                }
                actionLabel="Thử lại"
                onAction={() => void refetch()}
              />
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
