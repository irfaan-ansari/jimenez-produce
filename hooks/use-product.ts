import {
  TopProduct,
  type AdminProductResponse,
  type CustomerProductResponse,
  type ProductCategoriesResponse,
} from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => {
      return fetcher<AdminProductResponse | CustomerProductResponse>(
        `/api/products?${query}`,
      );
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteProducts = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", query],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams(query);

      params.set("page", String(pageParam));

      return fetcher<AdminProductResponse | CustomerProductResponse>(
        `/api/products?${params.toString()}`,
      );
    },
    getNextPageParam: ({ pagination }) => {
      const { page, totalPages } = pagination;

      return page < totalPages ? Number(page) + 1 : undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};

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

export const useTopProducts = (query?: string) => {
  return useQuery({
    queryKey: ["top-products", query],
    queryFn: () => {
      return fetcher<{ data: TopProduct[] }>(`/api/analytics/top-products`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
