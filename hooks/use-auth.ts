"use client";
import { getSession, getUsers, signUp } from "@/server/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSignup = () => {
  return useMutation({
    mutationFn: signUp,
  });
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
};

export const useListUsers = (query?: string) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getUsers(query),
  });
};
