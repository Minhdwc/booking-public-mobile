import type {
  Amenity,
  Venue,
  VenueAmenityLink,
  VenueCourt,
  VenueDetail,
  VenueListItem,
} from './venues.type';

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
    latitude: venue.latitude,
    longitude: venue.longitude,
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

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type SortableImage = {
  url: string;
  isThumbnail: boolean;
  position: number;
};

function sortImages<T extends SortableImage>(images: T[]): T[] {
  return [...images].sort((a, b) => {
    if (a.isThumbnail !== b.isThumbnail) return a.isThumbnail ? -1 : 1;
    return a.position - b.position;
  });
}

function getVenueGalleryImages(venue: Venue): string[] {
  const venueImages = sortImages(venue.venueImages ?? []);
  if (venueImages.length > 0) {
    return venueImages.map((image) => image.url);
  }

  const courtImages = sortImages(
    (venue.courts ?? []).flatMap((court) => court.courtImages ?? []),
  );
  return courtImages.map((image) => image.url);
}

export function toImageUrls(images: Venue['venueImages'] = []): string[] {
  return sortImages(images).map((image) => image.url);
}

export function mapAmenityLinks(links: VenueAmenityLink[]): Amenity[] {
  return links
    .map((link) => link.amenity)
    .filter((amenity): amenity is Amenity => Boolean(amenity?.name));
}

export function mapCourtToListItem(court: VenueCourt): VenueDetail['courts'][number] {
  const sportName = court.sport?.name ?? 'Đa môn';
  const isBookable = court.status === 'active';

  return {
    id: court.id,
    name: court.name,
    sportName,
    priceLabel: `${formatVnd(court.basePriceVnd)}/${court.minDurationMinutes} phút`,
    durationLabel: `Bước ${court.durationStepMinutes} phút`,
    status: court.status,
    statusLabel: isBookable ? 'Sẵn sàng' : 'Tạm ngưng',
    isBookable,
  };
}

export function mapVenueDetail(venue: Venue, amenityLinks: VenueAmenityLink[] = []): VenueDetail {
  const courts = (venue.courts ?? []).map(mapCourtToListItem);
  const price = getMinCourtPrice(venue);
  const imageUrls = getVenueGalleryImages(venue);
  const amenities = mapAmenityLinks(amenityLinks);

  return {
    id: venue.id,
    name: venue.name,
    description: venue.description,
    address: venue.address,
    addressShort: shortenAddress(venue),
    district: venue.district,
    city: venue.city,
    phone: venue.phone,
    latitude: venue.latitude,
    longitude: venue.longitude,
    status: venue.status,
    ratingAverage: venue.ratingAverage,
    ratingCount: venue.ratingCount,
    ratingLabel: venue.ratingCount > 0 ? venue.ratingAverage.toFixed(1) : 'Mới',
    imageUrls,
    todayHoursLabel: getTodayHoursLabel(venue.operatingHours ?? []),
    operatingHoursSummary: getOperatingHoursSummary(venue.operatingHours ?? []),
    courts,
    amenities,
    courtCountLabel: courts.length === 1 ? '1 sân' : `${courts.length} sân`,
    priceLabel: price
      ? `từ ${formatVnd(price.amount)}/${price.duration} phút`
      : null,
  };
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
  return getVenueGalleryImages(venue)[0] ?? null;
}

function getTodayHoursLabel(hours: Venue['operatingHours']): string | null {
  if (!hours?.length) return null;

  const today = new Date().getDay();
  const todayHours = hours.find((hour) => hour.dayOfWeek === today);
  if (!todayHours) return null;

  return `Hôm nay ${todayHours.openTime} – ${todayHours.closeTime}`;
}

function getOperatingHoursSummary(hours: Venue['operatingHours']): string | null {
  if (!hours?.length) return null;

  const sorted = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const first = sorted[0];
  const sameHours = sorted.every(
    (hour) => hour.openTime === first.openTime && hour.closeTime === first.closeTime,
  );

  if (sameHours) {
    return `Hàng ngày ${first.openTime} – ${first.closeTime}`;
  }

  return sorted
    .map((hour) => `${WEEKDAY_LABELS[hour.dayOfWeek]}: ${hour.openTime}–${hour.closeTime}`)
    .join(' · ');
}
