// hooks/useCustomQuery.ts
import { useQuery } from '@tanstack/react-query';


export function useCustomQuery(qKey, qFn) {
  return useQuery({
    queryKey: qKey,
    queryFn: () => qFn(),
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
    cacheTime: 1000 * 60 * 10, // Optional: keep unused data for 10 minutes
    refetchOnWindowFocus: true, // Optional: disable refetch on focus
  });
}
