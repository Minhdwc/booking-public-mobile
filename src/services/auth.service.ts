import { apiClient } from '@/services/api/client';
import type { IUser } from '../../types/index';

export async function getMe() {
  return apiClient.get<IUser>('/account/me');
}
