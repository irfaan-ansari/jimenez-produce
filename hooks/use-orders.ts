import {
  ProductSelectType,
  OrderGuideSelectType,
  OrderGuideItemSelectType,
} from "@/lib/db/schema";
import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export interface OrderGuide extends OrderGuideSelectType {
  itemCount: number;
}

export interface AdminOrderGuide extends OrderGuideSelectType {
  itemCount: number;
  customerCount: number;
}

interface OrderGuidesResponse {
  data: OrderGuide[];
  pagination: Pagination;
}

interface AdminOrderGuidesResponse {
  data: AdminOrderGuide[];
  pagination: Pagination;
}

export interface OrderGuideItem
  extends OrderGuideItemSelectType, Omit<ProductSelectType, "basePrice"> {
  finalPrice: ProductSelectType["basePrice"];
}
export interface AdminOrderGuideItem
  extends OrderGuideItemSelectType, ProductSelectType {}

interface OrderGuideResponse {
  data: OrderGuide & {
    items: OrderGuideItem[];
  };
}

interface AdminOrderGuideResponse {
  data: OrderGuide & {
    items: OrderGuideItem[];
    teams: { id: number; name: string }[];
  };
}

export const useOrderGuides = (enabled = true) => {
  return useQuery({
    queryKey: ["customer-order-guides-normal"],
    queryFn: () => {
      return fetcher<OrderGuidesResponse>(`/api/customer/order-guides`);
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useInfiniteOrderGuides = (query: string) => {
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

export const useOrderGuide = (id: number | string) => {
  return useQuery({
    queryKey: ["order-guide", id],
    queryFn: () => {
      return fetcher<OrderGuideResponse>(`/api/customer/order-guides/${id}`);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useAdminOrderGuides = (query?: string) => {
  return useQuery({
    queryKey: ["admin-order-guides", query],
    queryFn: () => {
      return fetcher<AdminOrderGuidesResponse>(`/api/order-guides?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminOrderGuide = (id: string | number) => {
  return useQuery({
    queryKey: ["admin-order-guide", id],
    queryFn: () => {
      return fetcher<AdminOrderGuideResponse>(`/api/order-guides/${id}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
