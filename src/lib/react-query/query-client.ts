import { QueryClient } from '@tanstack/react-query';
import { queryConfig } from './query-config';
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});