import { Linking, Platform } from 'react-native';

import type { UserCoordinates } from '@/features/location';

import { hasValidCoordinates } from './coordinates';

type OpenGoogleMapsDirectionsParams = {
  latitude: number;
  longitude: number;
  address: string;
  label?: string;
  origin?: UserCoordinates;
};

function buildWebDirectionsUrl(params: OpenGoogleMapsDirectionsParams): string {
  const { latitude, longitude, address, origin } = params;
  const hasCoords = hasValidCoordinates(latitude, longitude);
  const query = new URLSearchParams({ api: '1', travelmode: 'driving' });

  if (origin && hasValidCoordinates(origin.latitude, origin.longitude)) {
    query.set('origin', `${origin.latitude},${origin.longitude}`);
  }

  if (hasCoords) {
    query.set('destination', `${latitude},${longitude}`);
  } else {
    query.set('destination', address);
  }

  return `https://www.google.com/maps/dir/?${query.toString()}`;
}

function buildNativeDirectionsUrl(params: OpenGoogleMapsDirectionsParams): string | null {
  const { latitude, longitude, address, origin } = params;
  const hasCoords = hasValidCoordinates(latitude, longitude);
  const encodedAddress = encodeURIComponent(address);
  const hasOrigin = origin && hasValidCoordinates(origin.latitude, origin.longitude);

  if (hasOrigin) {
    return null;
  }

  if (Platform.OS === 'ios') {
    return hasCoords
      ? `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`
      : `comgooglemaps://?daddr=${encodedAddress}&directionsmode=driving`;
  }

  if (Platform.OS === 'android') {
    return hasCoords
      ? `google.navigation:q=${latitude},${longitude}`
      : `geo:0,0?q=${encodedAddress}`;
  }

  return null;
}

export async function openGoogleMapsDirections(params: OpenGoogleMapsDirectionsParams) {
  const webUrl = buildWebDirectionsUrl(params);
  const nativeUrl = buildNativeDirectionsUrl(params);

  if (nativeUrl) {
    try {
      const canOpen = await Linking.canOpenURL(nativeUrl);
      if (canOpen) {
        await Linking.openURL(nativeUrl);
        return;
      }
    } catch {
      // Fall back to web URL below.
    }
  }

  await Linking.openURL(webUrl);
}
