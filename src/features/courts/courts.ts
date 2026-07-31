import { formatVnd } from '@/features/venues';
import { apiClient } from '@/services/http/client';

export interface CourtSport {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface CourtVenue {
  id: string;
  name: string;
  address: string;
  district: string | null;
  city: string | null;
  status: string;
}

export interface CourtImage {
  id: string;
  url: string;
  courtId: string;
  isThumbnail: boolean;
  position: number;
}

export interface Court {
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
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  subtotal: number;
  status: 'available' | 'booked' | 'past';
}

export interface CourtAvailability {
  courtId: string;
  date: string;
  slots: AvailabilitySlot[];
}

export interface CourtDetail {
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
}

export const courtsApi = {
  getById(id: string) {
    return apiClient.get<Court>(`/courts/${id}`);
  },

  getAvailability(courtId: string, date: string) {
    return apiClient.get<CourtAvailability>(`/courts/${courtId}/availability`, {
      params: { date },
    });
  },
};

export function mapCourtDetail(court: Court): CourtDetail {
  const isBookable = court.status === 'active';
  const images = court.courtImages ?? [];
  const coverImageUrl =
    images.find((image) => image.isThumbnail)?.url ?? images[0]?.url ?? null;

  return {
    id: court.id,
    venueId: court.venueId,
    name: court.name,
    description: court.description,
    sportName: court.sport?.name ?? 'Đa môn',
    venueName: court.venue?.name ?? 'Cơ sở',
    venueAddress: court.venue?.address ?? '',
    basePriceVnd: court.basePriceVnd,
    minDurationMinutes: court.minDurationMinutes,
    durationStepMinutes: court.durationStepMinutes,
    status: court.status,
    isBookable,
    priceLabel: `${formatVnd(court.basePriceVnd)}/${court.minDurationMinutes} phút`,
    durationLabel: `Bước ${court.durationStepMinutes} phút`,
    coverImageUrl,
  };
}
