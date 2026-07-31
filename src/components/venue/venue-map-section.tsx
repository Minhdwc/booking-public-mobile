import { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { PrimaryButton } from '@/components/ui/primary-button';
import { useUserLocation, isLocationAvailable } from '@/features/location';
import {
  estimateDriveMinutes,
  formatDistance,
  getDistanceKm,
} from '@/lib/maps/distance';
import { openGoogleMapsDirections } from '@/lib/maps/open-google-maps';
import { buildRouteMapUrl, hasValidCoordinates } from '@/lib/maps/static-map-url';

const MAP_HEIGHT = 240;

type VenueMapSectionProps = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export function VenueMapSection({ name, address, latitude, longitude }: VenueMapSectionProps) {
  const hasVenueCoords = hasValidCoordinates(latitude, longitude);
  const {
    data: userLocation,
    isLoading: isLocating,
    isFetching,
    error: locationError,
    refetch: refreshLocation,
  } = useUserLocation({ auto: false });

  const distanceKm = useMemo(() => {
    if (!userLocation || !hasVenueCoords) return null;
    return getDistanceKm(userLocation.latitude, userLocation.longitude, latitude, longitude);
  }, [userLocation, hasVenueCoords, latitude, longitude]);

  const mapImageUrl = useMemo(
    () =>
      buildRouteMapUrl({
        venueLatitude: latitude,
        venueLongitude: longitude,
        userLatitude: userLocation?.latitude,
        userLongitude: userLocation?.longitude,
      }),
    [latitude, longitude, userLocation],
  );

  const handleDirectionsFromHere = () => {
    void openGoogleMapsDirections({
      latitude,
      longitude,
      address,
      label: name,
      origin: userLocation,
    });
  };

  const handleDirections = () => {
    void openGoogleMapsDirections({
      latitude,
      longitude,
      address,
      label: name,
    });
  };

  const handleLocateMe = () => {
    if (!isLocationAvailable()) return;
    void refreshLocation();
  };

  const isLocationPending = isLocating || isFetching;
  const gpsUnavailable = !isLocationAvailable();

  return (
    <View className="gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-extrabold text-ink dark:text-paper">Vị trí & lộ trình</Text>
          <Text className="text-sm text-mist" numberOfLines={2}>
            {address}
          </Text>
        </View>
        <Pressable
          onPress={handleLocateMe}
          disabled={isLocationPending || gpsUnavailable}
          className="rounded-full border border-line/40 bg-line/20 px-3 py-2 active:opacity-80 disabled:opacity-60"
        >
          {isLocationPending ? (
            <ActivityIndicator size="small" color="#16342B" />
          ) : (
            <Text className="text-xs font-extrabold text-ink">
              {gpsUnavailable ? 'GPS N/A' : '📍 Vị trí tôi'}
            </Text>
          )}
        </Pressable>
      </View>

      {distanceKm != null ? (
        <View className="flex-row flex-wrap gap-2">
          <StatPill emoji="🧭" label={`Cách bạn ${formatDistance(distanceKm)}`} highlight />
          <StatPill emoji="🚗" label={`~${estimateDriveMinutes(distanceKm)} phút lái xe`} />
        </View>
      ) : null}

      <View className="overflow-hidden rounded-3xl border border-ink/10 dark:border-paper/10">
        <Pressable
          onPress={userLocation ? handleDirectionsFromHere : handleDirections}
          className="active:opacity-95"
        >
          {mapImageUrl ? (
            <View className="relative">
              <Image
                source={{ uri: mapImageUrl }}
                style={{ width: '100%', height: MAP_HEIGHT }}
                contentFit="cover"
                accessibilityLabel={`Bản đồ đến ${name}`}
              />
              <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between bg-ink/70 px-4 py-3">
                <RouteLegend hasUserLocation={Boolean(userLocation)} venueName={name} />
              </View>
            </View>
          ) : (
            <View
              style={{ height: MAP_HEIGHT }}
              className="items-center justify-center bg-court/20 px-6"
            >
              <Text className="text-4xl">📍</Text>
              <Text className="mt-2 text-center text-sm font-bold text-ink dark:text-paper">
                Chưa có tọa độ sân trên bản đồ
              </Text>
              <Text className="mt-1 text-center text-xs text-mist">
                Vẫn có thể chỉ đường theo địa chỉ bên dưới.
              </Text>
            </View>
          )}
        </Pressable>

        <View className="gap-3 border-t border-ink/10 bg-paper p-4 dark:border-paper/10 dark:bg-court-deep">
          {userLocation ? (
            <PrimaryButton
              label="Chỉ đường từ vị trí của tôi"
              size="md"
              onPress={handleDirectionsFromHere}
            />
          ) : (
            <PrimaryButton
              label={isLocationPending ? 'Đang lấy vị trí…' : 'Bật định vị để chỉ đường nhanh'}
              size="md"
              loading={isLocationPending}
              onPress={handleLocateMe}
            />
          )}

          <PrimaryButton
            label="Mở Google Maps"
            size="md"
            variant="secondary"
            onPress={handleDirections}
          />

          {locationError ? (
            <Text className="text-center text-xs text-clay">{locationError.message}</Text>
          ) : gpsUnavailable ? (
            <Text className="text-center text-xs text-mist">
              GPS cần Expo Go SDK 57 hoặc chạy npm run android:build
            </Text>
          ) : null}

          {hasVenueCoords ? (
            <Text className="text-center text-[10px] text-mist">© OpenStreetMap contributors</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function StatPill({
  emoji,
  label,
  highlight,
}: {
  emoji: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <View
      className={`rounded-full px-3 py-1.5 ${highlight ? 'bg-line/35' : 'bg-ink/5 dark:bg-paper/10'}`}
    >
      <Text className={`text-xs font-extrabold ${highlight ? 'text-ink' : 'text-mist'}`}>
        {emoji} {label}
      </Text>
    </View>
  );
}

function RouteLegend({
  hasUserLocation,
  venueName,
}: {
  hasUserLocation: boolean;
  venueName: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      {hasUserLocation ? (
        <>
          <LegendDot color="#E85D4C" label="Bạn" />
          <Text className="text-xs font-bold text-paper/70">→</Text>
        </>
      ) : null}
      <LegendDot color="#9AE66E" label={venueName} />
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View style={{ backgroundColor: color }} className="size-2.5 rounded-full" />
      <Text className="max-w-[140px] text-xs font-bold text-paper" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
