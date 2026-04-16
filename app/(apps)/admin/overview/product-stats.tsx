"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, CheckCircle, Lock } from "lucide-react";
import { useStatusCount } from "@/hooks/use-status-count";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCounts = () => {
  const { data, isPending } = useStatusCount("products");

  return (
    <Card className="rounded-2xl text-base lg:col-span-2 col-span-6">
      <CardHeader>
        <CardTitle className="font-semibold text-lg flex justify-between">
          Products
        </CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-row gap-4 items-center"
        style={{ "--color": "#22C55E" } as React.CSSProperties}
      >
        <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
          <CheckCircle className="size-5" />
        </span>
        <div className="text-ms font-medium text-muted-foreground flex-1">
          Active
        </div>

        {isPending ? (
          <Skeleton className="h-6 w-24 rounded-xl" />
        ) : (
          <div className="text-xl font-semibold">{data?.data?.active ?? 0}</div>
        )}
      </CardContent>

      <CardContent
        className="flex flex-row gap-4 items-center"
        style={{ "--color": "#6366F1" } as React.CSSProperties}
      >
        <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
          <Lock className="size-5" />
        </span>
        <div className="text-ms font-medium text-muted-foreground flex-1">
          Private
        </div>
        {isPending ? (
          <Skeleton className="h-6 w-24 rounded-xl" />
        ) : (
          <div className="text-xl font-semibold">
            {data?.data?.private ?? 0}
          </div>
        )}
      </CardContent>

      <CardContent
        className="flex flex-row gap-4 items-center"
        style={{ "--color": "#71717A" } as React.CSSProperties}
      >
        <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
          <Archive className="size-5" />
        </span>
        <div className="text-ms font-medium text-muted-foreground flex-1">
          Archived
        </div>
        {isPending ? (
          <Skeleton className="h-6 w-24 rounded-xl" />
        ) : (
          <div className="text-xl font-semibold">
            {data?.data?.archived ?? 0}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
