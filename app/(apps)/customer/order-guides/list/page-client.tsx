"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { OrderGuide, useOrderGuides } from "@/hooks/use-orders";

export const PageClient = () => {
  const { data, error, isPending, isError } = useOrderGuides();

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
    header: "Name",
    cell: ({ row }) => {
      const { name, id, teamId } = row.original;

      return (
        <Link
          href={`/customer/order-guides/${id}`}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2 font-medium">
            {name}
            {teamId ? (
              <Badge
                variant="outline"
                className="h-6 gap-1.5 rounded-xl border-green-200 bg-green-100 text-sm"
              >
                Active
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-7 gap-1.5 rounded-xl border-amber-200 bg-amber-100 text-sm"
              >
                Suggested
              </Badge>
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Tap to view order details
          </span>
        </Link>
      );
    },
  },

  {
    id: "itemCount",
    header: "Items",
    cell: ({ row }) => {
      const { itemCount } = row.original;
      return (
        <span className="text-muted-foreground font-medium">
          {itemCount} Items
        </span>
      );
    },
  },
  {
    id: "createdAt",
    meta: {
      className: "w-20",
    },
    header: "Created",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt!, "MMM dd • hh:mm a")}
        </span>
      );
    },
  },
  {
    id: "action",
    meta: {
      className: "text-right w-10",
    },
    header: "Action",
    cell: ({ row }) => {
      const { id, teamId } = row.original;
      return (
        <div className="flex gap-2 items-center justify-end">
          <Button type="button" variant="outline" size="icon-sm" asChild>
            <Link href={`/customer/order-guides/${id}`}>
              <Eye />
            </Link>
          </Button>
          {teamId && (
            <Button type="button" variant="destructive" size="icon-sm">
              <Trash2 />
            </Button>
          )}
        </div>
      );
    },
  },
];
