import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";

type StatusCounts = {
  data: Record<string, number>;
};

export const useStatusCount = (key: string) => {
  return useQuery<unknown, Error, StatusCounts>({
    queryKey: ["status-count", key],
    queryFn: () => fetcher(`/api/counts?key=${key}`),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
