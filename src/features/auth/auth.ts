import { z } from 'zod';
import { create } from 'zustand';

import { apiClient } from '@/services/http/client';
import { setUnauthorizedHandler } from '@/services/http';
import { clearApiTokens, registerSaveTokens, setApiTokens } from '@/services/http/token';
import { authStorage } from '@/services/storage';
import { IUser } from '@/types';

export interface AuthUser extends Omit<IUser, 'password' | 'verifyToken'> {}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  phone: string;
}
export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

export const registerSchema = z
  .object({
    email: z.email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
    phone: z.string().regex(/^(\+84|84|0)(3|5|7|8|9)\d{8}$/, 'Số điện thoại Việt Nam không hợp lệ'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu không khớp',
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Mã xác minh không được để trống'),
});

export interface LoginFormValues extends z.infer<typeof loginSchema> {}
export interface RegisterFormValues extends z.infer<typeof registerSchema> {}
export interface VerifyEmailFormValues extends z.infer<typeof verifyEmailSchema> {}
export const authApi = {
  login(data: LoginForm) {
    return apiClient.post<AuthSession>('/auth/login', data);
  },

  register(data: RegisterForm) {
    const { confirmPassword: _, ...body } = data;
    return apiClient.post<AuthSession>('/auth/register', body);
  },

  logout() {
    return apiClient.post<{ success: boolean }>('/auth/logout');
  },

  verifyEmail(token: string) {
    return apiClient.post<{ success: boolean; message: string }>('/auth/verify-email', { token });
  },

  resendVerifyEmail() {
    return apiClient.post<{ success: boolean; message: string }>('/auth/resend-verify');
  },

  getMe() {
    return apiClient.get<AuthUser>('/auth/me');
  },
};
export const useAuthStore = create<{
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: IUser, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  updateUser: (user: IUser) => void;
  signIn: (data: LoginForm) => Promise<void>;
  signUp: (data: RegisterForm) => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmailToken: (token: string) => Promise<string>;
  init: () => Promise<void>;
}>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isLoading: true,

  login: async (user, accessToken, refreshToken) => {
    await authStorage.saveAccessToken(accessToken);
    await authStorage.saveRefreshToken(refreshToken);
    setApiTokens(accessToken, refreshToken);
    set({ user, accessToken, refreshToken, isLoggedIn: true, isLoading: false });
  },

  logout: async () => {
    await authStorage.clearTokens();
    clearApiTokens();
    set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isLoading: false });
  },

  updateTokens: async (accessToken, refreshToken) => {
    await authStorage.saveAccessToken(accessToken);
    await authStorage.saveRefreshToken(refreshToken);
    setApiTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isLoggedIn: true });
  },

  updateUser: (user) => set({ user }),

  signIn: async (data) => {
    const session = await authApi.login(data);
    await get().login(session.user as IUser, session.accessToken, session.refreshToken);
  },

  signUp: async (data) => {
    const session = await authApi.register(data);
    await get().login(session.user as IUser, session.accessToken, session.refreshToken);
  },

  signOut: async () => {
    try {
      await authApi.logout();
    } finally {
      await get().logout();
    }
  },

  verifyEmailToken: async (token) => {
    const result = await authApi.verifyEmail(token);
    if (get().isLoggedIn) {
      const user = await authApi.getMe();
      set({ user: user as IUser });
    }
    return result.message;
  },

  init: async () => {
    try {
      setUnauthorizedHandler(() => {
        void get().logout();
      });

      registerSaveTokens((accessToken, refreshToken) =>
        get().updateTokens(accessToken, refreshToken),
      );

      const accessToken = await authStorage.getAccessToken();
      const refreshToken = await authStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        set({ isLoading: false, isLoggedIn: false });
        return;
      }

      setApiTokens(accessToken, refreshToken);
      set({ accessToken, refreshToken, isLoggedIn: true });

      try {
        const user = await authApi.getMe();
        set({ user: user as IUser, isLoading: false });
      } catch {
        await get().logout();
      }
    } finally {
      if (get().isLoading) {
        set({ isLoading: false });
      }
    }
  },
}));
