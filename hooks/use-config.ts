import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { type LocationSelectType } from "@/lib/db/schema";

type LocationResponse = {
  data: LocationSelectType[];
  pagination: Pagination;
};

export const useLocations = (query?: string) => {
  return useQuery({
    queryKey: ["locations", query],
    queryFn: () => {
      return fetcher<LocationResponse>(`/api/locations?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
