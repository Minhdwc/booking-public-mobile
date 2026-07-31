import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth';
import { queryKeys } from '@/lib/react-query/query-keys';
import { ApiError } from '@/services/http/errors';

import {
  accountApi,
  ChangePasswordPayload,
  UpdateProfilePayload,
} from './account';

export function useAccountProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.account.me(),
    queryFn: () => accountApi.getMe(),
    enabled,
    staleTime: 30_000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => accountApi.updateProfile(payload),
    onSuccess: (user) => {
      updateUser(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.me() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => accountApi.changePassword(payload),
  });
}

export function getAccountErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi';
}
