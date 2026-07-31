import { Pressable, Text } from 'react-native';

import { useAuth } from '@/features/auth';
import { useIsVenueFavorite, useToggleFavoriteVenue } from '@/features/favorites';

type FavoriteToggleButtonProps = {
  venueId: string;
};

export function FavoriteToggleButton({ venueId }: FavoriteToggleButtonProps) {
  const { isLoggedIn } = useAuth();
  const isFavorite = useIsVenueFavorite(venueId, isLoggedIn);
  const toggleFavorite = useToggleFavoriteVenue();

  if (!isLoggedIn) return null;

  return (
    <Pressable
      onPress={() => toggleFavorite.mutate(venueId)}
      disabled={toggleFavorite.isPending}
      className="h-10 w-10 items-center justify-center rounded-full bg-ink/5 active:opacity-70 disabled:opacity-50 dark:bg-paper/10"
    >
      <Text className="text-lg">{isFavorite ? '❤️' : '🤍'}</Text>
    </Pressable>
  );
}
