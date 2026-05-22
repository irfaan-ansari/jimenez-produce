import {
  ProductSelectType,
  OrderGuideSelectType,
  OrderGuideItemSelectType,
  TeamSelectType,
} from "@/lib/db/schema";
import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export interface OrderGuideItem
  extends OrderGuideItemSelectType, Omit<ProductSelectType, "basePrice"> {
  finalPrice: ProductSelectType["basePrice"];
}

export interface OrderGuide extends OrderGuideSelectType {
  items: OrderGuideItem[];
}

export interface OrderGuidesResponse {
  data: OrderGuide[];
  pagination: Pagination;
}

export interface AdminOrderGuide extends OrderGuideSelectType {
  items: ProductSelectType[];
  teams: TeamSelectType[];
}

interface AdminOrderGuidesResponse {
  data: AdminOrderGuide[];
  pagination: Pagination;
}

export interface AdminOrderGuideItem
  extends OrderGuideItemSelectType, ProductSelectType {}

export const useInfiniteOrderGuides = (query?: string) => {
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

export const useAdminOrderGuides = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query).toString();
  return useQuery({
    queryKey: ["admin-order-guides", query],
    queryFn: () => {
      return fetcher<AdminOrderGuidesResponse>(`/api/order-guides?${url}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
