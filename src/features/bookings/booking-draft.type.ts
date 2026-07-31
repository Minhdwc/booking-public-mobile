export type CourtSport = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type CourtVenue = {
  id: string;
  name: string;
  address: string;
  district: string | null;
  city: string | null;
  status: string;
};

export type CourtImage = {
  id: string;
  url: string;
  courtId: string;
  isThumbnail: boolean;
  position: number;
};

export type Court = {
  id: string;
  venueId: string;
  sportId: string;
  name: string;
  description: string | null;
  basePriceVnd: number;
  minDurationMinutes: number;
  durationStepMinutes: number;
  status: string;
  sport?: CourtSport;
  venue?: CourtVenue;
  courtImages?: CourtImage[];
};

export type AvailabilitySlot = {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  subtotal: number;
  status: 'available' | 'booked';
};

export type CourtAvailability = {
  courtId: string;
  date: string;
  slots: AvailabilitySlot[];
};

export type CourtDetail = {
  id: string;
  venueId: string;
  name: string;
  description: string | null;
  sportName: string;
  venueName: string;
  venueAddress: string;
  basePriceVnd: number;
  minDurationMinutes: number;
  durationStepMinutes: number;
  status: string;
  isBookable: boolean;
  priceLabel: string;
  durationLabel: string;
  coverImageUrl: string | null;
};

export type SelectedSlot = {
  startTime: string;
  endTime: string;
  subtotal: number;
};

export type BookingDraft = {
  courtId: string;
  courtName: string;
  venueId: string;
  venueName: string;
  date: string;
  selectedSlots: SelectedSlot[];
};
