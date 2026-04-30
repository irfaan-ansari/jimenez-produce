"use client";

import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { type UserWithMember, Pagination, Team } from "@/lib/types";

// list teams
export const useTeams = (q?: string) => {
  return useQuery({
    queryKey: ["teams", q],
    queryFn: () =>
      fetcher<{ data: Team[]; pagination: Pagination }>(
        `/api/customers${q ? "?" + q : ""}`,
      ),
  });
};

// get customer
export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => fetcher<{ data: Team }>(`/api/customers/${id}`),
  });
};

// list users
export const useUsers = ({
  q,
  accountType,
}: {
  q?: string;
  accountType?: string;
}) => {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (accountType) params.set("accountType", accountType);

  return useQuery({
    queryKey: ["users", q, accountType],
    queryFn: async () => {
      return fetcher<{ data: UserWithMember[] }>(
        `/api/users?${params.toString()}`,
      );
    },
  });
};
