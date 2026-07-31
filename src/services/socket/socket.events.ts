export const SOCKET_EVENTS = {
  notification: 'notification',
  bookingStatus: 'booking-status',
  bookingUpdated: 'booking:updated',
} as const;

export interface SocketNotificationPayload {
  title?: string;
  message?: string;
  type?: string;
  payload?: unknown;
}

export interface SocketBookingStatusPayload {
  bookingId: string;
  status: string;
  courtName: string;
}
