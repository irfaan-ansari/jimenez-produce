"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { formatUSD } from "@/lib/utils";
import { OrderType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/use-customer";
import { ColumnDef } from "@tanstack/react-table";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { OrderActions } from "@/components/admin/order-actions";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useOrders({
    path: "/api/orders",
    query: searchParams.toString(),
  });

  // data
  return (
    <DataTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
};

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const map = STATUS_MAP[row.original.status as keyof typeof STATUS_MAP];

      return (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2">
            #{row.original.id}
            <Badge
              variant="outline"
              style={{ "--color": map.color } as React.CSSProperties}
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
            >
              <map.icon className="text-(--color)" />
              {map.label}
            </Badge>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Tap to view order details
          </span>
        </Link>
      );
    },
  },
  {
    id: "createdAt",
    header: "Placed",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt!, "MMM dd • hh:mm a")}
        </span>
      );
    },
  },

  {
    id: "deliveryDate",
    header: "Delivery",
    cell: ({ row }) => {
      const { deliveryDate, deliveryWindow, status } = row.original;
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{format(deliveryDate || new Date(), "MMMM dd")}</span>
          <span>•</span>
          <span>{status === "completed" ? "Delivered" : deliveryWindow}</span>
        </div>
      );
    },
  },

  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      return (
        <span className="font-medium">{formatUSD(row.original.total)}</span>
      );
    },
  },

  {
    id: "action",
    cell: ({ row }) => {
      return <OrderActions data={row.original} />;
    },
  },
];
