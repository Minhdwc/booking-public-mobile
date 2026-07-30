export const queryKeys = {
  auth: {
    login: () => ['auth', 'login'],
    register: () => ['auth', 'register'],
    logout: () => ['auth', 'logout'],
    me: () => ['auth', 'me'],
    verifyEmail: () => ['auth', 'verify-email'],
  },
  user: {
    list: () => ['users', 'list'],
    detail: (id: string) => ['users', 'detail', id],
  },
  review: {
    create: () => ['reviews', 'create'],
    edit: (id: string) => ['reviews', 'edit', id],
    delete: (id: string) => ['reviews', 'delete', id],
    list: () => ['reviews', 'list'],
    detail: (id: string) => ['reviews', 'detail', id],
  },
  'payment-method': {
    list: () => ['payment-methods', 'list'],
    detail: (id: string) => ['payment-methods', 'detail', id],
    create: () => ['payment-methods', 'create'],
    edit: (id: string) => ['payment-methods', 'edit', id],
    delete: (id: string) => ['payment-methods', 'delete', id],
  },
  booking: {
    list: () => ['booking', 'list'],
    detail: (id: string) => ['booking', 'detail', id],
    create: () => ['booking', 'create'],
    edit: (id: string) => ['booking', 'edit', id],
    delete: (id: string) => ['booking', 'delete', id],
  },
  venue: {
    list: (params?: any) => ['venues', 'list', params ?? {}] as const,
    detail: (id: string) => ['venues', 'detail', id] as const,
    create: () => ['venues', 'create'],
    edit: (id: string) => ['venues', 'edit', id],
    delete: (id: string) => ['venues', 'delete', id],
  },
  court: {
    list: () => ['courts', 'list'],
    detail: (id: string) => ['courts', 'detail', id],
    create: () => ['courts', 'create'],
    edit: (id: string) => ['courts', 'edit', id],
    delete: (id: string) => ['courts', 'delete', id],
  },
  sport: {
    list: () => ['sports', 'list'] as const,
  },
  search: {
    venues: (params?: Record<string, unknown>) => ['search', 'venues', params ?? {}] as const,
    suggestions: (q: string, limit?: number) => ['search', 'suggestions', q, limit ?? 8] as const,
    popular: (limit?: number) => ['search', 'popular', limit ?? 8] as const,
    recentlyViewed: () => ['search', 'recently-viewed'] as const,
  },
  notification: {
    list: () => ['notifications', 'list'],
    detail: (id: string) => ['notifications', 'detail', id],
    edit: (id: string) => ['notifications', 'edit', id],
  },
  amenity: {
    list: () => ['amenities', 'list'],
    detail: (id: string) => ['amenities', 'detail', id],
  },
};
