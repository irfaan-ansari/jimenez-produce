import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery } from "@tanstack/react-query";
import { OrderGuidesResponse } from "../types";

export const useOrderGuides = (query?: string) => {
  return useInfiniteQuery({
    queryKey: ["customer-order-guides", query],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams(query);

      params.set("page", String(pageParam));

      return fetcher<OrderGuidesResponse>(
        `/api/customer/order-guides?${params.toString()}`,
      );
    },
    getNextPageParam: ({ pagination }) => {
      const { page, totalPages } = pagination;

      return page < totalPages ? Number(page) + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
