import { fetcher } from "@/lib/helper/fetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getCategories,
  updateProduct,
} from "@/server/product";
import { ProductInsertType } from "@/lib/db/schema";
import { ProductResponse } from "@/lib/types";

type ProductMutateResponse = {
  id: number;
};

export const useProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => {
      return fetcher<ProductResponse>(`/api/products?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductMutateResponse, Error, ProductInsertType>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductMutateResponse, Error, ProductInsertType>({
    mutationFn: (data) => updateProduct(data.id as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductMutateResponse, Error, number>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
