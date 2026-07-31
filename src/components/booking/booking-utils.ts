import type { SelectedSlot } from '@/features/bookings';

export const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

export type BookingDayOption = {
  value: string;
  weekday: string;
  dayMonth: string;
  isToday: boolean;
};

export function todayLocalIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function next7Days(): BookingDayOption[] {
  const now = new Date();
  const days: BookingDayOption[] = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const value = `${year}-${month}-${day}`;

    days.push({
      value,
      weekday: WEEKDAY_LABELS[date.getDay()],
      dayMonth: `${date.getDate()}/${date.getMonth() + 1}`,
      isToday: i === 0,
    });
  }

  return days;
}

export function formatSlotTime(value: string) {
  const match = value.match(/T(\d{2}:\d{2})/);
  if (match) return match[1];
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  return value;
}

export function slotKey(slot: Pick<SelectedSlot, 'startTime' | 'endTime'>) {
  return `${slot.startTime}|${slot.endTime}`;
}

export function calculateSlotsSubtotal(slots: SelectedSlot[]) {
  return slots.reduce((sum, slot) => sum + slot.subtotal, 0);
}

export function buildCourtReturnPath(courtId: string) {
  return `/courts/${courtId}`;
}

export function toggleSelectedSlot(
  selectedSlots: SelectedSlot[],
  slot: SelectedSlot,
): SelectedSlot[] {
  const key = slotKey(slot);
  const exists = selectedSlots.some((item) => slotKey(item) === key);

  if (exists) {
    return selectedSlots.filter((item) => slotKey(item) !== key);
  }

  return [...selectedSlots, slot].sort((a, b) =>
    formatSlotTime(a.startTime).localeCompare(formatSlotTime(b.startTime)),
  );
}

export function isSlotSelected(selectedSlots: SelectedSlot[], slot: SelectedSlot) {
  return selectedSlots.some((item) => slotKey(item) === slotKey(slot));
}
