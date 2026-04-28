"use client";

import { type UserWithMember, Pagination, Team } from "@/lib/types";
import { authClient } from "@/lib/auth/client";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";

// list teams
export const useTeams = (q?: string) => {
  return useQuery({
    queryKey: ["teams", q],
    queryFn: () =>
      fetcher<{ data: Team[]; pagination: Pagination }>(
        `/api/teams${q ? "?" + q : ""}`,
      ),
  });
};

// list users
export const useUsers = (q: string | undefined) => {
  return useQuery({
    queryKey: ["users", q],
    queryFn: async () => {
      return fetcher<{ data: UserWithMember[] }>(`/api/users?${q}`);
    },
  });
};

// get active user
export const useActiveOrganizationMember = () => {
  return useQuery({
    queryKey: ["active-member"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.getActiveMember({});
      if (error) throw error;
      return data;
    },
  });
};
