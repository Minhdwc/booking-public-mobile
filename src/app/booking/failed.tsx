import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { PrimaryButton, ScreenHeader } from '@/components/ui';

const STATUS_MESSAGES: Record<string, string> = {
  failed: 'Giao dịch không thành công hoặc đã bị hủy.',
  invalid: 'Phản hồi thanh toán không hợp lệ.',
  not_found: 'Không tìm thấy giao dịch thanh toán.',
  amount_mismatch: 'Số tiền thanh toán không khớp.',
};

export default function BookingFailedScreen() {
  const { bookingId, status } = useLocalSearchParams<{ bookingId?: string; status?: string }>();

  const message =
    (typeof status === 'string' && STATUS_MESSAGES[status]) ||
    'Thanh toán chưa hoàn tất. Bạn có thể thử lại trong thời gian giữ chỗ.';

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Thanh toán thất bại" />

      <View className="flex-1 gap-6 px-6 pt-6">
        <View className="items-center gap-3 rounded-3xl border border-clay/30 bg-clay/10 p-8">
          <Text className="text-5xl">✕</Text>
          <Text className="text-center text-2xl font-extrabold text-ink dark:text-paper">
            Thanh toán chưa thành công
          </Text>
          <Text className="text-center text-sm leading-6 text-mist">{message}</Text>
        </View>

        {bookingId ? (
          <PrimaryButton
            label="Thử thanh toán lại"
            onPress={() =>
              router.replace({
                pathname: '/checkout',
                params: { bookingId },
              })
            }
          />
        ) : null}

        <PrimaryButton label="Về trang chủ" variant="secondary" onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}
