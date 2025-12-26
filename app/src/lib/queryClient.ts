import { QueryClient } from '@tanstack/react-query';

const staleTimeInMilliseconds = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: staleTimeInMilliseconds,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
