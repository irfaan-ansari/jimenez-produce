"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { formatUSD } from "@/lib/utils";
import { OrderType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-customer";
import { ColumnDef } from "@tanstack/react-table";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { CreditCard, Download, Eye, MoreVertical } from "lucide-react";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useOrders({
    path: "/api/customer/orders",
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

const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "id",
    header: "Invoice",
    cell: ({ row }) => {
      const map = STATUS_MAP["unpaid"];

      return (
        <Link
          href={`/customer/orders/${row.original.id}`}
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
    header: "Date",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt!, "MMM dd • hh:mm a")}
        </span>
      );
    },
  },
  {
    id: "updatedAt",
    header: "Due Date",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(row.original.updatedAt!, "MMM dd • hh:mm a")}
        </span>
      );
    },
  },
  {
    id: "total",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <span className="font-medium">{formatUSD(row.original.total)}</span>
      );
    },
  },

  {
    id: "action",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const { id } = row.original;
      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon" variant="outline" className="rounded-xl">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <Button type="button" variant="ghost" asChild>
            <Link href={`/customer/orders/${id}`}>
              <Eye />
              View
            </Link>
          </Button>
          <Button type="button" variant="ghost">
            <CreditCard />
            Pay now
          </Button>

          <Button variant="ghost" asChild>
            <a href={`/api/orders/${id}/invoice`} target="_blank">
              <Download /> Download Invoice
            </a>
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
