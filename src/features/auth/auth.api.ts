import type {
  AuthSession,
  AuthUser,
  LoginForm,
  LogoutResponse,
  RegisterForm,
  VerifyEmailResponse,
} from '@/features/auth/auth.type';
import { apiClient } from '@/services/http/client';

export const authApi = {
  login(data: LoginForm) {
    return apiClient.post<AuthSession>('/auth/login', data);
  },

  register(data: RegisterForm) {
    const { confirmPassword: _, ...body } = data;
    return apiClient.post<AuthSession>('/auth/register', body);
  },

  logout() {
    return apiClient.post<LogoutResponse>('/auth/logout');
  },

  verifyEmail(token: string) {
    return apiClient.post<VerifyEmailResponse>('/auth/verify-email', { token });
  },

  resendVerifyEmail() {
    return apiClient.post<{ success: boolean; message: string }>('/auth/resend-verify');
  },

  getMe() {
    return apiClient.get<AuthUser>('/auth/me');
  },
};
