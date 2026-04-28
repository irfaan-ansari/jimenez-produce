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
      return fetcher<CustomerResponse>(`/api/applications/customer?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomer = (id: string | number) => {
  return useQuery<{ data: CustomerSelectType }>({
    queryKey: ["customer", id],
    queryFn: () => fetcher(`/api/applications/customer/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvites = (query?: string) => {
  return useQuery({
    queryKey: ["invites", query],
    queryFn: () => {
      return fetcher<CustomerInviteResponse>(`/api/invites/customer${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrders = ({
  path = "/api/orders",
  query,
}: {
  path?: string;
  query?: string;
}) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => {
      return fetcher<OrderResponse>(`${path}?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => {
      return fetcher<{ data: OrderResponse["data"][number] }>(
        `/api/orders/${id}`,
      );
    },
    staleTime: 1000 * 60 * 5,
  });
};
