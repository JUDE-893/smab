// hooks/useCustomQuery.ts
import { useQuery, useMutation } from '@tanstack/react-query';


export function useCustomQuery(qKey, qFn) {
  return useQuery({
    queryKey: qKey,
    queryFn: () => qFn(),
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
    cacheTime: 1000 * 60 * 10, // Optional: keep unused data for 10 minutes
    refetchOnWindowFocus: true, // Optional: disable refetch on focus
  });
}

export function useCustomMutation(mFn) {
  return useMutation({
    mutationFn: async (data) => {
      let r = await mFn(data);

      // Check for successful status codes
      if (r.data.status !== 200 && r.data.status !== 201) {
        throw new Error(r.data.message || "Oops! Something went wrong. Try again");
      }

      return r?.data;
    }
  })
}
