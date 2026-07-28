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
    list: () => ['venues', 'list'],
    detail: (id: string) => ['venues', 'detail', id],
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
    list: () => ['sports', 'list'],
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