"use client";
import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatusCount } from "@/hooks/use-status-count";
import { CircleDashed, Inbox, PackageCheck } from "lucide-react";

export const OrderStats = () => {
  const { data, isPending } = useStatusCount("orders");

  return (
    <div className="grid col-span-6 grid-cols-1 lg:grid-cols-3 gap-8">
      <Link
        href="/customer/orders?status=active"
        style={{ "--color": "#F59E0B" } as React.CSSProperties}
        className="flex flex-col p-6 border rounded-2xl gap-4 hover:ring-2 ring-offset-background ring-offset-1 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
            <CircleDashed className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">
              {data?.data?.active ?? 0}
            </div>
          )}
        </div>
        <div className="mt-4 text-ms font-medium">Active Orders</div>
      </Link>
      <Link
        href="/customer/orders?status=completed"
        style={{ "--color": "#22C55E" } as React.CSSProperties}
        className="flex flex-col p-6 border rounded-2xl gap-4 hover:ring-2 ring-offset-background ring-offset-1 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
            <PackageCheck className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">
              {data?.data?.completed ?? 0}
            </div>
          )}
        </div>
        <div className="mt-4 text-ms font-medium">Completed Orders</div>
      </Link>
      <Link
        href="/customer/orders"
        style={{ "--color": "#A1A1AA" } as React.CSSProperties}
        className="flex flex-col p-6 border rounded-2xl gap-4 hover:ring-2 ring-offset-background ring-offset-1 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="rounded-xl size-10 bg-(--color)/10 border border-(--color)/10 text-(--color) inline-flex items-center justify-center">
            <Inbox className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">{data?.data?.all ?? 0}</div>
          )}
        </div>
        <div className="mt-4 text-ms font-medium">All Orders</div>
      </Link>
    </div>
  );
};
