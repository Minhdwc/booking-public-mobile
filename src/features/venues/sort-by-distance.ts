import type { UserCoordinates } from '@/features/location';
import { formatDistance, getDistanceKm } from '@/lib/maps/distance';

import type { VenueListItem } from './venues.type';

export function attachDistanceToVenues(
  venues: VenueListItem[],
  user?: UserCoordinates,
): VenueListItem[] {
  if (!user) return venues;

  return [...venues]
    .map((venue) => {
      const distanceKm = getDistanceKm(
        user.latitude,
        user.longitude,
        venue.latitude,
        venue.longitude,
      );

      return {
        ...venue,
        distanceKm,
        distanceLabel: distanceKm != null ? formatDistance(distanceKm) : null,
      };
    })
    .sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
}
