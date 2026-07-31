export type VenueStatus = 'pending' | 'active' | 'inactive' | 'suspended';

export type VenueSport = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type VenueCourtImage = {
  id: string;
  url: string;
  courtId: string;
  isThumbnail: boolean;
  position: number;
};

export type VenueCourt = {
  id: string;
  venueId: string;
  sportId: string;
  name: string;
  description: string | null;
  basePriceVnd: number;
  minDurationMinutes: number;
  durationStepMinutes: number;
  status: string;
  sport?: VenueSport;
  courtImages?: VenueCourtImage[];
};

export type VenueImage = {
  id: string;
  url: string;
  venueId: string;
  isThumbnail: boolean;
  position: number;
};

export type VenueOperatingHour = {
  id: string;
  venueId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
};

export type Venue = {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  district: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  status: VenueStatus;
  ratingAverage: number;
  ratingCount: number;
  bookingCount: number;
  favoriteCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  courts?: VenueCourt[];
  venueImages?: VenueImage[];
  operatingHours?: VenueOperatingHour[];
};

export type VenuesListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type VenueListItem = {
  id: string;
  name: string;
  sportLabel: string;
  sportNames: string[];
  addressShort: string;
  latitude: number;
  longitude: number;
  coverImageUrl: string | null;
  priceLabel: string | null;
  ratingLabel: string;
  courtCountLabel: string;
  hoursLabel: string | null;
  distanceLabel?: string | null;
  distanceKm?: number | null;
};

export type Amenity = {
  id: string;
  name: string;
  description?: string | null;
};

export type VenueAmenityLink = {
  id: string;
  venueId: string;
  amenityId: string;
  amenity: Amenity;
};

export type VenueCourtListItem = {
  id: string;
  name: string;
  sportName: string;
  priceLabel: string;
  durationLabel: string;
  status: string;
  statusLabel: string;
  isBookable: boolean;
};

export type VenueDetail = {
  id: string;
  name: string;
  description: string;
  address: string;
  addressShort: string;
  district: string | null;
  city: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  status: VenueStatus;
  ratingAverage: number;
  ratingCount: number;
  ratingLabel: string;
  imageUrls: string[];
  todayHoursLabel: string | null;
  operatingHoursSummary: string | null;
  courts: VenueCourtListItem[];
  amenities: Amenity[];
  courtCountLabel: string;
  priceLabel: string | null;
};
