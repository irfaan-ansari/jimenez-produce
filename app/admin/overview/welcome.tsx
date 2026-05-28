"use client";

import { authClient } from "@/services/auth";
import { useMemo } from "react";

export const WelcomeBanner = () => {
  const { data, isPending } = authClient.useSession();
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

      <p className="max-w-2xl mt-1 text-base text-muted-foreground">
        Manage customers, job applications, invites, and products.
      </p>
    </div>
  );
};
