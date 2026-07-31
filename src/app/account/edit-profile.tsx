import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { AuthInput } from '@/components/auth/auth-input';
import { ErrorState, LoadingState, PrimaryButton, ScreenHeader } from '@/components/ui';
import {
  getAccountErrorMessage,
  profileSchema,
  useAccountProfile,
  useUpdateProfile,
} from '@/features/account';
import { pickAvatarImage, uploadAvatarFromAsset } from '@/lib/uploads/avatar-upload';

export default function EditProfileScreen() {
  const { data: profile, isLoading, isError, refetch } = useAccountProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setUsername(profile.username);
    setPhone(profile.phone);
    setAvatarUrl(profile.avatarUrl ?? '');
  }, [profile]);

  const handlePickAvatar = async () => {
    setActionError('');
    try {
      const asset = await pickAvatarImage();
      if (!asset) return;
      const url = await uploadAvatarFromAsset(asset);
      setAvatarUrl(url);
    } catch (error) {
      setActionError(getAccountErrorMessage(error));
    }
  };

  const handleSave = async () => {
    setFieldError('');
    setActionError('');

    const parsed = profileSchema.safeParse({ name, username, phone, avatarUrl });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Thông tin không hợp lệ');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: parsed.data.name,
        username: parsed.data.username,
        phone: parsed.data.phone,
        avatarUrl: parsed.data.avatarUrl || undefined,
      });
      router.back();
    } catch (error) {
      setActionError(getAccountErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Sửa hồ sơ" showBack />
        <LoadingState message="Đang tải hồ sơ..." />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Sửa hồ sơ" showBack />
        <View className="px-6 pt-4">
          <ErrorState
            title="Không tải được hồ sơ"
            message="Vui lòng thử lại."
            actionLabel="Thử lại"
            onRetry={() => void refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Sửa hồ sơ" subtitle="Cập nhật thông tin cá nhân" showBack />

      <ScrollView contentContainerClassName="gap-5 px-6 pb-8 pt-4">
        <View className="items-center gap-3">
          <Pressable onPress={() => void handlePickAvatar()} className="active:opacity-80">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="h-24 w-24 rounded-full bg-ink/5" />
            ) : (
              <View className="h-24 w-24 items-center justify-center rounded-full bg-line/20">
                <Text className="text-3xl">👤</Text>
              </View>
            )}
          </Pressable>
          <Text className="text-sm font-bold text-line" onPress={() => void handlePickAvatar()}>
            Đổi ảnh đại diện
          </Text>
        </View>

        <AuthInput label="Họ tên" value={name} onChangeText={setName} />
        <AuthInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <AuthInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        {fieldError ? <Text className="text-sm text-clay">{fieldError}</Text> : null}
        {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}

        <PrimaryButton
          label={updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          loading={updateProfile.isPending}
          onPress={() => void handleSave()}
        />
      </ScrollView>
    </View>
  );
}
