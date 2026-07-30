export type VenueStatus = 'pending' | 'active' | 'inactive' | 'suspended';

export type VenueSport = {
  id: string;
  name: string;
  slug: string;
  status: string;
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
  coverImageUrl: string | null;
  priceLabel: string | null;
  ratingLabel: string;
  courtCountLabel: string;
  hoursLabel: string | null;
};
