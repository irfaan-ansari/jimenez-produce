"use client";

import {
  type UserWithMember,
  type Pagination,
  type Team,
  type TeamDetail,
} from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/client";

export const useListTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listTeamMembers({
        query: {
          teamId,
        },
      });
      if (error) throw error;

      return data;
    },
  });
};

// list teams
export const useTeams = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query);
  return useQuery({
    queryKey: ["teams", query],
    queryFn: () =>
      fetcher<{ data: Team[]; pagination: Pagination }>(
        `/api/customers${url.toString() ? `?${url.toString()}` : ""}`,
      ),
  });
};

// get customer
export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => fetcher<{ data: TeamDetail }>(`/api/customers/${id}`),
  });
};

// list users
export const useUsers = (query?: Record<string, string>) => {
  const params = new URLSearchParams(query);
  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      return fetcher<{ data: UserWithMember[]; pagination: Pagination }>(
        `/api/users?${params.toString()}`,
      );
    },
  });
};

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: () =>
      fetcher<{ data: Omit<Team, "priceLevelId"> }>(`/api/customer/profile`),
    staleTime: 1000 * 60 * 5,
  });
};
