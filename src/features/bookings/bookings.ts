import { z } from 'zod';
import { create } from 'zustand';

import { formatSlotTime } from '@/components/booking/booking-utils';
import { apiClient } from '@/services/http/client';
import { PaginatedResult, unwrapList } from '@/services/http/response';

type BookingStatus =
  | 'waiting_payment'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'expired';

type BookingItemStatus = 'active' | 'cancelled';

export interface BookingItem {
  id: string;
  bookingId: string;
  courtId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  pricePerHour: number;
  subtotal: number;
  status: BookingItemStatus;
  createdAt: string;
  updatedAt: string;
  court?: {
    id: string;
    name: string;
    venue?: { id: string; name: string };
    sport?: { id: string; name: string };
  };
}

export interface Booking {
  id: string;
  userId: string;
  bookingCode: string;
  status: BookingStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  note?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: BookingItem[];
}

export interface CreateBookingItemPayload {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateBookingPayload {
  items: CreateBookingItemPayload[];
  note?: string;
}

export interface SelectedSlot {
  startTime: string;
  endTime: string;
  subtotal: number;
}

export interface BookingDraft {
  courtId: string;
  courtName: string;
  venueId: string;
  venueName: string;
  date: string;
  selectedSlots: SelectedSlot[];
}

const bookingItemSchema = z.object({
  courtId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export const createBookingSchema = z.object({
  items: z.array(bookingItemSchema).min(1, 'Cần chọn ít nhất một khung giờ'),
  note: z.string().optional(),
});

export interface CreateBookingInput extends z.infer<typeof createBookingSchema> {}

export interface BookingTimelineEvent {
  id: string;
  action: string;
  fromValue?: string | null;
  toValue?: string | null;
  note?: string | null;
  createdAt: string;
}

export type BookingListTab = 'upcoming' | 'past' | 'cancelled';

export const bookingsApi = {
  list(limit = 100) {
    return apiClient
      .get<PaginatedResult<Booking> | Booking[]>('/bookings', { params: { limit } })
      .then(unwrapList);
  },

  create(payload: CreateBookingPayload) {
    return apiClient.post<Booking>('/bookings', payload);
  },

  getById(id: string) {
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  getTimeline(id: string) {
    return apiClient.get<BookingTimelineEvent[]>(`/bookings/${id}/timeline`);
  },

  cancel(id: string) {
    return apiClient.patch<Booking>(`/bookings/${id}`, { status: 'cancelled' });
  },
};

export function getPrimaryBookingItem(booking: Booking) {
  return booking.items?.[0];
}

export function canCancelBooking(booking: Booking) {
  return booking.status === 'waiting_payment' || booking.status === 'confirmed';
}

export function isBookingHoldActive(booking: Booking) {
  if (booking.status !== 'waiting_payment' || !booking.expiresAt) return false;
  return new Date(booking.expiresAt).getTime() > Date.now();
}

export function filterBookingsByTab(bookings: Booking[], tab: BookingListTab) {
  switch (tab) {
    case 'upcoming':
      return bookings.filter((booking) =>
        ['waiting_payment', 'confirmed'].includes(booking.status),
      );
    case 'past':
      return bookings.filter((booking) => booking.status === 'completed');
    case 'cancelled':
      return bookings.filter((booking) => ['cancelled', 'expired'].includes(booking.status));
    default:
      return bookings;
  }
}

export function formatTimelineAction(action: string) {
  switch (action) {
    case 'booking.created':
      return 'Tạo đặt sân';
    case 'booking.waiting_payment':
      return 'Chờ thanh toán';
    case 'booking.confirmed':
      return 'Đã xác nhận';
    case 'booking.confirmed_manually':
      return 'Xác nhận thủ công';
    case 'booking.cancelled':
      return 'Đã hủy';
    case 'booking.completed':
      return 'Hoàn thành';
    case 'booking.expired':
      return 'Hết hạn giữ chỗ';
    case 'booking.walk_in':
      return 'Walk-in tại sân';
    default:
      return action.replace(/^booking\./, '').replace(/_/g, ' ');
  }
}

export function draftToCreateBookingPayload(draft: BookingDraft, note?: string): CreateBookingPayload {
  return {
    items: draft.selectedSlots.map((slot) => ({
      courtId: draft.courtId,
      date: draft.date,
      startTime: formatSlotTime(slot.startTime),
      endTime: formatSlotTime(slot.endTime),
    })),
    note,
  };
}

export const useBookingDraftStore = create<{
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
}>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
