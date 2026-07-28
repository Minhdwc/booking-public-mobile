import type { IUser } from '@/types';

export type AuthUser = Omit<IUser, 'password' | 'verifyToken'>;

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
}

export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  phone: string;
};
