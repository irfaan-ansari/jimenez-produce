import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../types";

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
