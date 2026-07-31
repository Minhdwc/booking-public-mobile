import { create } from 'zustand';

import type { BookingDraft } from './booking-draft.type';

type BookingDraftState = {
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
};

export const useBookingDraftStore = create<BookingDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
