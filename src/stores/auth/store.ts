import { create } from 'zustand';

import { setUnauthorizedHandler } from '@/services/api';
import { clearApiTokens, registerSaveTokens, setApiTokens } from '@/services/api/token';
import { getMe } from '@/services/auth.service';
import { authStorage } from '@/services/storage';
import type { IUser } from '../../../types/index';

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

  init: async () => {
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
      const user = await getMe();
      set({ user: user.data, isLoading: false });
    } catch {
      await get().logout();
    }
  },
}));
