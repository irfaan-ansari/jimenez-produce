import { PromotionSelectType, TeamSelectType } from "@/lib/db/schema";
import { fetcher } from "@/lib/helper/fetcher";
import { Pagination } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export interface PromotionResponse {
  pagination: Pagination;
  data: PromotionSelectType & { teams: TeamSelectType };
}

export const usePromotions = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["promotions", query],
    queryFn: () => {
      return fetcher<PromotionResponse>(`/api/promotions?${url.toString()}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
