"use client";

import { useSession } from "@/hooks/use-auth";
import { useMemo } from "react";

export const WelcomeBanner = () => {
  const { data, isPending } = useSession();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting},{" "}
        <span className="text-primary">{data?.user?.name ?? "guest"}</span> 👋
      </h1>

      <p className="text-muted-foreground text-base max-w-2xl mt-1">
        Manage customers, job applications, invites, and products.
      </p>
    </div>
  );
};
