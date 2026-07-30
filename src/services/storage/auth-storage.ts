import { storage } from './storage';

export const authStorage = {
  saveAccessToken: async (token: string) => {
    await storage.set('accessToken', token);
  },
  saveRefreshToken: async (token: string) => {
    await storage.set('refreshToken', token);
  },
  getAccessToken: async () => {
    return await storage.get('accessToken');
  },
  getRefreshToken: async () => {
    return await storage.get('refreshToken');
  },
  removeAccessToken: async () => {
    await storage.remove('accessToken');
  },
  removeRefreshToken: async () => {
    await storage.remove('refreshToken');
  },
  clearTokens: async () => {
    await storage.clear(['accessToken', 'refreshToken']);
  },
};
