import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { OrderGuideSelectType } from "@/lib/db/schema";

export interface OrderGuide extends OrderGuideSelectType {
  itemCount: number;
}

interface OrderGuidesResponse {
  data: OrderGuide[];
  pagination: Pagination;
}

export const useOrderGuides = () => {
  return useQuery({
    queryKey: ["order-guides"],
    queryFn: () => {
      return fetcher<OrderGuidesResponse>(`/api/customer/order-guides`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrderGuide = (id: number | string) => {
  return useQuery({
    queryKey: ["order-guides", id],
    queryFn: () => {
      return fetcher<OrderGuidesResponse>(`/api/customer/order-guides/${id}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
