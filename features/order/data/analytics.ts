import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { TopProduct } from "../types";

export const useTopProducts = (query?: string) => {
  return useQuery({
    queryKey: ["top-products", query],
    queryFn: () => {
      return fetcher<{ data: TopProduct[] }>(`/api/analytics/top-products`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
