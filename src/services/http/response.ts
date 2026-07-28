export interface ApiResponse<T> {
  statusCode?: number;
  message?: string;
  data: T;
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export type PaginatedResult<T> = {
  page: number;
  limit: number;
  total: number;
  data: T[];
};

export function unwrapList<T>(payload: T[] | PaginatedResult<T> | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.data || [];
}

export function unwrapPage<T>(
  payload: T[] | PaginatedResult<T> | null | undefined,
): PaginatedResult<T> {
  if (!payload) {
    return { page: 1, limit: 10, total: 0, data: [] };
  }

  if (Array.isArray(payload)) {
    return { page: 1, limit: payload.length, total: payload.length, data: payload };
  }

  return {
    page: payload.page,
    limit: payload.limit,
    total: payload.total,
    data: payload.data || [],
  };
}
