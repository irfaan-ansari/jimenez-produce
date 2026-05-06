"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { OrderGuide, useOrderGuides } from "@/hooks/use-orders";

export const OrderGuidesClientPage = () => {
  const { data, isPending, isError, error } = useOrderGuides();

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

export const columns: ColumnDef<OrderGuide>[] = [
  {
    accessorKey: "id",
    header: "Guide",
    cell: ({ row }) => {
      const { id, name, teamId } = row.original;
      return (
        <Link
          href={`/customer/order-guides/${id}`}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2 font-medium">
            {name}
            {!teamId && (
              <Badge
                variant="outline"
                className="h-7 gap-1.5 rounded-xl border-amber-200 bg-amber-100 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
              >
                Suggested
              </Badge>
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Tap to view details
          </span>
        </Link>
      );
    },
  },

  {
    id: "deliveryDate",
    header: "Items",
    cell: ({ row }) => {
      return <span>{row.original.itemCount}</span>;
    },
  },

  {
    id: "action",
    meta: {
      className: "text-right w-10",
    },
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const { id, teamId } = row.original;

      if (!teamId) return "-";

      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon" variant="outline" className="rounded-lg">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <Button type="button" variant="ghost" asChild>
            <Link href={`/customer/orders-guides/${id}`}>
              <SquarePen />
              Edit
            </Link>
          </Button>

          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
