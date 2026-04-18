"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { formatUSD } from "@/lib/utils";
import { OrderType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/use-customer";
import { ColumnDef } from "@tanstack/react-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { OrderActions } from "@/components/admin/order-actions";
import { STATUS_MAP } from "@/lib/constants/status-map";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useOrders(
    searchParams.toString(),
  );

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
      return (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-medium hover:underline"
        >
          #{row.original.id}
        </Link>
      );
    },
  },
  {
    id: "createdAt",
    header: "Order Placed",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(row.original.createdAt!, "MMMM dd, yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(row.original.createdAt!, "hh:mm:ss a")}
          </span>
        </div>
      );
    },
  },

  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const { lineItems } = row.original;
      return (
        <div className="flex max-w-40 flex-col">
          <h4 className="truncate font-medium">
            {lineItems?.[0]?.title} Lorem ipsum dolor sit amet.
          </h4>
          {lineItems.length > 1 && <span>+ {lineItems.length - 1} Items</span>}
        </div>
      );
    },
  },

  {
    id: "deliveryDate",
    header: "Delivery Date",
    cell: ({ row }) => {
      const { deliveryDate, deliveryWindow } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(deliveryDate!, "MMMM dd, yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">
            {deliveryWindow}
          </span>
        </div>
      );
    },
  },
  {
    id: "shippingAddress",
    header: "Recipient",
    cell: ({ row }) => {
      const { receiverName, receiverPhone } = row.original;

      return (
        <div className="flex flex-col">
          <span>{receiverName}</span>
          <span>{receiverPhone}</span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      return <span>{formatUSD(row.original.total)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const map = STATUS_MAP[row.original.status as keyof typeof STATUS_MAP];
      return (
        <Badge
          variant="outline"
          style={{ "--color": map.color } as React.CSSProperties}
          className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
        >
          <map.icon className="text-(--color)" />
          {map.label}
        </Badge>
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
