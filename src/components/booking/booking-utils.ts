import { SelectedSlot } from '@/features/bookings';

export const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;
export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';

export interface BookingDayOption {
  value: string;
  weekday: string;
  dayMonth: string;
  isToday: boolean;
}

type VnClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function getVnClock(date = new Date()): VnClock {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: VN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function parseDateKey(dateStr: string): number {
  const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
  return year * 10000 + month * 100 + day;
}

function toDateKey(clock: Pick<VnClock, 'year' | 'month' | 'day'>): number {
  return clock.year * 10000 + clock.month * 100 + clock.day;
}

export function isDateBeforeTodayVn(dateStr: string, now = new Date()): boolean {
  return parseDateKey(dateStr) < toDateKey(getVnClock(now));
}

export function isSlotStartInPast(dateStr: string, startTime: string, now = new Date()): boolean {
  if (isDateBeforeTodayVn(dateStr, now)) return true;

  const slotDateKey = parseDateKey(dateStr);
  const nowDateKey = toDateKey(getVnClock(now));
  if (slotDateKey > nowDateKey) return false;

  const startMinutes = parseTimeToMinutes(startTime);
  if (Number.isNaN(startMinutes)) return false;

  const { hour, minute } = getVnClock(now);
  return startMinutes < hour * 60 + minute;
}

function parseTimeToMinutes(time: string): number {
  const normalized = time.trim();
  const match = normalized.match(/T(\d{2}):(\d{2})/) ?? normalized.match(/^(\d{2}):(\d{2})/);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function todayLocalIsoDate() {
  const { year, month, day } = getVnClock();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function next7Days(): BookingDayOption[] {
  const now = new Date();

  const days: BookingDayOption[] = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const { year, month, day } = getVnClock(date);
    const value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const weekdayIndex = new Date(`${value}T12:00:00+07:00`).getUTCDay();

    days.push({
      value,
      weekday: WEEKDAY_LABELS[weekdayIndex],
      dayMonth: `${day}/${month}`,
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

export function formatBookingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
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

export function isSlotSelectable(
  dateStr: string,
  slot: { startTime: string; status: 'available' | 'booked' | 'past' },
  now = new Date(),
): boolean {
  if (slot.status === 'booked' || slot.status === 'past') return false;
  return !isSlotStartInPast(dateStr, slot.startTime, now);
}

export function filterSelectableSlots(dateStr: string, slots: SelectedSlot[], now = new Date()) {
  return slots.filter((slot) => !isSlotStartInPast(dateStr, slot.startTime, now));
}
