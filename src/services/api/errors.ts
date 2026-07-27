import type { ApiErrorBody } from './response';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function getErrorMessage(message: ApiErrorBody['message']): string {
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message || 'Đã xảy ra lỗi';
}
