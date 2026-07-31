import { NativeModules, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class LocationError extends Error {
  constructor(
    message: string,
    readonly code: 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN',
  ) {
    super(message);
    this.name = 'LocationError';
  }
}

type ExpoLocationModule = typeof import('expo-location');

const UNAVAILABLE_MESSAGE =
  'GPS chưa sẵn sàng. Cập nhật Expo Go đúng SDK hoặc chạy npm run android:build.';

export function isLocationAvailable(): boolean {
  if (Platform.OS === 'web') {
    return typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
  }
  return Boolean(NativeModules.ExpoLocation);
}

function loadLocationModule(): ExpoLocationModule {
  if (!isLocationAvailable()) {
    throw new LocationError(UNAVAILABLE_MESSAGE, 'UNAVAILABLE');
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-location') as ExpoLocationModule;
  } catch {
    throw new LocationError(UNAVAILABLE_MESSAGE, 'UNAVAILABLE');
  }
}

function getWebPosition(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new LocationError('Trình duyệt không hỗ trợ GPS.', 'UNAVAILABLE'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new LocationError('Bạn chưa cấp quyền truy cập vị trí.', 'PERMISSION_DENIED'));
          return;
        }
        if (error.code === error.TIMEOUT) {
          reject(new LocationError('Hết thời gian chờ GPS.', 'TIMEOUT'));
          return;
        }
        reject(new LocationError('Không lấy được vị trí hiện tại.', 'UNAVAILABLE'));
      },
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
    );
  });
}

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return isLocationAvailable();
  if (!isLocationAvailable()) return false;

  const Location = loadLocationModule();
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(): Promise<UserCoordinates> {
  if (Platform.OS === 'web') return getWebPosition();

  if (!isLocationAvailable()) {
    throw new LocationError(UNAVAILABLE_MESSAGE, 'UNAVAILABLE');
  }

  const Location = loadLocationModule();

  const granted = await requestLocationPermission();
  if (!granted) {
    throw new LocationError('Bạn chưa cấp quyền truy cập vị trí.', 'PERMISSION_DENIED');
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new LocationError('GPS đang tắt. Hãy bật định vị trên thiết bị.', 'UNAVAILABLE');
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? 0,
    };
  } catch {
    throw new LocationError('Không lấy được vị trí hiện tại.', 'UNKNOWN');
  }
}
type UseUserLocationOptions = {
  auto?: boolean;
};

export function useUserLocation(options: UseUserLocationOptions = {}) {
  const { auto = false } = options;
  const canUseLocation = isLocationAvailable();

  return useQuery<UserCoordinates, Error>({
    queryKey: queryKeys.location.current(),
    queryFn: getCurrentPosition,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
    retry: false,
    enabled: auto && canUseLocation,
  });
}
