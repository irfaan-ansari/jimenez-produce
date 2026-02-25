import { fetcher } from "@/lib/helper/fetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getCategories,
  updateProduct,
} from "@/server/product";
import { ProductInsertType, ProductSelectType } from "@/lib/db/schema";

type ProductMutateResponse = {
  id: number;
};

type ProductResponse = {
  data: ProductSelectType[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
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
