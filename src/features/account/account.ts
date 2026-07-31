import { z } from 'zod';

import { AuthUser } from '@/features/auth';
import { apiClient } from '@/services/http/client';

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const profileSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên không được quá 100 ký tự'),
  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được quá 50 ký tự'),
  phone: z
    .string()
    .regex(/^(\+84|84|0)(3|5|7|8|9)\d{8}$/, 'Số điện thoại Việt Nam không hợp lệ'),
  avatarUrl: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    newPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  });

export interface ProfileFormValues extends z.infer<typeof profileSchema> {}
export interface ChangePasswordFormValues extends z.infer<typeof changePasswordSchema> {}

export const accountApi = {
  getMe() {
    return apiClient.get<AuthUser>('/account/me');
  },

  updateProfile(payload: UpdateProfilePayload) {
    return apiClient.patch<AuthUser>('/account/profile', payload);
  },

  changePassword(payload: ChangePasswordPayload) {
    return apiClient.patch<{ success: boolean }>('/account/change-password', payload);
  },
};
