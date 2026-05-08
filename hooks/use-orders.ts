import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  OrderGuideItemSelectType,
  OrderGuideSelectType,
} from "@/lib/db/schema";

export interface OrderGuide extends OrderGuideSelectType {
  itemCount: number;
}

interface OrderGuidesResponse {
  data: OrderGuide[];
  pagination: Pagination;
}

export interface OrderGuideItem extends OrderGuideItemSelectType {
  finalPrice: string;
  title: string;
  image: string;
  categories: string[];
  identifier: string;
}

interface OrderGuideResponse {
  data: OrderGuide & {
    items: OrderGuideItem[];
  };
}

export const useOrderGuides = (enabled = true) => {
  return useQuery({
    queryKey: ["order-guides"],
    queryFn: () => {
      return fetcher<OrderGuidesResponse>(`/api/customer/order-guides`);
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useInfiniteOrderGuides = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["order-guides", query],
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

export const useOrderGuide = (id: number | string) => {
  return useQuery({
    queryKey: ["order-guides", id],
    queryFn: () => {
      return fetcher<OrderGuideResponse>(`/api/customer/order-guides/${id}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
