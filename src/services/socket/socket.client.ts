import { io, Socket } from 'socket.io-client';

import { API_URL } from '@/services/http/client';

export function getSocketUrl() {
  return API_URL.replace(/\/api\/v1\/?$/, '');
}

export function createSocket(accessToken: string): Socket {
  return io(getSocketUrl(), {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });
}

export function disconnectSocket(socket: Socket | null) {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
}
