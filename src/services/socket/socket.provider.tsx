import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';

import { useAuthStore } from '@/features/auth';
import { queryKeys } from '@/lib/react-query/query-keys';

import { createSocket, disconnectSocket } from './socket.client';
import {
  SOCKET_EVENTS,
  SocketBookingStatusPayload,
  SocketNotificationPayload,
} from './socket.events';

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const canConnect = !isLoading && isLoggedIn && Boolean(accessToken && user);

    if (!canConnect) {
      setSocket((current) => {
        disconnectSocket(current);
        return null;
      });
      return;
    }

    const nextSocket = createSocket(accessToken!);
    setSocket(nextSocket);

    const invalidateNotifications = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    const invalidateBookings = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.booking.list() });
    };

    const handleNotification = (_payload: SocketNotificationPayload) => {
      invalidateNotifications();
      invalidateBookings();
    };

    const handleBookingStatus = (payload: SocketBookingStatusPayload) => {
      invalidateBookings();
      if (payload.bookingId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.booking.detail(payload.bookingId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.booking.timeline(payload.bookingId),
        });
      }
    };

    nextSocket.on(SOCKET_EVENTS.notification, handleNotification);
    nextSocket.on(SOCKET_EVENTS.bookingStatus, handleBookingStatus);
    nextSocket.on(SOCKET_EVENTS.bookingUpdated, invalidateBookings);

    return () => {
      disconnectSocket(nextSocket);
      setSocket(null);
    };
  }, [accessToken, isLoading, isLoggedIn, queryClient, user]);

  return <SocketContext value={socket}>{children}</SocketContext>;
}
