import {
  type CustomerSelectType,
  CustomerInviteSelectType,
} from "@/lib/db/schema";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { type OrderResponse, type Pagination } from "@/lib/types";

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

export const useOrders = (query?: string) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => {
      return fetcher<OrderResponse>(`/api/orders?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
