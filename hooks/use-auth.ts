"use client";
import { getSession, getUsers, signIn, signOut, signUp } from "@/server/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSignin = () => {
  return useMutation({
    mutationFn: signIn,
  });
};
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

export const useSignout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  });
};

export const useListUsers = (query?: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(query),
  });
};
