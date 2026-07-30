import { create } from 'zustand';

import type { LoginForm, RegisterForm } from '@/features/auth/auth.type';
import { authApi } from '@/features/auth/auth.api';
import { setUnauthorizedHandler } from '@/services/http';
import { clearApiTokens, registerSaveTokens, setApiTokens } from '@/services/http/token';
import { authStorage } from '@/services/storage';
import type { IUser } from '@/types';

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

    set({
      user,
      accessToken,
      refreshToken,
      isLoggedIn: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await authStorage.clearTokens();
    clearApiTokens();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },

  updateTokens: async (accessToken, refreshToken) => {
    await authStorage.saveAccessToken(accessToken);
    await authStorage.saveRefreshToken(refreshToken);
    setApiTokens(accessToken, refreshToken);

    set({ accessToken, refreshToken, isLoggedIn: true });
  },

  updateUser: (user) => {
    set({ user });
  },

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
