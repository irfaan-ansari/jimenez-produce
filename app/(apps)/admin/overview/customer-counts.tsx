"use client";

import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatusCount } from "@/hooks/use-status-count";
import { Ban, OctagonPause, UserCheck, UserPlus } from "lucide-react";

export const CustomerCounts = () => {
  const { data, isPending } = useStatusCount("customers");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Link
        href="/admin/customers?status=active"
        style={{ "--color": "#22C55E" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
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
        <div className="text-ms mt-4 font-medium">Active Customers</div>
      </Link>

      <Link
        href="/admin/customers?status=new"
        style={{ "--color": "#F59E0B" } as React.CSSProperties}
        className="flex flex-col gap-4 rounded-xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
            <UserPlus className="size-5" />
          </span>
          {isPending ? (
            <Skeleton className="h-6 w-24 rounded-xl" />
          ) : (
            <div className="text-xl font-semibold">{data?.data?.new ?? 0}</div>
          )}
        </div>
        <div className="text-ms mt-4 font-medium">New Applications</div>
      </Link>

      <Link
        href="/admin/customers?status=on_hold"
        className="flex flex-col gap-4 rounded-xl border bg-card p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
        style={{ "--color": "#3B82F6" } as React.CSSProperties}
      >
        <div className="flex items-center gap-6 ">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
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
        <div className="text-ms mt-4 font-medium">On Hold</div>
      </Link>

      <Link
        href="/admin/customers?status=rejected"
        className="flex flex-col gap-4 rounded-xl border p-6 ring-offset-1 ring-offset-background hover:ring-2 hover:ring-ring/50"
        style={{ "--color": "#EF4444" } as React.CSSProperties}
      >
        <div className="flex items-center gap-6">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-(--color)/10 bg-(--color)/10 text-(--color)">
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
        <div className="text-ms mt-4 font-medium">Rejected</div>
      </Link>
    </div>
  );
};
