import type { Venue, VenueListItem } from './venues.type';

export function filterActiveVenues(venues: Venue[]): Venue[] {
  return venues.filter((venue) => venue.status === 'active');
}

export function mapVenueToListItem(venue: Venue): VenueListItem {
  const price = getMinCourtPrice(venue);
  const courtCount = venue.courts?.length ?? 0;

  return {
    id: venue.id,
    name: venue.name,
    sportLabel: getPrimarySportLabel(venue),
    sportNames: getSportNames(venue),
    addressShort: shortenAddress(venue),
    coverImageUrl: getCoverImageUrl(venue),
    priceLabel: price
      ? `từ ${formatVnd(price.amount)}/${price.duration} phút`
      : null,
    ratingLabel: venue.ratingCount > 0 ? venue.ratingAverage.toFixed(1) : 'Mới',
    courtCountLabel: courtCount === 1 ? '1 sân' : `${courtCount} sân`,
    hoursLabel: getTodayHoursLabel(venue.operatingHours ?? []),
  };
}

export function mapVenuesToListItems(venues: Venue[]): VenueListItem[] {
  return filterActiveVenues(venues).map(mapVenueToListItem);
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function getMinCourtPrice(venue: Venue): { amount: number; duration: number } | null {
  const courts = venue.courts ?? [];
  if (courts.length === 0) return null;

  const cheapest = courts.reduce((min, court) =>
    court.basePriceVnd < min.basePriceVnd ? court : min,
  );

  return {
    amount: cheapest.basePriceVnd,
    duration: cheapest.minDurationMinutes,
  };
}

function getSportNames(venue: Venue): string[] {
  const names = venue.courts?.map((court) => court.sport?.name).filter(Boolean) as string[];
  return [...new Set(names)];
}

function getPrimarySportLabel(venue: Venue): string {
  const names = getSportNames(venue);
  if (names.length === 0) return 'Đa môn';
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1}`;
}

function shortenAddress(venue: Venue): string {
  if (venue.district) return venue.district;
  if (venue.city) return venue.city;

  const parts = venue.address.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return parts.slice(-2).join(', ');
  }

  return venue.address;
}

function getCoverImageUrl(venue: Venue): string | null {
  const images = venue.venueImages ?? [];
  if (images.length === 0) return null;

  const thumbnail = images.find((image) => image.isThumbnail);
  return thumbnail?.url ?? images[0]?.url ?? null;
}

function getTodayHoursLabel(hours: Venue['operatingHours']): string | null {
  if (!hours?.length) return null;

  const today = new Date().getDay();
  const todayHours = hours.find((hour) => hour.dayOfWeek === today);
  if (!todayHours) return null;

  return `Hôm nay ${todayHours.openTime} – ${todayHours.closeTime}`;
}
