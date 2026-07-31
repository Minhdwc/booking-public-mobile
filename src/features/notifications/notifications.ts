import { apiClient } from '@/services/http/client';
import { PaginatedResult, unwrapList } from '@/services/http/response';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export const notificationsApi = {
  list(limit = 50) {
    return apiClient
      .get<PaginatedResult<Notification> | Notification[]>('/notifications', { params: { limit } })
      .then(unwrapList);
  },

  unreadCount() {
    return apiClient.get<number>('/notifications/unread-count');
  },

  markRead(id: string) {
    return apiClient.patch<Notification>(`/notifications/${id}/read`);
  },

  markAllRead() {
    return apiClient.patch<{ success: boolean }>('/notifications/read-all');
  },
};
