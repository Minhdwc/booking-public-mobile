import { formatVnd } from '@/features/venues/venues.mapper';

import type { Court, CourtDetail } from './courts.type';

export function mapCourtDetail(court: Court): CourtDetail {
  const isBookable = court.status === 'active';
  const coverImageUrl = getCoverImageUrl(court);

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

function getCoverImageUrl(court: Court): string | null {
  const images = court.courtImages ?? [];
  if (images.length === 0) return null;

  const thumbnail = images.find((image) => image.isThumbnail);
  return thumbnail?.url ?? images[0]?.url ?? null;
}
