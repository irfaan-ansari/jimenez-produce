import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";

type StatusCounts = {
  data: Record<string, number>;
};

export const useCountsByStatus = (path: string) => {
  return useQuery<unknown, Error, StatusCounts>({
    queryKey: ["status-counts", path],
    queryFn: () => fetcher(path),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
