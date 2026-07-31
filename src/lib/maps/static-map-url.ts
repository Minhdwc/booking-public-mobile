import { getDistanceKm, getMapZoomForDistance } from './distance';
import { hasValidCoordinates } from './coordinates';

export { hasValidCoordinates };

const STATIC_MAP_SIZE = '640x320';

export function buildStaticMapUrl(latitude: number, longitude: number): string | null {
  if (!hasValidCoordinates(latitude, longitude)) return null;

  const params = new URLSearchParams({
    center: `${latitude},${longitude}`,
    zoom: '15',
    size: STATIC_MAP_SIZE,
    markers: `${latitude},${longitude},lightblue1`,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}

type BuildRouteMapUrlParams = {
  venueLatitude: number;
  venueLongitude: number;
  userLatitude?: number;
  userLongitude?: number;
};

export function buildRouteMapUrl({
  venueLatitude,
  venueLongitude,
  userLatitude,
  userLongitude,
}: BuildRouteMapUrlParams): string | null {
  if (!hasValidCoordinates(venueLatitude, venueLongitude)) return null;

  const hasUserLocation =
    userLatitude != null &&
    userLongitude != null &&
    hasValidCoordinates(userLatitude, userLongitude);

  if (!hasUserLocation) {
    return buildStaticMapUrl(venueLatitude, venueLongitude);
  }

  const distanceKm =
    getDistanceKm(userLatitude, userLongitude, venueLatitude, venueLongitude) ?? 3;
  const centerLat = (venueLatitude + userLatitude) / 2;
  const centerLng = (venueLongitude + userLongitude) / 2;

  const params = new URLSearchParams({
    center: `${centerLat},${centerLng}`,
    zoom: String(getMapZoomForDistance(distanceKm)),
    size: STATIC_MAP_SIZE,
    markers: `${userLatitude},${userLongitude},red-pushpin|${venueLatitude},${venueLongitude},lightblue1`,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}
