import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '@/components/auth/auth-hero';
import { AuthInput } from '@/components/auth/auth-input';
import { SectionHeader } from '@/components/home/section-header';
import { SportChip } from '@/components/home/sport-chip';
import { VenueCard, type VenuePreview } from '@/components/home/venue-card';
import { BottomTabInset } from '@/constants/theme';

const SPORTS = [
  { id: 'all', label: 'Tất cả', emoji: '🏟️' },
  { id: 'badminton', label: 'Cầu lông', emoji: '🏸' },
  { id: 'football', label: 'Bóng đá', emoji: '⚽' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'pickleball', label: 'Pickleball', emoji: '🏓' },
] as const;

const FEATURED_VENUES: VenuePreview[] = [
  {
    id: '1',
    name: 'Green Court Quận 7',
    sport: 'Cầu lông',
    distance: '1.2 km',
    price: '120k/giờ',
    rating: '4.8',
    slots: 'Còn 3 slot tối nay',
  },
  {
    id: '2',
    name: 'Saigon Football Hub',
    sport: 'Bóng đá 5',
    distance: '2.4 km',
    price: '350k/giờ',
    rating: '4.6',
    slots: 'Còn 1 sân 19:00',
  },
  {
    id: '3',
    name: 'River Side Tennis',
    sport: 'Tennis',
    distance: '3.1 km',
    price: '180k/giờ',
    rating: '4.9',
    slots: 'Sáng mai còn trống',
  },
];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<(typeof SPORTS)[number]['id']>('all');

  const filteredVenues = FEATURED_VENUES.filter((venue) => {
    const matchesQuery =
      query.trim().length === 0 ||
      venue.name.toLowerCase().includes(query.toLowerCase()) ||
      venue.sport.toLowerCase().includes(query.toLowerCase());

    const matchesSport =
      selectedSport === 'all' ||
      venue.sport.toLowerCase().includes(
        SPORTS.find((sport) => sport.id === selectedSport)?.label.toLowerCase() ?? '',
      );

    return matchesQuery && matchesSport;
  });

  return (
    <View className="bg-paper dark:bg-ink flex-1">
      <AuthHero
        eyebrow="Khám phá"
        title="Tìm sân phù hợp"
        subtitle="Lọc theo môn thể thao, khu vực và khung giờ còn trống."
      />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <ScrollView
          contentContainerClassName="gap-8 px-6 pb-6 pt-8"
          style={{ paddingBottom: BottomTabInset + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
              subtitle={`${filteredVenues.length} sân phù hợp`}
            />

            {filteredVenues.length > 0 ? (
              filteredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
            ) : (
              <View className="border-ink/10 dark:border-paper/10 items-center rounded-3xl border px-6 py-10">
                <Text className="text-4xl">🎾</Text>
                <Text className="text-ink dark:text-paper mt-4 text-base font-extrabold">
                  Không tìm thấy sân
                </Text>
                <Text className="text-mist mt-2 text-center text-sm leading-5">
                  Thử đổi bộ lọc hoặc tìm từ khóa khác.
                </Text>
              </View>
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
    <View className="border-ink/10 dark:border-paper/10 flex-row gap-4 rounded-2xl border p-4">
      <View className="bg-line h-10 w-10 items-center justify-center rounded-full">
        <Text className="text-ink text-xs font-extrabold">{step}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-ink dark:text-paper text-sm font-extrabold">{title}</Text>
        <Text className="text-mist text-sm leading-5">{description}</Text>
      </View>
    </View>
  );
}
