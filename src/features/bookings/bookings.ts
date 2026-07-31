import { z } from 'zod';
import { create } from 'zustand';

import { formatSlotTime } from '@/components/booking/booking-utils';
import { apiClient } from '@/services/http/client';

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

export const bookingsApi = {
  create(payload: CreateBookingPayload) {
    return apiClient.post<Booking>('/bookings', payload);
  },

  getById(id: string) {
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  cancel(id: string) {
    return apiClient.patch<Booking>(`/bookings/${id}`, { status: 'cancelled' });
  },
};

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
