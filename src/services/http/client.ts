import axios, { AxiosRequestConfig } from 'axios';

import { clearApiTokens, getAccessToken, getRefreshToken, notifyTokensRefreshed } from './token';

import { ApiError, getErrorMessage } from './errors';
import { ApiErrorBody, ApiResponse, RefreshResponse } from './response';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

type ApiClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

let onLogout: (() => void) | null = null;

export function setUnauthorizedHandler(callback: () => void) {
  onLogout = callback;
}

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data.data,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (!error.response) {
      const message =
        error.code === 'ECONNABORTED'
          ? 'Máy chủ phản hồi quá chậm'
          : `Không kết nối được API (${API_URL})`;
      return Promise.reject(new ApiError(0, message));
    }

    const body = error.response.data as ApiErrorBody;
    const message = getErrorMessage(body.message) || error.message || 'Đã xảy ra lỗi';

    const isAuthUrl =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const res = await axios.post<ApiResponse<RefreshResponse>>(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const tokens = res.data.data;
        await notifyTokensRefreshed(tokens.accessToken, tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosClient(originalRequest);
      } catch {
        clearApiTokens();
        onLogout?.();
        return Promise.reject(new ApiError(401, 'Phiên đăng nhập đã hết hạn'));
      }
    }

    return Promise.reject(new ApiError(status ?? 500, message));
  },
);

export const apiClient = axiosClient as ApiClient;

export default apiClient;
