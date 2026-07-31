import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AuthInput } from '@/components/auth/auth-input';
import { PrimaryButton, ScreenHeader } from '@/components/ui';
import { changePasswordSchema, getAccountErrorMessage, useChangePassword } from '@/features/account';

export default function ChangePasswordScreen() {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    setFieldError('');
    setActionError('');
    setSuccessMessage('');

    const parsed = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Thông tin không hợp lệ');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      setSuccessMessage('Đổi mật khẩu thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => router.back(), 800);
    } catch (error) {
      setActionError(getAccountErrorMessage(error));
    }
  };

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Đổi mật khẩu" subtitle="Bảo mật tài khoản" showBack />

      <ScrollView contentContainerClassName="gap-5 px-6 pb-8 pt-4">
        <AuthInput
          label="Mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <AuthInput
          label="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <AuthInput
          label="Xác nhận mật khẩu mới"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />

        {fieldError ? <Text className="text-sm text-clay">{fieldError}</Text> : null}
        {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}
        {successMessage ? <Text className="text-sm font-bold text-court">{successMessage}</Text> : null}

        <PrimaryButton
          label={changePassword.isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          loading={changePassword.isPending}
          onPress={() => void handleSubmit()}
        />
      </ScrollView>
    </View>
  );
}
