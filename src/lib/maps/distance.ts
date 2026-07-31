import { hasValidCoordinates } from './coordinates';

const EARTH_RADIUS_KM = 6371;

export { hasValidCoordinates };

export function getDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number | null {
  if (!hasValidCoordinates(fromLat, fromLng) || !hasValidCoordinates(toLat, toLng)) {
    return null;
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function estimateDriveMinutes(km: number): number {
  return Math.max(1, Math.round((km / 28) * 60));
}

export function getMapZoomForDistance(km: number): number {
  if (km < 0.8) return 15;
  if (km < 2) return 14;
  if (km < 6) return 13;
  if (km < 15) return 12;
  return 11;
}
