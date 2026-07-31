import * as ImagePicker from 'expo-image-picker';

import { uploadFileToPresignedUrl, uploadsApi } from '@/lib/uploads/uploads';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function pickAvatarImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Cần quyền truy cập thư viện ảnh');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0];
}

export async function uploadAvatarFromAsset(asset: ImagePicker.ImagePickerAsset) {
  const contentType = asset.mimeType ?? 'image/jpeg';

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error('Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP');
  }

  const extension = contentType.split('/')[1] ?? 'jpg';
  const filename = `avatar-${Date.now()}.${extension}`;
  const presign = await uploadsApi.presign({
    folder: 'avatars',
    filename,
    contentType,
  });

  await uploadFileToPresignedUrl(presign.uploadUrl, asset.uri, contentType);
  return presign.url;
}
