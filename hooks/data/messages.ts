import { MessageSelectType } from "@/lib/db/schema";
import { fetcher } from "@/lib/helper/fetcher";
import { Pagination } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export interface MessageResponse {
  pagination: Pagination;
  data: MessageSelectType[];
}

export const useMessages = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["messages", query],
    queryFn: () =>
      fetcher<MessageResponse>(`/api/promotions/messages?${url.toString()}`),
  });
};
