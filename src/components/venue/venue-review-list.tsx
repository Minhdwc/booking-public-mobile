import { Text, View } from 'react-native';

import { EmptyState, LoadingState } from '@/components/ui';
import { Review } from '@/features/reviews';

type VenueReviewListProps = {
  reviews: Review[];
  isLoading?: boolean;
};

export function VenueReviewList({ reviews, isLoading }: VenueReviewListProps) {
  if (isLoading) {
    return <LoadingState variant="inline" />;
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="Chưa có đánh giá"
        message="Sân này chưa nhận được đánh giá nào từ người dùng."
        emoji="💬"
      />
    );
  }

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(reviews.length, 1);

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-paper/10">
        <Text className="text-lg font-extrabold text-ink dark:text-paper">★ {average.toFixed(1)}</Text>
        <Text className="text-sm text-mist">{reviews.length} đánh giá</Text>
      </View>

      <View className="gap-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View className="gap-2 rounded-2xl border border-ink/10 p-4 dark:border-paper/10">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="font-bold text-ink dark:text-paper">
          {review.user?.name ?? 'Người dùng'}
        </Text>
        <Text className="text-sm font-bold text-line">{'★'.repeat(review.rating)}</Text>
      </View>
      <Text className="text-xs text-mist">{formatReviewDate(review.createdAt)}</Text>
      <Text className="text-sm leading-5 text-mist">
        {review.comment?.trim() || 'Không có nhận xét.'}
      </Text>
    </View>
  );
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
