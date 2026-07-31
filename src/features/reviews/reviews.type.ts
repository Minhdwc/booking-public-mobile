export type ReviewUser = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type Review = {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: ReviewUser;
};

export type ReviewsListParams = {
  venueId?: string;
  page?: number;
  limit?: number;
};
