import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { StarRatingPicker } from '@/components/reviews/star-rating-picker';
import { ErrorState, LoadingState, PrimaryButton, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { createReviewSchema, useCreateReview, useReviewEligibility } from '@/features/reviews';
import { useVenueDetail } from '@/features/venues';
import { ApiError } from '@/services/http/errors';

export default function WriteReviewScreen() {
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const { isLoggedIn } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [actionError, setActionError] = useState('');

  const { data: venue, isLoading: isVenueLoading } = useVenueDetail(venueId);
  const { data: eligibility, isLoading: isEligibilityLoading } = useReviewEligibility(
    venueId,
    isLoggedIn,
  );
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (!venueId) return;

    setFieldError('');
    setActionError('');

    const parsed = createReviewSchema.safeParse({ venueId, rating, comment: comment.trim() || undefined });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Thông tin không hợp lệ');
      return;
    }

    try {
      await createReview.mutateAsync(parsed.data);
      router.back();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể gửi đánh giá';
      setActionError(message);
    }
  };

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Viết đánh giá" showBack />
        <View className="px-6 pt-4">
          <ErrorState
            title="Cần đăng nhập"
            message="Đăng nhập để viết đánh giá cho cơ sở này."
            actionLabel="Đăng nhập"
            onRetry={() => router.push('/login')}
          />
        </View>
      </View>
    );
  }

  if (isVenueLoading || isEligibilityLoading) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Viết đánh giá" showBack />
        <LoadingState message="Đang kiểm tra..." />
      </View>
    );
  }

  if (!venueId || !venue) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Viết đánh giá" showBack />
        <View className="px-6 pt-4">
          <ErrorState title="Không tìm thấy cơ sở" message="Quay lại và thử lại." actionLabel="Quay lại" onRetry={() => router.back()} />
        </View>
      </View>
    );
  }

  if (eligibility && !eligibility.canReview) {
    return (
      <View className="flex-1 bg-paper dark:bg-ink">
        <ScreenHeader title="Viết đánh giá" subtitle={venue.name} showBack />
        <View className="gap-4 px-6 pt-4">
          <View className="rounded-3xl border border-ink/10 p-5 dark:border-paper/10">
            <Text className="text-base font-extrabold text-ink dark:text-paper">Chưa thể đánh giá</Text>
            <Text className="mt-2 text-sm leading-6 text-mist">{eligibility.message}</Text>
          </View>
          <PrimaryButton label="Quay lại" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-paper dark:bg-ink">
      <ScreenHeader title="Viết đánh giá" subtitle={venue.name} showBack />

      <ScrollView contentContainerClassName="gap-5 px-6 pb-8 pt-4">
        <View className="gap-3 rounded-3xl border border-ink/10 p-5 dark:border-paper/10">
          <Text className="text-sm font-bold uppercase tracking-widest text-mist">Đánh giá của bạn</Text>
          <StarRatingPicker value={rating} onChange={setRating} />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-mist">Nhận xét</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            placeholderTextColor="#8FA69B"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-3xl border border-ink/10 bg-paper px-4 py-3 text-base text-ink dark:border-paper/10 dark:bg-court-deep dark:text-paper"
          />
        </View>

        {fieldError ? <Text className="text-sm text-clay">{fieldError}</Text> : null}
        {actionError ? <Text className="text-sm text-clay">{actionError}</Text> : null}

        <PrimaryButton
          label={createReview.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
          loading={createReview.isPending}
          onPress={() => void handleSubmit()}
        />
      </ScrollView>
    </View>
  );
}
