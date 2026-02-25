"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ban, OctagonPause, UserCheck, UserPlus } from "lucide-react";
import { useStatusCount } from "@/hooks/use-status-count";
import { Skeleton } from "@/components/ui/skeleton";

export const CustomerCounts = () => {
  const { data, isPending } = useStatusCount("customers");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="rounded-2xl text-base">
        <CardContent
          className="flex flex-col gap-4"
          style={{ "--color": "#22C55E" } as React.CSSProperties}
        >
          <div className="flex items-center gap-6">
            <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
              <UserCheck className="size-5" />
            </span>
            {isPending ? (
              <Skeleton className="h-6 w-24 rounded-xl" />
            ) : (
              <div className="text-xl font-semibold">
                {data?.data?.active ?? 0}
              </div>
            )}
          </div>
          <div className="mt-4 text-ms font-medium">Active Customers</div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl text-base">
        <CardContent
          className="flex flex-col gap-4"
          style={{ "--color": "#F59E0B" } as React.CSSProperties}
        >
          <div className="flex items-center gap-6">
            <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
              <UserPlus className="size-5" />
            </span>
            {isPending ? (
              <Skeleton className="h-6 w-24 rounded-xl" />
            ) : (
              <div className="text-xl font-semibold">
                {data?.data?.new ?? 0}
              </div>
            )}
          </div>
          <div className="mt-4 text-ms font-medium">New Applications</div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl text-base">
        <CardContent
          className="flex flex-col gap-4"
          style={{ "--color": "#3B82F6" } as React.CSSProperties}
        >
          <div className="flex items-center gap-6">
            <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
              <OctagonPause className="size-5" />
            </span>
            {isPending ? (
              <Skeleton className="h-6 w-24 rounded-xl" />
            ) : (
              <div className="text-xl font-semibold">
                {data?.data?.on_hold ?? 0}
              </div>
            )}
          </div>
          <div className="mt-4 text-ms font-medium">On Hold</div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl text-base">
        <CardContent
          className="flex flex-col gap-4"
          style={{ "--color": "#EF4444" } as React.CSSProperties}
        >
          <div className="flex items-center gap-6">
            <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
              <Ban className="size-5" />
            </span>
            {isPending ? (
              <Skeleton className="h-6 w-24 rounded-xl" />
            ) : (
              <div className="text-xl font-semibold">
                {data?.data?.rejected ?? 0}
              </div>
            )}
          </div>
          <div className="mt-4 text-ms font-medium">Rejected</div>
        </CardContent>
      </Card>
    </div>
  );
};
