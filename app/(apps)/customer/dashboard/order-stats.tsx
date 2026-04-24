"use client";
import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatusCount } from "@/hooks/use-status-count";
import { CircleDashed, Inbox, PackageCheck } from "lucide-react";

export const OrderStats = () => {
  const { data, isPending } = useStatusCount("orders");

  return (
    <div className="col-span-6 grid grid-cols-1 gap-6 lg:gap-8 @md:grid-cols-2 @4xl:grid-cols-4">
      <Link
        href="/customer/orders?status=active"
        style={{ "--color": "#F59E0B" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
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
        <div className="text-ms mt-4 font-medium">Active Orders</div>
      </Link>
      <Link
        href="/customer/orders?status=completed"
        style={{ "--color": "#22C55E" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
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
        <div className="text-ms mt-4 font-medium">Completed Orders</div>
      </Link>
      <Link
        href="/customer/orders"
        style={{ "--color": "#A1A1AA" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
            <Inbox className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">{data?.data?.all ?? 0}</div>
          )}
        </div>
        <div className="text-ms mt-4 font-medium">All Orders</div>
      </Link>
      <Link
        href="/customer/orders"
        style={{ "--color": "#A1A1AA" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
            <Inbox className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">{data?.data?.all ?? 0}</div>
          )}
        </div>
        <div className="text-ms mt-4 font-medium">All Orders</div>
      </Link>
    </div>
  );
};
