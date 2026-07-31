import { apiClient } from '@/services/http/client';

export interface PresignUploadResponse {
  key: string;
  uploadUrl: string;
  url: string;
}

export interface UploadAvatarPayload {
  folder: 'avatars';
  filename: string;
  contentType: string;
}

export const uploadsApi = {
  presign(payload: UploadAvatarPayload) {
    return apiClient.post<PresignUploadResponse>('/uploads/presign', payload);
  },
};

export async function uploadFileToPresignedUrl(
  uploadUrl: string,
  uri: string,
  contentType: string,
) {
  const fileResponse = await fetch(uri);
  const blob = await fileResponse.blob();

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  if (!response.ok) {
    throw new Error('Không thể tải ảnh lên');
  }
}
