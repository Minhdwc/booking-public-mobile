import { Text, View } from 'react-native';

import { VenueDetail } from '@/features/venues';

type VenueInfoSectionProps = {
  venue: VenueDetail;
};

export function VenueInfoSection({ venue }: VenueInfoSectionProps) {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-xs font-bold uppercase tracking-widest text-line">Cơ sở</Text>
        <Text className="text-2xl font-extrabold text-ink dark:text-paper">{venue.name}</Text>
        <View className="flex-row flex-wrap items-center gap-3">
          <Text className="text-sm text-mist">{venue.address}</Text>
          <View className="rounded-full bg-ink/80 px-2.5 py-1 dark:bg-paper/15">
            <Text className="text-xs font-bold text-paper dark:text-paper">
              {venue.ratingCount > 0 ? `★ ${venue.ratingLabel}` : venue.ratingLabel}
            </Text>
          </View>
        </View>
        {venue.ratingCount > 0 ? (
          <Text className="text-sm text-mist">{venue.ratingCount} đánh giá</Text>
        ) : (
          <Text className="text-sm text-mist">Chưa có đánh giá</Text>
        )}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {venue.priceLabel ? <InfoTag label={venue.priceLabel} highlight /> : null}
        <InfoTag label={venue.courtCountLabel} />
        {venue.todayHoursLabel ? <InfoTag label={venue.todayHoursLabel} /> : null}
      </View>

      <View className="gap-3 rounded-3xl border border-ink/10 p-4 dark:border-paper/10">
        <InfoRow title="Giờ hoạt động" value={venue.operatingHoursSummary ?? 'Chưa cập nhật'} />
        {venue.phone ? <InfoRow title="Liên hệ" value={venue.phone} /> : null}
        <InfoRow title="Khu vực" value={[venue.district, venue.city].filter(Boolean).join(', ') || venue.addressShort} />
      </View>

      {venue.description ? (
        <Text className="text-sm leading-6 text-mist">{venue.description}</Text>
      ) : (
        <Text className="text-sm text-mist">Chưa có mô tả cho cơ sở này.</Text>
      )}
    </View>
  );
}

function InfoTag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <View className={`rounded-full px-3 py-1 ${highlight ? 'bg-line/30' : 'bg-ink/5 dark:bg-paper/10'}`}>
      <Text className={`text-xs font-bold ${highlight ? 'text-ink' : 'text-mist'}`}>{label}</Text>
    </View>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <View className="gap-1">
      <Text className="text-xs font-bold uppercase tracking-widest text-mist">{title}</Text>
      <Text className="text-sm font-semibold text-ink dark:text-paper">{value}</Text>
    </View>
  );
}
