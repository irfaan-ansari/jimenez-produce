import {
  ProductSelectType,
  PromotionSelectType,
  TeamSelectType,
} from "@/lib/db/schema";
import { fetcher } from "@/lib/helper/fetcher";
import { Pagination } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export type PromotionTypeWithTeam = PromotionSelectType & {
  teams: TeamSelectType[];
  products: ProductSelectType[];
  triggerProducts: ProductSelectType[];
};

export interface PromotionResponse {
  pagination: Pagination;
  data: PromotionTypeWithTeam[];
}

export type PromotionProductType = Omit<ProductSelectType, "basePrice"> & {
  finalPrice: string;
};
export type PromotionTypeWithProduct = PromotionSelectType & {
  triggerProducts: PromotionProductType[];
  products: PromotionProductType[];
};

export interface PromotionResponseCustomer {
  pagination: Pagination;
  data: PromotionTypeWithProduct[];
}

export const usePromotions = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["promotions", query],
    queryFn: () =>
      fetcher<PromotionResponse>(`/api/promotions?${url.toString()}`),
  });
};

export const usePromotionsCustomer = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["promotions", query],
    queryFn: () => {
      return fetcher<PromotionResponseCustomer>(
        `/api/customer/promotions?${url.toString()}`,
      );
    },
    staleTime: 1000 * 60 * 5,
  });
};
