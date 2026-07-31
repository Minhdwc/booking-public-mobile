import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query/query-keys';

import { notificationsApi } from './notifications';

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notification.list(),
    queryFn: () => notificationsApi.list(),
    enabled,
    staleTime: 15_000,
  });
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notification.unreadCount(),
    queryFn: () => notificationsApi.unreadCount(),
    enabled,
    staleTime: 10_000,
    refetchInterval: enabled ? 30_000 : false,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
