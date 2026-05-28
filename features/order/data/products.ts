import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ProductResponse, ProductCategoriesResponse } from "../types";

export const useCategories = (query?: string) => {
  return useQuery({
    queryKey: ["product_categories", query],
    queryFn: () => {
      return fetcher<ProductCategoriesResponse>(
        `/api/products/categories?${query}`,
      );
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProducts = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["products", query],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams(query);

      params.set("page", String(pageParam));

      return fetcher<ProductResponse>(
        `/api/customer/products?${params.toString()}`,
      );
    },
    getNextPageParam: ({ pagination }) => {
      const { page, totalPages } = pagination;

      return page < totalPages ? Number(page) + 1 : undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};
