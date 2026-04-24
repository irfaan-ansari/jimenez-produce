"use client";
import { getSession } from "@/server/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
};
