import {
  type CustomerSelectType,
  CustomerInviteSelectType,
} from "@/lib/db/schema";
import { createCustomer, deleteCustomer } from "@/server/customer";
import { fetcher } from "@/lib/helper/fetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CustomerMutateResponse = {
  id: number;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
type CustomerResponse = {
  data: CustomerSelectType[];
  pagination: Pagination;
};

type CustomerInviteResponse = {
  data: CustomerInviteSelectType[];
  pagination: Pagination;
};

export const useCustomers = (query?: string) => {
  return useQuery({
    queryKey: ["customers", query],
    queryFn: () => {
      return fetcher<CustomerResponse>(`/api/customers?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomer = (id: string | number) => {
  return useQuery<{ data: CustomerSelectType }>({
    queryKey: ["customer", id],
    queryFn: () => fetcher(`/api/customers/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvites = (query?: string) => {
  return useQuery({
    queryKey: ["invites", query],
    queryFn: () => {
      return fetcher<CustomerInviteResponse>(`/api/invites${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
