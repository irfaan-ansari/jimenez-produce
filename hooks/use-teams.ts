"use client";

import { authClient } from "@/lib/auth/client";
import { fetcher } from "@/lib/helper/fetcher";
import { Member } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { User } from "better-auth/types";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listTeams();
      if (error) throw error;
      return data;
    },
  });
};

export const useOrganizationMembers = (q: string | undefined) => {
  return useQuery({
    queryKey: ["members", q],
    queryFn: async () => {
      return fetcher<{ data: Member[] }>(`/api/users?${q}`);
    },
  });
};

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

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listTeamMembers({
        query: { teamId },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
    retry: 0,
  });
};
