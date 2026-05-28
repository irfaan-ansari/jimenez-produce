"use client";

import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../types";

export const useOrders = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => {
      return fetcher<OrderResponse>(`/api/orders?${url.toString()}`);
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
